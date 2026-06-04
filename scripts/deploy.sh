#!/usr/bin/env bash
# 海得宝网站自动部署脚本（由 GitHub Actions 触发）
# 在 CMS 发布内容后拉取最新代码并构建
set -e

PROJECT_DIR="/www/wwwroot/martempo/front-new"
cd "$PROJECT_DIR"

# 拉取最新代码
git pull origin main

# 安装依赖（如需）
npm install --production

# 构建静态站点
npm run build

echo "✅ 部署完成: $(date)"
