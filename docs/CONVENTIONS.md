# 项目约定（全队必读）

项目全称：**从鲛人到美人鱼——关于神话形象的跨文化重构的可视化研究**
交付物：一个**可直接双击打开**的中文研究数据库网站（静态站点，无构建、无后端、无外部 CDN），以及配套研究文档。
研究方向：中国民间文学 / 比较文学 / 神话学；对象为鲛人、美人鱼、塞壬等跨文化形象在名称、外形、叙事功能上的趋同、留存与变化机制。

---

## 1. 技术底线（硬约束）

1. **纯静态**：`index.html` + CSS + 经典 `<script>`（非 ES Module）。不得使用 `type="module"`、`fetch()`、`import`、打包器。原因：用户可能直接以 `file://` 打开，模块与 fetch 会被 CORS 拦截。
2. **零外部依赖**：不加载 CDN 字体、图标库、JS 库、外部图片。字体使用系统中文字体栈；图像一律由 `js/figures.js` 内联 SVG 提供。
3. **全局命名空间**：`window.JR`（工具与页面注册）、`window.JR_DATA`（数据）、`window.JR_SCHEMA`（术语表）、`window.JR_BIB`（参考书目）。数据文件只 push 数组，不定义函数。
4. **脚本顺序**（`index.html` 中）：`data/schema.js` → `data/entries-cn.js` → `data/entries-global.js` → `data/bibliography.js` → `js/figures.js` → `js/core.js` → 页面脚本 → `js/app.js`。页面脚本必须在 `app.js` 之前，且在文件末尾调用 `JR.page(...)` 自行注册。
5. **每条页面脚本、样式文件归一名 owner**（见第 7 节），不得修改他人文件；发现他人文件有问题，发消息给 owner 或 Lead。
6. **无控制台报错**。每次改完自测：数据文件用 node 语法检查；页面 render 函数应可在 Node 里以纯字符串方式调用（不依赖 DOM）。
7. **URL 采用 hash 路由**：`#/`、`#/db`、`#/entry/<id>`、`#/compare`、`#/timeline`、`#/terms`、`#/about`。查询参数放在 hash 内，如 `#/db?q=鲛人&kind=ancient&traits=b_tears_pearl`。

---

## 2. 设计方向（已锁定，不再发散）

**设计读法**：面向中文人文学者的研究档案型网站，视觉语言为「海洋志异档案 / 古籍图版」，用冷调青灰纸色、墨色、深青主色与朱砂印色；衬线宋体承担标题与引文（本项目属文献/神话/古籍研究，衬线有明确理据），黑体承担界面与长文。

- 三个旋钮：`DESIGN_VARIANCE 7 / MOTION_INTENSITY 5 / VISUAL_DENSITY 5`。
- **单一浅色主题**，全站不得出现深色反色区块；不得做主题切换。
- **唯一强调色为深青 `--teal`**；朱砂 `--seal` 只用于印章、当前选中、关键标记，且全站一致。
- **圆角系统统一为 2px**（按钮、输入、面板、标签全部 2px；无胶囊按钮、无大圆角卡片）。不用阴影表达层级，用 1px 线、留白与底色差。
- 不使用 emoji。图标只允许使用本项目已内置的少量内联 SVG（见 `js/figures.js` 与 `JR.icon()`），不得自行绘制新图标。
- 中文排印：正文使用全角标点；引文用「」或独立引文块；书名用《》。除官方项目名「从鲛人到美人鱼——关于神话形象的跨文化重构的可视化研究」及直接引文外，**正文避免使用破折号**（不要用英文 em dash，也不要装饰性破折号）。
- 动效克制：入场淡入、SVG 线条描画、时间轴移动；全部有 `prefers-reduced-motion` 降级；不做滚动劫持、不做无限循环动画。
- 无障碍：语义化 HTML；对比度 ≥ WCAG AA；键盘可达；`:focus-visible` 清晰；表单 label 在输入框上方；图片/SVG 有 `aria-label` 或 `role="img"`。

### CSS 变量（已定义于 `css/base.css`，页面样式必须复用，不得另起色板）

```
--paper #eef0e9   --paper-2 #e3e7dd   --panel #f6f7f1
--ink #16221f     --ink-2 #3a4944     --muted #66746e
--line #c7d0c5    --line-2 #9fad9f
--teal #1d5c54    --teal-deep #123f3a --teal-soft #d7e2da
--seal #a63a2b    --seal-soft #ead9d2 --sand #e9e3d1
--font-serif 宋体栈 / --font-sans 黑体栈 / --font-mono 等宽栈
--radius 2px   --nav-h 68px   --wrap 1320px   --gutter clamp(20px,4vw,56px)
```

### 全站通用组件（已实现于 `css/base.css`、`css/components.css`，直接用）

` .wrap ` `.section` `.section-head` `.kicker` `.display` `.lede` `.meta` `.rule` `.rule-label`
` .btn` `.btn--solid` `.btn--ghost` `.btn--sm` `.link` `.chip` `.chip.is-on` `.tag` `.seal`
` .panel` `.field` `.input` `.select` `.search` `.empty` `.stat` `.figure` `.caption` `.sr-only` `.toast`
` .table`（比较矩阵）`.muted` `.mono` `.num`

页面私有样式分别放：首页/研究说明 → `css/pages-home.css`（Lead）；数据库/详情/比较 → `css/pages-db.css`；时间轴/谱系 → `css/pages-viz.css`。选择器统一加页面前缀（如 `.db-`、`.cmp-`、`.tl-`、`.term-`）。

---

## 3. 数据模型（`data/schema.js` 为准）

每个条目是一个对象，push 到 `window.JR_DATA.entries`。**字段必须齐全**（可空的可给 `""`/`[]`），文案全部中文（原文引文、作品原名除外）。

```js
{
  id: "cn-bowuzhi-jiaoren",          // 唯一，前缀 cn- 或 gl-，小写 ASCII + 连字符
  kind: "ancient",                    // ancient | translation | modern 三选一
  subtype: "志怪",                    // 见 schema.JR_SCHEMA.subtypes
  title: "《博物志》鲛人条",           // 条目显示名，可含书篇名
  work: "《博物志》",                  // 出处作品；当代作品写作品名
  creator: "张华（传）",              // 作者/导演/公司/译者；佚名写「佚名」
  eraLabel: "西晋",                   // 时代/年代标签
  year: 290,                          // 数字年份，公元前为负数；估算取中值，禁止为求精确而编造
  yearNote: "约",                      // 约 / 成书年代有争议 / 可确证 等，可空
  dateDisplay: "约 3 世纪末",          // 页面展示用
  culture: "中国",                    // 中国 | 西方 | 东亚 | 跨文化
  region: "中国",                     // 地区（见 schema.regions 建议值）
  medium: "典籍",                     // 典籍 | 图像 | 诗歌 | 影视 | 动画 | 游戏 | 商业 | 译名 | 学术
  term: {
    primary: "鲛人",
    variants: ["人鱼", "泉先", "泉客"],
    original: "",                     // 原文词/外语词，如 "Sirens" / "人魚"
    note: "「鲛」在古汉语中亦指鲨鱼，需与「鲛人」区分。"
  },
  traits: ["m_human_upper", "m_fish_tail", "b_tears_pearl"],  // 只能取 schema.traits 的 id
  narratives: ["f_gratitude", "f_encounter"],                  // 只能取 schema.narratives 的 id
  tags: ["南海", "志怪", "织绡"],       // 自由标签，2-5 个，用于检索
  excerpt: "南海之外有鲛人，水居如鱼，不废织绩，其眼泣则能出珠。",  // 原文/引文，可换行
  excerptSource: "《搜神记》卷十二",     // 引文出处（与 sources 呼应）
  translation: "",                    // 今译/英译/作品官方译名，可空
  summary: "……",                      // 120-220 字，客观描述该条目内容
  significance: "……",                 // 60-120 字，说明它与「跨文化重构」问题的关系
  sources: [
    { label: "《搜神记》卷十二", detail: "中华书局汪绍楹校注本", url: "https://ctext.org/sou-shen-ji" }
  ],
  confidence: "确证",                  // 确证 | 版本存异 | 待核
  related: ["cn-shuyiji-quanxian"],    // 相关条目 id，最多 4 个
  figure: "jiao-ren"                   // 可选，见 figures.js 的键名；不确定就省略
}
```

写作要求：
- `summary` 与 `significance` 必须是研究性、克制的书面中文；不写营销语、不写「据说」而无出处。
- 引文尽量逐字核对（优先 ctext.org、维基文库、中华经典古籍库等可核来源），**不得伪造原文、卷次、页码、译者或出版信息**。无法确证者：`confidence: "待核"`，并在 `sources[].detail` 写明「转引，待核」。
- 年代不确定就写约数，`year` 用估算中值，`yearNote` 说明。
- 每条 1-8 个 traits、1-3 个 narratives；不要把所有特征都勾上。诗文用典、译名/译本条目允许只标 1 项，但不得为凑数补无据特征。
- `excerpt` 政策：`medium` 为典籍、图像、诗歌、译名，或 `kind` 为 ancient 的条目，`excerpt` 必填原文/引文；影视、动画、游戏、舞台、商业、学术等以作品信息为主的条目可为空，但须在 `summary` 末尾或 `term.note` 中注明「本条目以作品信息为主，无原文引文」。
- 枚举调整（2026-10）：`subtype` 增加「舞台」「医书」，`medium` 增加「舞台」。舞剧/舞台剧条目使用 `subtype: "舞台"`、`medium: "舞台"`；本草/医书类使用 `subtype: "医书"`。
- `kind` 的判断：古籍原典/古典图像/古典诗文 = `ancient`；译名、译本、跨语言命名、术语 = `translation`；当代影视/动画/游戏/小说/品牌/学术评论 = `modern`。
- `related` 允许指向尚未写到的 id，但必须在 `docs/data-review.md` 里列出待补清单（由 Lead 统一收口）。更稳妥：只指向已确定的 id。

---

## 4. 页面注册与渲染契约（`js/core.js`）

页面脚本末尾：

```js
JR.page('db', {
  title: '资料库',
  render(params) { return '<section class="wrap">…</section>'; }, // 返回 HTML 字符串，必须已转义
  mount(root, params) { /* 可选：事件绑定、状态 */ },
  unmount() { /* 可选：清理 */ }
});
```

- 所有插入数据的文本必须经 `JR.esc()`；属性经 `JR.escAttr()`。
- 事件用 `root.querySelector`/`addEventListener`，禁止内联 `onclick`。
- 导航用 `location.hash = '#/entry/' + id` 或 `JR.go(...)`；不要整页刷新。
- 页面挂载后不得全局劫持事件；需要监听 hashchange 的页面在 `unmount` 中移除。
- 数据都在内存里，渲染是同步的：**不需要 loading 态**；但筛选无结果时必须有 `.empty` 空状态，且提供「清除筛选」按钮。
- 当前页高亮由 `app.js` 统一处理。

可用工具（`JR.*`，详见 `js/core.js` 注释）：`esc` `escAttr` `fmtYear` `fmtRange` `byId` `entries` `kindLabel` `traitLabel` `traitGroupLabel` `narrativeLabel` `cultureClass` `figure` `icon` `go` `getQuery` `setQuery` `debounce` `unique` `sortEntries` `download` `toast` `plural`。

---

## 5. 内容与事实质量（最重要的一条）

1. 本网站是**研究辅助工具**，不是最终定本。任何不确定的归属、年代、异文，都必须通过 `confidence` 与 `yearNote` 显式标注，宁缺毋滥。
2. 禁止编造：书名、篇名、卷次、作者、译者、出版年、网址、原文引句、译者姓名、英译名。
3. 优先使用一手材料（原典、作品官方信息、权威辞书/百科仅作线索），并尽量给出可点击的核对链接（ctext.org、维基文库、豆瓣/IMDb/官方网站、出版社页）。
4. 译名类条目要写清「原词 → 译入语 → 译名 → 译名变化」，注明译名出处（某译本/某版字幕/某词典），不能只写「有人译作」。
5. 涉及仍在版权保护期内的作品，只做简短引用（≤ 100 字），不复制大段文本、不搬运剧照。
6. 站点文案禁用「赋能」「打造」「一键」「海量」「尽在」等产品营销词；用学者口吻说明能做什么、不能做什么。
7. 所有文件 UTF-8 无 BOM，换行 LF（Windows 下编辑注意）。

---

## 6. 自测与验收

提交前在项目根目录运行（Lead 提供的脚本，先建 `tools/check.js`）：

```
node tools/check.js
```

- 检查项：所有 `data/*.js` 语法可解析；条目字段完整；`kind/subtype/traits/narratives/confidence` 取值合法；id 唯一；年份为数字；related 指向存在；每页 `render` 在 Node 中返回非空字符串且无未定义变量。
- 数据自测（交给 curator）：把自己文件的条目数、年代跨度、类型分布、存疑条目列成 5 行以内消息回给 Lead。
- 前端自测（交给 builder）：`node tools/render-check.js` 能渲染页面 HTML；再用 grep 检查占位符字符串（TODO/lorem/undefined/NaN）。
- 页面视觉由 Lead 用 Chrome headless 抽检截图；如浏览器被沙箱拦截，改用 DOM/HTML 静态检查，并如实说明。

---

## 7. 文件所有权（写作用域，冲突即停）

| 路径 | owner | 说明 |
|---|---|---|
| `index.html` `css/base.css` `css/components.css` `css/pages-home.css` `js/core.js` `js/app.js` `js/figures.js` `js/pages/home.js` `js/pages/about.js` `data/schema.js` `docs/CONVENTIONS.md` `tools/check.js` | Lead | 任何人不得改 |
| `data/entries-cn.js` | curator-cn | 中国古籍、汉译/中译、当代华语作品 |
| `data/entries-global.js` | curator-global | 古希腊罗马、欧洲、日韩、英语世界当代作品 |
| `data/bibliography.js` | research-editor | 参考书目数据（`JR_BIB`） |
| `js/pages/db.js` `js/pages/entry.js` `js/pages/compare.js` `css/pages-db.css` | builder-db | 资料库、条目详情、并置比较 |
| `js/pages/timeline.js` `js/pages/terms.js` `css/pages-viz.css` | builder-viz | 时间轴、名称谱系 |
| `docs/研究说明.md` `docs/编码手册.md` `docs/参考书目.md` `docs/data-review.md` `README.md` | research-editor | 文档；README 由 Lead 终审 |
| `tools/render-check.js` `tools/qa-*.js` | qa（后派） | 测试脚本 |

跨文件需求（如 builder 需要某数据字段）：先发消息给 owner 或 Lead，不要直接改他人文件。

---

## 8. 沟通规则

- 每完成一个阶段，用 `send_message` 向 Lead 报 5 行以内：完成项 / 文件 / 自测结果 / 待决问题 / 下一步。
- 遇到事实无法确认：在数据里标 `待核`，并在消息里单列，不要自行编造。
- 遇到设计/接口分歧：以本文件为准；本文件没写的，先问 Lead，不要擅自改公共契约。
- 不要运行 `git`、不要安装依赖、不要启动长期服务；不得在项目根目录生成临时大文件（截图/日志放 `tools/_out/`，交付前清理）。
