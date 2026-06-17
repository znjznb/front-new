# Decap CMS GitHub OAuth 中转服务

Decap 的纯 `github` backend 不支持浏览器端 PKCE，必须有一个 OAuth 中转服务完成
GitHub OAuth 握手。本目录就是这个服务（零依赖，Node 原生）。

## 工作原理

```
CMS /admin 点登录
  → https://www.martempo.com.cn/oauth/auth   (Nginx 反代到本服务)
  → 302 跳转 GitHub 授权页
  → GitHub 回调 /oauth/callback?code=...
  → 本服务用 code + client_secret 换 access_token
  → 返回 HTML，用 postMessage 把 token 回传给 CMS 窗口 → 登录成功
```

## 部署（已在服务器配好，重装后照此恢复）

1. 进入目录并配置环境变量
   ```bash
   cd /www/wwwroot/martempo/front-new/oauth-provider
   cp .env.example .env
   # 编辑 .env，填入 GitHub OAuth App 的 Client Secret
   ```

2. systemd 常驻（service 文件见 `decap-oauth.service`）
   ```bash
   cp decap-oauth.service /etc/systemd/system/decap-oauth.service
   # 确认 service 里的 node 绝对路径与 `which node`（nvm）一致
   systemctl daemon-reload
   systemctl enable --now decap-oauth
   systemctl status decap-oauth
   ```

3. Nginx 反代（在站点配置里加）
   ```nginx
   location /oauth/ {
       proxy_pass http://127.0.0.1:3010;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

4. GitHub OAuth App（https://github.com/settings/applications/3640153）
   - Authorization callback URL: `https://www.martempo.com.cn/oauth/callback`

5. CMS 配置（`src/pages/admin/index.astro`）
   ```js
   backend: {
     name: 'github',
     repo: 'znjznb/front-new',
     branch: 'main',
     base_url: 'https://www.martempo.com.cn',
     auth_endpoint: 'oauth/auth',
   }
   ```

## 健康检查

```bash
curl -s http://127.0.0.1:3010/oauth/health   # ok = 凭据已配；missing-credentials = 没填 secret
```
