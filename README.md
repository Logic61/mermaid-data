# 从鲛人到美人鱼：关于神话形象的跨文化重构的可视化研究

[![Deploy to GitHub Pages](https://github.com/Logic61/mermaid-data/actions/workflows/deploy.yml/badge.svg)](https://github.com/Logic61/mermaid-data/actions/workflows/deploy.yml)

在线版：<https://logic61.github.io/mermaid-data/>（GitHub Pages 部署成功后可用）

## 项目简介

本项目是一个纯静态的中文研究数据库网站，面向民间文学、比较文学与神话学的研究者与普通读者。它把鲛人、人鱼、美人鱼、塞壬、人魚、Siren、mermaid 等相关材料整理为可检索的条目，对每条材料编码形态、能力与叙事功能，并提供并置比较、时间轴与名称谱系等视图。

本项目不试图为这组形象编写定本辞书。问题意识、收录标准、方法路径、数据伦理与已知限制，见 [docs/研究说明.md](docs/研究说明.md)。

## 当前数据快照（2026 年 10 月）

| 项目 | 数值 |
|---|---|
| 条目总数 | 63 条 |
| 类型分布 | 古籍与古典图像 25 / 译名与译本 10 / 当代作品与论评 28 |
| 谱系分布 | 中国 24 / 西方 17 / 跨文化 13 / 东亚 9 |
| 置信度 | 确证 34 / 版本存异 15 / 待核 14 |
| 年代跨度 | 约公元前 725 年至 2023 年 |
| 参考书目 | 30 种，六类 |

另有离线数据表 `鲛人研究数据库_条目表_2026-10.xlsx`，包含条目总表、39 项特征编码矩阵、名称与译名表、参考书目与数据说明五个工作表，便于统计与二次分析。表格由 `node tools/export-json.js` 与 `python tools/build-xlsx.py` 从同一数据源生成，不另行维护。

## 如何打开

三种方式任选其一：

1. 在线访问：<https://logic61.github.io/mermaid-data/>（首次部署完成后可用）。
2. 双击项目根目录的 `index.html`，用现代浏览器（Chrome、Edge、Firefox、Safari 的较新版本）打开。
3. 在项目根目录启动任意本地静态服务器，例如 `python -m http.server 8000`，然后访问 `http://localhost:8000/`。

站点为纯静态实现，不使用 ES Module、`fetch()`、构建工具、后端服务与外部 CDN，因此以 `file://` 直接打开也可正常工作，断网可用。页面地址采用 hash 路由（如 `#/db`、`#/entry/<id>`、`#/compare`），可直接复制分享。

## 目录结构

```
鲛人/
├─ index.html                        站点入口
├─ 鲛人研究数据库_条目表_2026-10.xlsx  离线数据表（条目、编码矩阵、译名、书目、说明）
├─ .github/workflows/deploy.yml      GitHub Pages 自动部署工作流
├─ css/                              基础样式（base/components）与各页面私有样式
├─ js/                               核心工具、页面脚本、内联 SVG 图版（figures.js）
├─ data/                             数据层：schema.js、entries-cn.js、entries-global.js、bibliography.js
├─ docs/                             研究文档与数据审校报告
└─ tools/                            自测、浏览器交互测试与数据导出脚本
```

## 数据与条目维护

数据全部以经典脚本形式加载，挂载于 `window.JR_DATA`（条目）、`window.JR_SCHEMA`（术语与取值）、`window.JR_BIB`（参考书目）。数据文件只向数组追加内容，不定义函数，也不操作 DOM。

**字段定义以 `data/schema.js` 与 [docs/CONVENTIONS.md](docs/CONVENTIONS.md) 第 3 节为准**，本文件不重复字段清单。条目须齐全填写字段，可空字段给 `""` 或 `[]`；`kind`、`subtype`、`traits`、`narratives`、`confidence` 只能取 schema 允许的取值。

特征数 1 至 8 项（诗文用典与译名、译本类可仅 1 项），叙事 1 至 3 项。`medium` 为典籍、图像、诗歌、译名或 `kind` 为 `ancient` 的条目必须提供 `excerpt`；影视、动画、游戏、舞台、商业、学术类可为空，但须在 `summary` 末尾注明「本条目以作品信息为主，无原文引文」。

新增或修改条目的流程：

1. 打开对应数据文件：`data/entries-cn.js`（中国谱系与中译材料）、`data/entries-global.js`（古希腊罗马、欧洲、日韩与英语世界材料）。在文件末尾追加对象，不改动已有条目。
2. 按 [docs/编码手册.md](docs/编码手册.md) 判定并填写特征与叙事，逐条核对原文与 `sources`，不得凭印象编码。
3. 检查 `id` 全局唯一、`related` 指向存在的条目、`year` 为数字；年代不确定时用约数并在 `yearNote` 说明。
4. 在项目根目录运行 `node tools/check.js` 自测；若该脚本尚未生成，至少用 `node` 对修改过的数据文件做语法检查。
5. 把核查情况登记到 [docs/data-review.md](docs/data-review.md)，发现他人数据问题先记录并通知对应维护者，不直接改动。

文件所有权见 CONVENTIONS 第 7 节。新增书目须同时修改 `data/bibliography.js` 与 [docs/参考书目.md](docs/参考书目.md)。

## 自测与质量检查

在项目根目录依次运行：

```bash
node tools/check.js          # 数据字段、枚举、组别、出处、空引文政策、id 与 related 校验
node tools/render-check.js   # Node 环境渲染冒烟：10 个页面用例，无 DOM 依赖
node tools/export-json.js    # 导出 JSON（供 xlsx 生成）
python tools/build-xlsx.py   # 生成离线数据表
```

浏览器交互测试：用 Chrome 打开 `tools/browser-test.html`，或使用无头模式（需本机 Chrome）：

```bash
chrome --headless=new --window-size=1440,900 --virtual-time-budget=20000 \
       --dump-dom "file:///<项目绝对路径>/tools/browser-test.html"
```

2026-10-18 的验收结果：数据校验 63 条通过、0 提醒；渲染冒烟 10 个用例通过；浏览器交互测试在 1440、820、390 三种窗口尺寸下共 64 项断言全部通过（含检索、筛选、URL 同步、比较选择与矩阵、时间轴尺度与列表视图、名称节点筛选、移动端筛选抽屉），无未捕获脚本错误、无横向溢出。测试页面与脚本仅用于自检，不进入站点导航。

## 文档索引

| 文档 | 内容 |
|---|---|
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | 项目约定、技术底线、数据模型、文件所有权（权威） |
| [docs/研究说明.md](docs/研究说明.md) | 项目定位、四个研究问题、术语约定、收录范围、方法与伦理 |
| [docs/编码手册.md](docs/编码手册.md) | 39 个特征与叙事 id 的判定标准、编码流程、冲突处理规则 |
| [docs/参考书目.md](docs/参考书目.md) | 六类 30 种参考书目与体例说明 |
| [docs/data-review.md](docs/data-review.md) | 数据审校报告：抽查条目、问题等级与修改建议 |
| `data/schema.js` | 数据字典：字段、取值、术语表与推荐特征组合 |

网站「研究说明」「参考书目」等页面与本目录文档内容对应；文档适合离线阅读与引用，页面适合检索与比较。

## 部署（GitHub Pages）

仓库：`git@github.com:Logic61/mermaid-data.git`，在线地址：<https://logic61.github.io/mermaid-data/>。

`.github/workflows/deploy.yml` 在推送到 `main` 或手动触发（Actions → Deploy to GitHub Pages → Run workflow）时执行：

1. 运行 `node tools/check.js` 与 `node tools/render-check.js`，数据或渲染校验失败则停止部署，不发布有问题的版本；
2. 将站点所需文件（`index.html`、`css/`、`js/`、`data/`、`docs/`、`.nojekyll`）整理为 `_site`，测试脚本与临时文件不进入站点；
3. 通过 `peaceiris/actions-gh-pages` 把 `_site` 发布到 `gh-pages` 分支，再由 GitHub Pages 从该分支自动构建发布。

本仓库的 Pages 发布源已设置为 `gh-pages` 分支；日常更新只需 `git push origin main`，无需再手动操作。若日后重建仓库，请在 Settings → Pages → Build and deployment 中将 Source 设为「Deploy from a branch」并选择 `gh-pages` 分支；首次部署后同样会自动生效。

仓库中保留的 `gh-pages` 分支由 Action 维护（`force_orphan`，只保留最新一次发布内容），不要在其上手工开发。

## 引用与版权

- 引用本数据库时，请注明项目全称与数据更新日期（见 `data/schema.js` 中 `meta.dataUpdated`），并核对该条目的 `confidence` 与 `sources`。
- 条目中的古籍引文属研究性引用；仍在版权保护期内的作品只作简短引用，不提供整段文本、剧照或插图。
- 参考书目为研究入口，不是引文版本凭证；正式引用须回到原书核对版次、卷次与页码。
- 本项目是研究辅助工具，不提供定论。发现事实或编码问题，请记录在 `docs/data-review.md`，不要直接改动他人维护的数据文件。

## 已知限制

语种核对范围、版本异文、地区覆盖不均与编码主观性等限制，见 [docs/研究说明.md](docs/研究说明.md) 第八节。项目数据为持续修订状态，引用前请以条目所示 `confidence` 为准。

上一次数据审校于 2026-10-18 完成，覆盖 63 条的结构扫描与 24 条重点抽查，问题清单、修订与复核记录见 [docs/data-review.md](docs/data-review.md)。
