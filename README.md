# A-JIA-JIA · 55 款小游戏

家家和布里的休闲小游戏合集，纯静态网站，手机和电脑都能直接玩。

在线地址：https://a-jia-jia.github.io

## 本地运行

不需要安装任何东西，用任意静态服务器打开即可，例如：

```bash
python3 -m http.server 8000
```

然后访问 http://localhost:8000

> 直接双击打开 `index.html` 也能玩大部分游戏，但个别用到 ES Module（`import`）的游戏需要走 http 协议，直接打开文件会报错。

## 目录结构

| 位置 | 说明 |
|---|---|
| `index.html` / `app.js` / `home.css` | 首页：游戏列表、消消乐、合成（Suika）等内置玩法 |
| `buli-*.html` | 布里的游戏（2048、吃豆人、贪吃蛇、扫雷……） |
| `jiajia-*.html` | 家家的游戏（钓鱼、厨房、地铁、体素……） |
| `assets/` | 游戏素材（图片、模型） |
| `home-covers/` | 首页游戏封面图 |
| `vendor/` | 第三方图标与样式（Phosphor、DaisyUI 等） |
| `three.module.min.js` | Three.js（3D 游戏用） |
| `matter.js` | Matter.js 物理引擎（首页合成游戏用） |
| `cannon-es.mjs` | Cannon-es 物理引擎（3D 游戏用） |

每款游戏一般是 3–4 个文件：`xxx.html` + `xxx.css` + `xxx.js` + `xxx-ui.js`。

## 加一款新游戏

1. 在根目录新建 `xxx.html`、`xxx.css`、`xxx.js`（和 `xxx-ui.js`，如果需要）。
2. 在 `index.html` 的游戏列表里加一张卡片和封面图（放 `home-covers/`）。
3. 本地用 `python3 -m http.server` 验证后提交。

## 部署

推送到 `main` 分支后，GitHub Pages 会自动发布。仓库根目录有 `.nojekyll`，所以以下划线开头的文件和目录也会正常发布。

### 排行榜（Netlify）

舞台跑酷和叠舞台的公开排行榜要调 `/.netlify/functions/leaderboard`，
这是 Netlify 的后端接口，GitHub Pages 上没有。
想让排行榜生效，按 `DEPLOY.md` 把站部署到 Netlify 免费版即可，
接口代码在 `netlify/functions/leaderboard.js`，成绩存在 Netlify Blobs 里。

## 协议

- 本仓库代码：MIT License
- Three.js：见 `THREE-LICENSE.txt`
- Cannon-es：见 `CANNON-LICENSE.txt`
- 其余素材授权：见 `RHY-GAME-LICENSE.txt`
