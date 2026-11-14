# 部署到 Netlify（免费版），修好排行榜

舞台跑酷和叠舞台的公开排行榜要调 `/.netlify/functions/leaderboard`，
这是 Netlify 的后端接口，GitHub Pages 是纯静态托管所以返回 404。
这份代码就是补上这个接口，成绩存在 Netlify Blobs 里，都是免费套餐的功能。

## 你要做的（大概 10 分钟）

### 1. 把这次的改动推到 GitHub

```bash
git add netlify.toml package.json netlify/functions/leaderboard.js README.md DEPLOY.md
git commit -m "Add Netlify leaderboard function"
git push
```

（`three.core.min.js` 的删除、`README.md` 的重写和 `.gitignore`
是之前结构整理那一步的改动，也可以一起推。）

### 2. 在 Netlify 上新建站点

1. 打开 https://app.netlify.com ，用 GitHub 账号登录（免费 Starter 套餐就行）。
2. Add new site → Import an existing project → 选 GitHub 上的
   `a-jia-jia/a-jia-jia.github.io`。
3. 构建设置一般会自动从 `netlify.toml` 读到：
   - Publish directory：`.`
   - Functions directory：`netlify/functions`
   - Build command：留空（纯静态站，不需要构建）。
4. 点 Deploy，第一次部署需要等它安装 `@netlify/blobs` 依赖，约 1–2 分钟。

### 3. 验证

- 打开 Netlify 给你的网址（比如 `https://a-jia-jia.netlify.app`）。
- 打开 `https://<你的网址>/.netlify/functions/leaderboard?game=runner`，
  应该返回 `{"scores":[]}`（一开始是空榜）。
- 玩一把舞台跑酷，提交成绩，再刷新页面，排行榜里应该出现你的名字。

## 注意

- 排行榜只在 Netlify 的网址上生效，旧的 GitHub Pages 地址
 （`https://a-jia-jia.github.io`）还是静态的，排行榜在那里依然是
  “只记录本机最佳”。想统一的话，可以把 GitHub Pages 关掉，
  只用 Netlify 的地址，或者在仓库设置里把 GitHub Pages 指向 Netlify。
- 榜单初始是空的，成绩是大家玩出来的。
- 免费套餐的函数调用量和 Blobs 存储对这个小站完全够用。
- 同词相遇（`jiajia-word.html`）还是占位页，它要的是实时房间服务，
  不在这个修复的范围内。
