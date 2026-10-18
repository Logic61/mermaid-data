/* ==========================================================================
   研究说明页：项目问题、收录范围、编码方法、数据概要、编码手册摘要、参考书目、局限与引用
   ========================================================================== */
(function () {
  'use strict';

  var JR = window.JR;
  var S = JR.schema;

  function countKind(kind) {
    return JR.entries.filter(function (e) { return e.kind === kind; }).length;
  }
  function countConfidence(c) {
    return JR.entries.filter(function (e) { return e.confidence === c; }).length;
  }
  function countCulture(c) {
    return JR.entries.filter(function (e) { return e.culture === c; }).length;
  }
  function yearRange() {
    var ys = JR.entries.map(function (e) { return e.year; }).filter(function (y) { return typeof y === 'number'; });
    if (!ys.length) return { min: null, max: null };
    return { min: Math.min.apply(null, ys), max: Math.max.apply(null, ys) };
  }
  function sourcesCount() {
    return JR.entries.reduce(function (sum, e) { return sum + (e.sources ? e.sources.length : 0); }, 0);
  }

  function stat(num, label) {
    return '<div class="stat"><span class="stat__num">' + JR.esc(String(num)) + '</span><span class="stat__label">' + JR.esc(label) + '</span></div>';
  }

  function questions() {
    return (S.questions || []).map(function (q) {
      return '<div class="about-q"><span class="about-q__n">' + JR.esc(q.n) + '</span><p>' + JR.esc(q.q) + '</p></div>';
    }).join('');
  }

  function kindTable() {
    var rows = (S.kinds || []).map(function (k) {
      var desc = {
        ancient: '传世文献、古典诗文与古典图像中的记载。以原文、篇目、卷次与版本为基本单位。',
        translation: '同一名称或作品的跨语言对译，包括音译、意译、译名竞争与术语分层。',
        modern: '近现代以来的小说、影视、动画、游戏、品牌与学术论评，是形象再编码的主要现场。'
      }[k.id] || '';
      return '<tr><td>' + JR.esc(k.label) + '</td><td class="mono">' + countKind(k.id) + '</td><td>' + JR.esc(desc) + '</td></tr>';
    }).join('');
    return '<div class="table-wrap"><table class="about-kinds"><caption class="sr-only">三类条目的定义与数量</caption>' +
      '<thead><tr><th scope="col">条目类型</th><th scope="col">数量</th><th scope="col">收录重点</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  function dataStats() {
    var range = yearRange();
    var kinds = (S.kinds || []).map(function (k) { return countKind(k.id); }).join(' / ');
    var culturesPresent = (S.cultures || []).filter(function (c) { return countCulture(c.id) > 0; }).map(function (c) { return c.label; }).join('、') || '待补';
    return '<div class="about-stats">' +
      stat(JR.entries.length, '条目总数') +
      stat(kinds, '三类分布') +
      stat(sourcesCount(), '登记出处数') +
      stat(culturesPresent, '覆盖谱系') +
      '</div>' +
      '<p class="caption">年代跨度：' + (range.min !== null ? JR.esc(JR.fmtYear(range.min)) + ' 至 ' + JR.esc(JR.fmtYear(range.max)) : '待统计') +
      '；置信度：确证 ' + countConfidence('确证') + ' 条，版本存异 ' + countConfidence('版本存异') + ' 条，待核 ' + countConfidence('待核') + ' 条。所有数字由当前条目实时计算。</p>';
  }

  function codebook() {
    var groups = (S.traitGroups || []).filter(function (g) { return g.id !== '叙事'; });
    var narrativeGroup = (S.traitGroups || []).filter(function (g) { return g.id === '叙事'; })[0];
    var all = groups.slice();
    if (narrativeGroup) all.push(narrativeGroup);
    return '<div class="codebook">' + all.map(function (g) {
      var items = (S.traits || []).filter(function (t) { return t.group === g.id; });
      return '<details' + (g.id === '形态' ? ' open' : '') + '>' +
        '<summary><span>' + JR.esc(g.label) + '</span><span class="caption">' + items.length + ' 项</span></summary>' +
        '<dl>' + items.map(function (t) {
          return '<dt>' + JR.esc(t.label) + '</dt><dd>' + JR.esc(t.desc) + '</dd>';
        }).join('') + '</dl></details>';
    }).join('') + '</div>';
  }

  function bibliography() {
    var list = window.JR_BIB || [];
    if (!list.length) {
      return '<p class="caption">参考书目数据尚未装入。离线书目见 docs/参考书目.md。</p>';
    }
    var groups = {};
    var order = [];
    list.forEach(function (b) {
      var cat = b.category || '其他';
      if (!groups[cat]) { groups[cat] = []; order.push(cat); }
      groups[cat].push(b);
    });
    var catOrder = ['古籍整理本', '西方原典与校注', '译名与译本研究', '神话学与民间文学', '影视游戏与视觉文化', '数字人文与方法', '其他'];
    order.sort(function (a, b) {
      var ia = catOrder.indexOf(a), ib = catOrder.indexOf(b);
      if (ia < 0) ia = 99;
      if (ib < 0) ib = 99;
      return ia - ib;
    });
    return order.map(function (cat) {
      return '<div class="bib-group"><h3>' + JR.esc(cat) + '</h3>' + groups[cat].map(function (b) {
        var meta = [b.publisher, b.year].filter(Boolean).join('，');
        var title = b.url ? '<a class="link" href="' + JR.escAttr(b.url) + '" target="_blank" rel="noopener">' + JR.esc(b.title) + '</a>' : JR.esc(b.title);
        return '<div class="bib-item"><span>' + JR.esc(b.author || '') + '：' + title + (meta ? '，' + JR.esc(meta) : '') + '。</span>' +
          (b.note ? '<span class="bib-item__note">' + JR.esc(b.note) + '</span>' : '') + '</div>';
      }).join('') + '</div>';
    }).join('');
  }

  function render() {
    var docs = [
      { href: 'docs/研究说明.md', label: '研究说明（完整版）' },
      { href: 'docs/编码手册.md', label: '编码手册（特征判定标准）' },
      { href: 'docs/参考书目.md', label: '参考书目（完整版）' }
    ];
    return '' +
      '<section class="wrap section section--page">' +
      '<div class="page-head">' +
      '<p class="kicker">研究说明</p>' +
      '<h1 class="display display--sm">这份档案如何构成</h1>' +
      '<p class="lede">本项目把「鲛人」「美人鱼」「塞壬」等形象拆解为可检索、可比较的条目，用于考察名称、外形与叙事功能在跨文化传播中的趋同、留存与变化。以下说明收录标准、编码方法与使用的边界。</p>' +
      '<div class="about-meta-line">' +
      '<span>项目全称：从鲛人到美人鱼——关于神话形象的跨文化重构的可视化研究</span>' +
      '<span class="mono">DATA v' + JR.esc(S.version || '1.0') + '</span>' +
      '<span>数据更新：' + JR.esc((window.JR_DATA.meta && window.JR_DATA.meta.dataUpdated) || '2026-10') + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="about-grid">' +
      '<nav class="about-nav" aria-label="本页目录">' +
      '<a href="#about-project">项目与问题</a>' +
      '<a href="#about-scope">收录范围</a>' +
      '<a href="#about-method">编码方法</a>' +
      '<a href="#about-data">数据概要</a>' +
      '<a href="#about-codebook">编码手册摘要</a>' +
      '<a href="#about-bib">参考书目</a>' +
      '<a href="#about-limits">局限与伦理</a>' +
      '<a href="#about-cite">引用与文档</a>' +
      '</nav>' +
      '<article class="about-article">' +

      '<section class="about-section" id="about-project">' +
      '<h2>项目与问题</h2>' +
      '<p>本数据库服务于同名研究项目，研究对象是中国神话传说中的「鲛人」，以及它在翻译、影视、游戏等媒介中与美人鱼（mermaid）、塞壬（Siren）等形象的接触、叠合与再编码。研究取向属于民间文学、比较文学与神话学，关注形象的历史层次与媒介机制，而非判定哪一种形象「更正统」。</p>' +
      '<p>数据库围绕四个问题组织材料：</p>' +
      '<div class="about-questions">' + questions() + '</div>' +
      '<p class="caption">四个问题对应三类检索入口：名称与异名、外形特征、叙事功能。资料库与比较台用于横向检查，时间轴与名称谱系用于纵向观察。</p>' +
      '</section>' +

      '<section class="about-section" id="about-scope">' +
      '<h2>收录范围</h2>' +
      '<p>条目分为三类，覆盖古籍原典、跨语言译名与近现代作品。同一作品的不同版本、不同译名分别成条，以便比较；确实无法分离时，在条目内注明版本与异文。</p>' +
      kindTable() +
      '<p>收录标准如下：</p>' +
      '<ul>' +
      '<li>与中国「鲛人」谱系直接相关，或与美人鱼、塞壬等形象发生可考的接触与重构关系；</li>' +
      '<li>有明确的文献、图像、作品或译名出处，能够给出可核对的线索；</li>' +
      '<li>能进入「名称、外形、叙事功能」三项编码中的至少一项。</li>' +
      '</ul>' +
      '<p>需要说明的是，本站也收录少量「邻近谱系」条目，例如龙女、鱼精、两栖人、海牛目等。它们不与鲛人等同，但能提供水下异类婚恋、鱼形精怪、科学去魅等对照面。此类条目的意义说明中会明确标注其邻近关系。</p>' +
      '<p>不收录：仅有名称相似而无形象或叙事关联的条目；无法追溯来源的网络传闻；以及仍处于版权保护期、需要大量引用原文或图像才能说明问题的材料（此类只作简短提及）。</p>' +
      '</section>' +

      '<section class="about-section" id="about-method">' +
      '<h2>编码方法</h2>' +
      '<p>每条记录按统一流程编码，编码结果以特征标签的形式进入比较矩阵：</p>' +
      '<ol>' +
      '<li><strong>定位原文与来源</strong>：确定篇目、卷次、版本或作品版本，登记出处与核对链接；无法确证者标为「待核」。</li>' +
      '<li><strong>记录名称信息</strong>：主名、异名、原文词与译名，注明是音译、意译还是类属替换。</li>' +
      '<li><strong>编码外形</strong>：人形上半身、鱼尾、鸟身、双尾、覆鳞、可化人形等形态特征，只勾选文本或图像明确支持的项。</li>' +
      '<li><strong>编码能力与行为</strong>：泣珠、织绡、歌声、捕食、交易、食肉长生、以声换形、被捕展演等。</li>' +
      '<li><strong>编码叙事功能</strong>：诱惑与危险、报恩与馈赠、爱情与牺牲、异类婚恋、长生与禁忌、商品化与展演、生态批判等。</li>' +
      '<li><strong>标注置信度</strong>：分为「确证」「版本存异」「待核」三级，并在详情页显示。</li>' +
      '</ol>' +
      '<p>比较台的矩阵只呈现「有／无」两态，不把特征折算成分数。理由是不同的文本传统对同一特征的权重并不可比，合成一个总分反而会掩盖差异。研究者可以在矩阵上自行判断同现、缺席与断裂。</p>' +
      '<p>名称谱系页依据条目的名称字段生成译名对照与图谱。图中出现在同一连线上的名称，表示存在可考的翻译、转写或图像承继关系；没有连线并不表示没有关系，只表示当前条目尚未提供证据。</p>' +
      '</section>' +

      '<section class="about-section" id="about-data">' +
      '<h2>数据概要</h2>' +
      dataStats() +
      '<p class="caption">时间轴与世纪分布按条目年代估算，公元前的年份以负数记录，估算值在条目中注明「约」或「年代有争议」。年代本身是研究问题的一部分，不应被当作精确事实。</p>' +
      '</section>' +

      '<section class="about-section" id="about-codebook">' +
      '<h2>编码手册摘要</h2>' +
      '<p>以下为当前编码表。完整判定标准、边界案例与编码流程见离线文档<a class="link" href="docs/编码手册.md" download>《编码手册》</a>。</p>' +
      codebook() +
      '</section>' +

      '<section class="about-section" id="about-bib">' +
      '<h2>参考书目</h2>' +
      '<p>书目按类别排列，供进一步查证与阅读。书目不是引文库，条目详情页的出处才是每条材料的直接依据；引用前请回到原书核对。</p>' +
      bibliography() +
      '</section>' +

      '<section class="about-section" id="about-limits">' +
      '<h2>局限与伦理</h2>' +
      '<ul>' +
      '<li><strong>不是定本。</strong>本站是研究辅助工具，不代表任何古籍的校勘结论。引文以通行整理本或可核数字文本为准，版本差异需回到原书判断。</li>' +
      '<li><strong>断代与归属存在争议。</strong>许多古籍的成书年代、作者与篇目归属有争议，条目尽量标注，但不做最终裁定。</li>' +
      '<li><strong>编码有主观性。</strong>特征编码依据文本与图像的明确表述，仍包含判断。比较台展示的是编码结果，不是形象本身。</li>' +
      '<li><strong>译名抽样有限。</strong>译名条目只覆盖当前收集到的译本与版本，不能据此断言某一译法在全部汉语世界中的分布。</li>' +
      '<li><strong>版权与引用。</strong>当代作品只作简短引用与信息性描述，不提供全文、剧本或剧照。引用本站条目时请同时核对原始出处。</li>' +
      '<li><strong>图像说明。</strong>站内线描为依据文献描述重绘的示意图，不是文物或作品原图，不能作为图像证据使用。</li>' +
      '</ul>' +
      '</section>' +

      '<section class="about-section" id="about-cite">' +
      '<h2>引用与文档</h2>' +
      '<p>引用本站数据时，建议注明项目名称、数据版本、访问日期，以及具体条目的编号。</p>' +
      '<pre class="about-cite">项目组：《从鲛人到美人鱼——关于神话形象的跨文化重构的可视化研究》数据库，版本 ' + JR.esc(S.version || '1.0') + '，2026 年 10 月。条目编号：［填写 id］。访问日期：［填写日期］。</pre>' +
      '<p>完整的方法说明、编码标准与参考书目以离线文档为准，可点击下载：</p>' +
      '<div class="about-docs">' + docs.map(function (d) {
        return '<a class="btn btn--ghost btn--sm" href="' + d.href + '" download>' + JR.esc(d.label) + '</a>';
      }).join('') + '</div>' +
      '<p class="caption">数据维护：新增条目时请遵循 docs/CONVENTIONS.md 与 data/schema.js 的字段约定；修改后刷新页面即可生效，无需构建。</p>' +
      '</section>' +

      '</article></div></section>';
  }

  function mount(root) {
    var links = Array.prototype.slice.call(root.querySelectorAll('.about-nav a'));
    var sections = links.map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
    this._io = io;
  }

  JR.page('about', {
    title: '研究说明',
    render: render,
    mount: mount,
    unmount: function () {
      if (this._io) { this._io.disconnect(); this._io = null; }
    }
  });
})();
