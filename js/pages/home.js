/* ==========================================================================
   首页
   版块：开篇 / 三条谱系 / 数据的形状 / 数据观察 / 精选条目 / 使用路径 / 结语
   ========================================================================== */
(function () {
  'use strict';

  var JR = window.JR;
  var S = JR.schema;

  function pct(part, total) {
    if (!total) return 0;
    return Math.round((part / total) * 1000) / 10;
  }

  function countConfidence(id) {
    return JR.entries.filter(function (e) { return e.confidence === id; }).length;
  }

  function culturesPresent() {
    var map = {};
    JR.entries.forEach(function (e) { map[e.culture] = (map[e.culture] || 0) + 1; });
    return map;
  }

  function spanText() {
    var years = JR.entries.map(function (e) { return e.year; }).filter(function (y) { return typeof y === 'number'; });
    if (years.length < 2) return '待统计';
    var min = Math.min.apply(null, years);
    var max = Math.max.apply(null, years);
    var span = max - min;
    return '约 ' + span.toLocaleString('zh-CN') + ' 年';
  }

  function statBlock(num, label, sub) {
    return '<div class="stat">' +
      '<span class="stat__num">' + JR.esc(num) + '</span>' +
      '<span class="stat__label">' + JR.esc(label) + '</span>' +
      (sub ? '<span class="caption">' + JR.esc(sub) + '</span>' : '') +
      '</div>';
  }

  /* ------------------------------------------------------------ 世纪分布图 */
  function histogram() {
    var years = JR.entries.map(function (e) { return e.year; }).filter(function (y) { return typeof y === 'number'; });
    if (years.length < 2) return '';
    var min = Math.floor(Math.min.apply(null, years) / 100) * 100;
    var max = Math.ceil((Math.max.apply(null, years) + 1) / 100) * 100;
    var binSize = 100;
    var bins = [];
    for (var s = min; s < max; s += binSize) bins.push({ start: s, count: 0 });
    years.forEach(function (y) {
      var idx = Math.floor((y - min) / binSize);
      if (idx < 0) idx = 0;
      if (idx >= bins.length) idx = bins.length - 1;
      bins[idx].count++;
    });
    var maxCount = Math.max.apply(null, bins.map(function (b) { return b.count; }));
    var W = 720, H = 150, padB = 22, padT = 8;
    var bw = W / bins.length;
    var bars = bins.map(function (b, i) {
      var h = maxCount ? (b.count / maxCount) * (H - padB - padT) : 0;
      var x = i * bw + bw * 0.16;
      var w = bw * 0.68;
      var y = H - padB - h;
      return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(h, 0.8).toFixed(1) +
        '" fill="var(--teal)" opacity="' + (b.count ? 0.82 : 0.16) + '"><title>' + JR.esc(binLabel(b.start)) + '：' + b.count + ' 条</title></rect>';
    }).join('');
    var labels = bins.map(function (b, i) {
      if (i % 5 !== 0 && i !== bins.length - 1) return '';
      var x = i * bw + bw / 2;
      return '<text x="' + x.toFixed(1) + '" y="' + (H - 5) + '" text-anchor="middle" class="hist-label">' + JR.esc(binLabel(b.start)) + '</text>';
    }).join('');
    return '<svg class="hist" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="条目按世纪分布：共 ' + years.length + ' 条，自' + JR.esc(binLabel(min)) + '至' + JR.esc(binLabel(max - 1)) + '。">' +
      '<line x1="0" y1="' + (H - padB) + '" x2="' + W + '" y2="' + (H - padB) + '" stroke="var(--line-2)" stroke-width="1"/>' +
      bars + labels + '</svg>';
  }

  function binLabel(start) {
    if (start < 0) return '前' + Math.abs(start) + '世纪';
    if (start === 0) return '公元 1 世纪';
    return start + ' 世纪';
  }

  /* ------------------------------------------------------------ 数据观察（由条目实时计算） */
  function observations() {
    var out = [];
    var tears = JR.entriesWithTrait('b_tears_pearl');
    if (tears.length >= 2) {
      out.push({
        title: '「泣珠」是一条长线',
        text: '共 ' + tears.length + ' 条记录带有「泣珠」编码，最早为《' + (tears[0].work || tears[0].title) + '》（' + tears[0].dateDisplay + '），最晚见于《' + (tears[tears.length - 1].work || tears[tears.length - 1].title) + '》（' + tears[tears.length - 1].dateDisplay + '）。点击特征标签可在资料库中复现这一序列。',
        link: '#/db?traits=b_tears_pearl',
        linkText: '检索泣珠条目'
      });
    }
    var fishTail = JR.entriesWithTrait('m_fish_tail');
    var humanUpper = JR.entriesWithTrait('m_human_upper');
    var both = JR.entries.filter(function (e) { return e.traits.indexOf('m_fish_tail') >= 0 && e.traits.indexOf('m_human_upper') >= 0; });
    if (fishTail.length && humanUpper.length) {
      out.push({
        title: '鱼尾并不总与人形上半身同现',
        text: '带「鱼尾」编码的条目有 ' + fishTail.length + ' 条，带「人形上半身」的有 ' + humanUpper.length + ' 条，两者同时出现的为 ' + both.length + ' 条。差值提示：鱼形身体可以出现在不同的上半身构造上，不能把「半人半鱼」当作一个不证自明的整体。',
        link: '#/db?traits=m_fish_tail,m_human_upper',
        linkText: '并置这两项特征'
      });
    }
    var bird = JR.entriesWithTrait('m_bird_body');
    if (bird.length) {
      out.push({
        title: '塞壬的形态发生过断裂',
        text: '记录中有 ' + bird.length + ' 条保留「人首鸟身」编码。把它们与鱼尾塞壬、美人鱼并排，可以看到同一个名称下至少存在两条形态传统，这正是「趋同」叙事最容易被忽略的地方。',
        link: '#/compare?traits=m_bird_body',
        linkText: '进入比较台'
      });
    }
    var eco = JR.entries.filter(function (e) { return e.traits.indexOf('b_ecology') >= 0 || e.narratives.indexOf('f_ecology') >= 0; });
    if (eco.length) {
      var ecoYears = eco.map(function (e) { return e.year; }).filter(function (y) { return typeof y === 'number'; });
      var ecoMin = ecoYears.length ? Math.min.apply(null, ecoYears) : null;
      out.push({
        title: '生态叙事是晚近的叠加层',
        text: '「生态受难」与「生态批判」编码共 ' + eco.length + ' 条' + (ecoMin !== null ? '，最早不早于 ' + ecoMin + ' 年' : '') + '。泣珠与织绡来自前现代志怪，生态受难则属于当代媒介的新编码，两者在时间轴上并不重合。',
        link: '#/db?traits=b_ecology,f_ecology',
        linkText: '查看生态条目'
      });
    }
    return out.slice(0, 3);
  }

  /* ------------------------------------------------------------ 精选条目 */
  function featured() {
    var picks = [];
    var seen = {};
    function push(entry) {
      if (!entry || seen[entry.id]) return;
      seen[entry.id] = true;
      picks.push(entry);
    }
    JR.entries.forEach(function (e) {
      if (!picks.some(function (x) { return x.culture === e.culture; }) && e.culture !== '跨文化') push(e);
    });
    var translation = JR.entries.filter(function (e) { return e.kind === 'translation'; })[0];
    push(translation);
    var modern = JR.entries.filter(function (e) { return e.kind === 'modern'; });
    push(modern[0]);
    push(modern[Math.floor(modern.length / 2)]);
    push(modern[modern.length - 1]);
    var ancient = JR.entries.filter(function (e) { return e.kind === 'ancient'; });
    push(ancient[Math.floor(ancient.length / 2)]);
    push(JR.entries[JR.entries.length - 1]);
    while (picks.length < 6 && JR.entries.length > picks.length) {
      JR.entries.forEach(push);
      if (picks.length >= JR.entries.length) break;
    }
    return picks.slice(0, 6);
  }

  function entryRow(e, i) {
    var term = e.term || {};
    var names = JR.unique([term.primary].concat(term.variants || [])).slice(0, 3);
    var traits = (e.traits || []).slice(0, 3);
    return '<li class="home-entry">' +
      '<a class="home-entry__link" href="#/entry/' + JR.param(e.id) + '">' +
      '<span class="home-entry__idx mono">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="home-entry__era">' + JR.esc(e.dateDisplay) + '</span>' +
      '<span class="home-entry__main">' +
      '<span class="home-entry__title">' + JR.esc(e.title) + '</span>' +
      '<span class="home-entry__work">' + JR.esc(e.work || '') + (e.creator ? ' · ' + JR.esc(e.creator) : '') + '</span>' +
      '</span>' +
      '<span class="home-entry__names">' + names.map(function (n) { return '<span class="tag tag--ghost">' + JR.esc(n) + '</span>'; }).join('') + '</span>' +
      '<span class="home-entry__traits">' + traits.map(function (t) { return '<span class="tag">' + JR.esc(JR.traitLabel(t)) + '</span>'; }).join('') + '</span>' +
      '<span class="home-entry__arrow" aria-hidden="true">' + JR.icon('arrow') + '</span>' +
      '</a></li>';
  }

  var LINEAGES = [
    {
      figure: 'jiao-ren', term: '鲛人', range: '中国 · 汉晋以降', culture: '中国',
      body: '中国文献中的海中异人：人首鱼身、水居如鱼，善织绡，泣泪成珠。它与南海采珠、鲛绡与「鲛人泪」的诗文想象缠在一起。',
      terms: ['鲛人', '人鱼', '泉先', '鲛绡'],
      link: '#/db?culture=中国'
    },
    {
      figure: 'siren-bird', term: '塞壬', range: '地中海 · 古风至中世纪', culture: '西方',
      body: '荷马史诗中以歌声诱使航海者触礁的歌者。古风图像里的人首鸟身，到中世纪逐渐与鱼尾人鱼合流，名称与身体并不始终一致。',
      terms: ['Siren', '塞壬', '海妖', '人首鸟身'],
      link: '#/db?culture=西方'
    },
    {
      figure: 'siren-fish', term: '美人鱼', range: '欧洲 · 近代至全球', culture: '跨文化',
      body: '欧洲民间与文学中的半人半鱼形象，经安徒生《海的女儿》与电影工业成为全球符号。近现代汉译以「美人鱼」对译 mermaid，又与本土的「鲛人」「人鱼」叠合。',
      terms: ['mermaid', '美人鱼', '人鱼', '人魚'],
      link: '#/db?culture=跨文化'
    }
  ];

  function lineageCol(item, index) {
    return '<article class="lineage' + (index === 1 ? ' lineage--offset' : '') + '">' +
      '<div class="lineage__head">' +
      '<span class="lineage__term serif">' + JR.esc(item.term) + '</span>' +
      '<span class="caption">' + JR.esc(item.range) + '</span>' +
      '</div>' +
      '<div class="lineage__figure">' + JR.figure(item.figure) + '</div>' +
      '<p class="lineage__body">' + JR.esc(item.body) + '</p>' +
      '<div class="lineage__terms">' + item.terms.map(function (t) { return '<span class="tag tag--ghost">' + JR.esc(t) + '</span>'; }).join('') + '</div>' +
      '<a class="text-link" href="' + item.link + '">在资料库中查看' + JR.icon('arrow') + '</a>' +
      '</article>';
  }

  function render() {
    var n = JR.entries.length;
    var cult = culturesPresent();
    var counts = S.traits ? S.traits.length : 0;
    var featuredList = featured();
    var obs = observations();
    var conf = ['确证', '版本存异', '待核'].map(function (id) {
      return '<span class="home-conf__item"><span class="badge ' + (id === '确证' ? 'badge--ok' : id === '版本存异' ? 'badge--warn' : 'badge--unknown') + '">' + JR.esc(id) + '</span><span class="mono">' + countConfidence(id) + '</span></span>';
    }).join('');

    return '' +
      /* ------------------------------------------------ 开篇 */
      '<section class="hero">' +
      '<div class="wrap hero__grid">' +
      '<div class="hero__copy">' +
      '<p class="kicker">跨文化神话研究 · 数字档案</p>' +
      '<h1 class="display hero__title">从鲛人<span class="hero__title-line">到美人鱼</span></h1>' +
      '<p class="hero__sub">关于神话形象的跨文化重构的可视化研究。检索古籍、译名与当代作品，比较鲛人、美人鱼与塞壬的趋同与留存。</p>' +
      '<div class="btn-group hero__cta">' +
      '<a class="btn btn--solid" href="#/db">进入资料库' + JR.icon('arrow') + '</a>' +
      '<a class="btn btn--ghost" href="#/timeline">沿时间轴阅读</a>' +
      '</div>' +
      '</div>' +
      '<div class="hero__visual">' +
      '<div class="hero-plate">' +
      '<div class="hero-plate__meta"><span class="mono">图版 01</span><span>据文献描述重绘</span></div>' +
      '<div class="hero-plate__figure">' + JR.figure('jiao-ren') + '</div>' +
      '<div class="hero-plate__caption"><span class="seal">鲛</span><span>人首鱼身 · 织绡泣珠</span></div>' +
      '<span class="hero-plate__vertical">跨文化重构</span>' +
      '<div class="hero-plate__wave">' + JR.figure('wave') + '</div>' +
      '</div>' +
      '<p class="hero__note"><span class="mono">FIG. 01</span> 鲛人线描为研究示意图，非文物复制。图像只承担索引功能，不替代原典与实物证据。</p>' +
      '</div>' +
      '</div>' +
      '</section>' +

      /* ------------------------------------------------ 三条谱系 */
      '<section class="section home-lineages">' +
      '<div class="wrap">' +
      '<div class="section-head">' +
      '<p class="kicker">谱系</p>' +
      '<h2 class="section-title">三条源流，一个正在合流的名称</h2>' +
      '<p class="section-desc">鲛人、塞壬、美人鱼并非同一形象的三次命名。它们各有独立的文本与图像传统，在翻译、宗教、印刷与影视工业中不断交叠。资料库把「名称」「外形」「叙事功能」拆成可比较的编码，正是为了让这些交叠处可以被逐条检查。</p>' +
      '</div>' +
      '<div class="lineage-grid">' + LINEAGES.map(lineageCol).join('') + '</div>' +
      '</div>' +
      '</section>' +

      /* ------------------------------------------------ 数据的形状 */
      '<section class="section home-data">' +
      '<div class="wrap home-data__grid">' +
      '<div class="home-data__left">' +
      '<p class="kicker">数据</p>' +
      '<h2 class="section-title">数据的形状</h2>' +
      '<p class="section-desc">这些数字由本站条目实时计算，不是预先写定的宣传口径。条目增加，数字随之变化。</p>' +
      '<div class="stat-row home-stats">' +
      statBlock(String(n), '条目', '古籍、译名与当代作品') +
      statBlock(spanText(), '时间跨度', '按条目年代估算') +
      statBlock(String(Object.keys(cult).length), '谱系', '中国 / 西方 / 东亚 / 跨文化') +
      statBlock(String(counts), '编码维度', '形态、能力与叙事功能') +
      '</div>' +
      '<div class="home-conf"><span class="caption">置信度分布</span>' + conf + '</div>' +
      '</div>' +
      '<div class="home-data__right">' +
      '<div class="home-hist">' +
      '<div class="home-hist__head"><span class="caption">条目按世纪分布</span><a class="text-link" href="#/timeline">打开时间轴' + JR.icon('arrow') + '</a></div>' +
      histogram() +
      '</div>' +
      '</div>' +
      '</div>' +
      '</section>' +

      /* ------------------------------------------------ 数据观察 */
      (obs.length ? '<section class="section home-obs">' +
        '<div class="wrap">' +
        '<div class="section-head">' +
        '<p class="kicker">观察</p>' +
        '<h2 class="section-title">从条目里读到的几处变化</h2>' +
        '<p class="section-desc">以下判断由当前已有编码自动汇总，属于可复核的检索线索，不是研究结论。点击链接可以在资料库或比较台复现这组筛选。</p>' +
        '</div>' +
        '<ol class="obs-list">' +
        obs.map(function (o, i) {
          return '<li class="obs"><span class="obs__idx mono">0' + (i + 1) + '</span>' +
            '<div class="obs__body"><h3 class="obs__title">' + JR.esc(o.title) + '</h3>' +
            '<p class="obs__text">' + JR.esc(o.text) + '</p>' +
            '<a class="text-link" href="' + o.link + '">' + JR.esc(o.linkText) + JR.icon('arrow') + '</a></div></li>';
        }).join('') +
        '</ol></div></section>' : '') +

      /* ------------------------------------------------ 精选条目 */
      '<section class="section home-featured">' +
      '<div class="wrap">' +
      '<div class="section-head section-head--row">' +
      '<div><p class="kicker">选读</p><h2 class="section-title">从一条记载开始</h2></div>' +
      '<a class="text-link" href="#/db">浏览全部 ' + n + ' 条' + JR.icon('arrow') + '</a>' +
      '</div>' +
      '<ol class="home-entries">' + featuredList.map(entryRow).join('') + '</ol>' +
      '</div>' +
      '</section>' +

      /* ------------------------------------------------ 使用路径 */
      '<section class="section home-paths">' +
      '<div class="wrap">' +
      '<div class="section-head">' +
      '<p class="kicker">使用</p>' +
      '<h2 class="section-title">查、比、看变化</h2>' +
      '<p class="section-desc">数据库不是结论的展示柜，而是一组可以反复操作的比较装置。</p>' +
      '</div>' +
      '<div class="path-grid">' +
      '<a class="path" href="#/db"><span class="path__label serif">检索</span><span class="path__text">按年代、作品、谱系与形象特征筛选，查看每条记录的原文、出处与编码。</span><span class="path__arrow">' + JR.icon('arrow') + '</span></a>' +
      '<a class="path" href="#/compare"><span class="path__label serif">并置</span><span class="path__text">把两到四个版本放进同一张矩阵，逐项检查哪些特征同现、哪些只属于单条传统。</span><span class="path__arrow">' + JR.icon('arrow') + '</span></a>' +
      '<a class="path" href="#/timeline"><span class="path__label serif">编年</span><span class="path__text">沿时间轴与名称谱系观察形象迁移，识别断裂、回流与晚近叠加的叙事层。</span><span class="path__arrow">' + JR.icon('arrow') + '</span></a>' +
      '</div>' +
      '</div>' +
      '</section>' +

      /* ------------------------------------------------ 结语 */
      '<section class="section section--tight home-closing">' +
      '<div class="wrap home-closing__inner">' +
      '<p class="home-closing__quote serif">档案不提供结论，<br>它让比较变得可以操作。</p>' +
      '<div class="home-closing__side">' +
      '<p class="caption">项目全称</p>' +
      '<p class="home-closing__title">从鲛人到美人鱼——关于神话形象的跨文化重构的可视化研究</p>' +
      '<p class="home-closing__text">收录古籍记载、译名与当代作品中的具体案例，供民间文学、比较文学与神话学研究使用。引用前请核对原典与版本；条目的置信度标注见详情页。</p>' +
      '<a class="btn btn--ghost btn--sm" href="#/about">阅读研究说明</a>' +
      '</div>' +
      '</div>' +
      '</section>';
  }

  function mount(root) {
    if (JR.isReducedMotion()) return;
    var items = root.querySelectorAll('.lineage, .obs, .home-entry, .path, .home-hist');
    if (!items.length) return;
    items.forEach(function (el) { el.classList.add('reveal'); });
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    this._io = io;
  }

  JR.page('home', {
    title: '首页',
    render: render,
    mount: mount,
    unmount: function () {
      if (this._io) { this._io.disconnect(); this._io = null; }
    }
  });
})();
