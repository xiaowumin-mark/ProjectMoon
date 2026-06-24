# 网站发布说明

本仓库的书籍网站位于 `site/`，使用 Astro Starlight 构建。网站内容不会手动复制维护，而是在构建前由 `site/scripts/prepare-content.mjs` 从根目录的书稿与资料卡自动生成。

## 本地预览

```bash
cd site
npm install
npm run dev
```

## GitHub Pages 自动发布

1. 将 `book` 分支推送到 GitHub。
2. 进入仓库 `Settings -> Pages`。
3. 将 `Build and deployment -> Source` 设置为 `GitHub Actions`。
4. 每次推送 `book` 分支后，`.github/workflows/pages.yml` 会自动构建并发布。
5. 如果要绑定自己的域名，在仓库 `Settings -> Secrets and variables -> Actions -> Variables` 添加：

| 变量名 | 示例 | 说明 |
| --- | --- | --- |
| `CUSTOM_DOMAIN` | `book.example.com` | 写入 GitHub Pages 的 `CNAME` 文件 |
| `SITE_URL` | `https://book.example.com` | Astro canonical URL |
| `BASE_PATH` | `/` | 自定义域名使用 `/`；非自定义项目页才需要 `/repo-name/` |

推送命令：

```bash
git push -u origin book
```

Cloudflare DNS 推荐先使用灰云 `DNS only` 完成 GitHub Pages 证书签发，确认 HTTPS 正常后再按需要切换橙云代理。

子域名推荐配置：

| 类型 | 名称 | 目标 | 代理状态 |
| --- | --- | --- | --- |
| `CNAME` | `book` | `你的 GitHub 用户名.github.io` | 先用 `DNS only` |

裸域名配置请按 GitHub Pages 官方 A/AAAA 记录设置；本项目更推荐先使用 `book.example.com` 这类子域名。

## CI 会做什么

GitHub Actions 会按顺序执行：

1. 检出 `book` 分支。
2. 安装 Node.js 22。
3. 在 `site/` 下执行 `npm ci`。
4. 执行 `npm run build`，从原始书稿生成网站并构建静态页面。
5. 执行 `npm run check:links`，检查产物里的站内链接是否指向实际文件。
6. 发布 `site/dist/` 到 GitHub Pages。

## 内容同步规则

每次执行 `npm run build` 时会自动同步：

- `manuscript/` -> 正文章节与附录
- `notes/people/` -> 人物索引与人物页
- `notes/events/` -> 事件索引与事件页
- `notes/organizations.md` -> 组织索引与组织页
- `notes/places.md` -> 地点索引与地点页
- `notes/timeline.md` -> 总时间线
- `notes/terminology.md` -> 术语表
- `sources/index/` -> 资料来源索引与来源页

更新正文或资料卡后，不需要手动改网站页面，直接重新构建即可。
