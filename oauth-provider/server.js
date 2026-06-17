/**
 * Decap CMS GitHub OAuth 中转服务（零依赖，Node 原生）
 *
 * Decap 的纯 github backend 不支持 client-side PKCE，必须经过一个 OAuth provider
 * 完成 GitHub OAuth 握手。本服务实现 netlify-cms / decap-cms 约定的 OAuth 流程：
 *   1. GET  /oauth/auth      → 302 跳转到 GitHub 授权页
 *   2. GET  /oauth/callback  → 用 code 换 access_token，再用 postMessage 回传给 CMS 窗口
 *
 * 环境变量（见 .env）：
 *   OAUTH_CLIENT_ID      GitHub OAuth App 的 Client ID
 *   OAUTH_CLIENT_SECRET  GitHub OAuth App 的 Client Secret
 *   OAUTH_PORT           本地监听端口（默认 3010，仅 127.0.0.1）
 *   OAUTH_BASE_URL       站点根地址，用于拼 redirect_uri（默认 https://www.martempo.com.cn）
 */
'use strict';
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { URL } = require('url');

const CLIENT_ID = process.env.OAUTH_CLIENT_ID || '';
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '';
const PORT = parseInt(process.env.OAUTH_PORT || '3010', 10);
const BASE_URL = (process.env.OAUTH_BASE_URL || 'https://www.martempo.com.cn').replace(/\/+$/, '');
const REDIRECT_URI = BASE_URL + '/oauth/callback';
const PROVIDER = 'github';

function renderResult(status, payload) {
  // payload 已是 JSON 字符串；转义 < 防止 HTML 注入
  const safe = String(payload).replace(/</g, '\\u003c');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Authorizing…</title></head>
<body><script>
  (function () {
    function receiveMessage(e) {
      window.opener && window.opener.postMessage(
        'authorization:${PROVIDER}:${status}:${safe}',
        e.origin
      );
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener && window.opener.postMessage('authorizing:${PROVIDER}', '*');
  })();
</script>
<p>授权处理中，请稍候……如果窗口没有自动关闭，可手动关闭。</p>
</body></html>`;
}

function htmlResponse(res, body, code) {
  res.writeHead(code || 200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let u;
  try { u = new URL(req.url, BASE_URL); } catch (e) { res.writeHead(400); return res.end('bad request'); }
  const path = u.pathname.replace(/\/+$/, '') || '/';

  // 健康检查
  if (path === '/oauth/health' || path === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end(CLIENT_ID && CLIENT_SECRET ? 'ok' : 'missing-credentials');
  }

  // 第 1 步：跳转到 GitHub 授权
  if (path === '/oauth/auth' || path === '/auth') {
    if (!CLIENT_ID) { res.writeHead(500); return res.end('OAUTH_CLIENT_ID not set'); }
    const state = crypto.randomBytes(16).toString('hex');
    const gh = new URL('https://github.com/login/oauth/authorize');
    gh.searchParams.set('client_id', CLIENT_ID);
    gh.searchParams.set('redirect_uri', REDIRECT_URI);
    gh.searchParams.set('scope', u.searchParams.get('scope') || 'repo');
    gh.searchParams.set('state', state);
    res.writeHead(302, { Location: gh.toString() });
    return res.end();
  }

  // 第 2 步：GitHub 回调，用 code 换 token
  if (path === '/oauth/callback' || path === '/callback') {
    const code = u.searchParams.get('code');
    if (!code) return htmlResponse(res, renderResult('error', JSON.stringify('No code returned from GitHub')));
    if (!CLIENT_SECRET) return htmlResponse(res, renderResult('error', JSON.stringify('OAUTH_CLIENT_SECRET not set')));

    const postData = JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    });
    const opts = {
      hostname: 'github.com',
      path: '/login/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'decap-cms-oauth-provider',
      },
    };
    const greq = https.request(opts, (gres) => {
      let body = '';
      gres.on('data', (d) => (body += d));
      gres.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j.access_token) {
            const content = JSON.stringify({ token: j.access_token, provider: PROVIDER });
            return htmlResponse(res, renderResult('success', content));
          }
          return htmlResponse(res, renderResult('error', JSON.stringify(j.error_description || j.error || 'No access_token')));
        } catch (e) {
          return htmlResponse(res, renderResult('error', JSON.stringify('Token response parse error')));
        }
      });
    });
    greq.on('error', (e) => htmlResponse(res, renderResult('error', JSON.stringify(String(e)))));
    greq.write(postData);
    greq.end();
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[decap-oauth] listening on 127.0.0.1:${PORT}, redirect_uri=${REDIRECT_URI}, client_id=${CLIENT_ID ? 'set' : 'MISSING'}`);
});
