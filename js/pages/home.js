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
    return '<div class="home-stat">' +
      '<dt>' + JR.esc(label) + '</dt>' +
      '<dd class="home-stat__value">' + JR.esc(num) + '</dd>' +
      '<dd class="caption">' + JR.esc(sub) + '</dd>' +
      '</div>';
  }

  /* ------------------------------------------------------------ 世纪分布图 */
  function histogram() {
    var years = JR.entries.map(function (e) { return e.year; }).filter(function (y) { return typeof y === 'number'; });
    if (years.length < 2) return '';
    var centuries = years.map(function (y) { return Math.floor((y > 0 ? y - 1 : y) / 100); });
    var min = Math.min.apply(null, centuries);
    var max = Math.max.apply(null, centuries);
    var bins = Array.from({ length: max - min + 1 }, function (_, i) { return { century: min + i, count: 0 }; });
    centuries.forEach(function (c) { bins[c - min].count++; });
    var maxCount = Math.max.apply(null, bins.map(function (b) { return b.count; }));
    var W = 720, H = 160;
    var bw = W / bins.length;
    var bars = bins.map(function (b, i) {
      if (!b.count) return '';
      var h = b.count / maxCount * H;
      return '<rect x="' + (i * bw + bw * 0.15).toFixed(2) + '" y="' + (H - h).toFixed(2) +
        '" width="' + (bw * 0.7).toFixed(2) + '" height="' + h.toFixed(2) + '">' +
        '<title>' + binLabel(b.century) + '：' + b.count + ' 条</title></rect>';
    }).join('');
    var ticks = JR.unique([min, Math.round(min + (max - min) / 3), Math.round(max - (max - min) / 3), max]);
    return '<div class="hist"><div class="hist__scale" aria-hidden="true"><span>' + maxCount + '</span><span>0</span></div>' +
      '<svg class="hist__plot" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="条目按世纪分布：共 ' + years.length + ' 条，自' +
      binLabel(min) + '至' + binLabel(max) + '，单个世纪最多 ' + maxCount + ' 条。">' + bars + '</svg>' +
      '<div class="hist__axis" aria-hidden="true">' + ticks.map(function (c) {
        var position = (c - min + 0.5) / bins.length * 100;
        return '<span style="--tick-position:' + position.toFixed(2) + '%">' + binLabel(c) + '</span>';
      }).join('') + '</div></div>';
  }

  function binLabel(century) {
    return century < 0 ? '前 ' + Math.abs(century) + ' 世纪' : (century + 1) + ' 世纪';
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

  function entryRow(e) {
    var term = e.term || {};
    var names = JR.unique([term.primary].concat(term.variants || [])).slice(0, 3);
    var traits = (e.traits || []).slice(0, 3);
    return '<li class="home-entry">' +
      '<a class="home-entry__link" href="#/entry/' + JR.param(e.id) + '">' +
      '<span class="home-entry__era">' + JR.esc(e.dateDisplay) + '</span>' +
      '<span class="home-entry__main">' +
      '<span class="home-entry__title">' + JR.esc(e.title) + '</span>' +
      '<span class="home-entry__work">' + JR.esc(e.work || '') + (e.creator ? ' · ' + JR.esc(e.creator) : '') + '</span>' +
      '</span>' +
      '<span class="home-entry__names">' + JR.esc(names.join(' / ')) + '</span>' +
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
      figure: 'mermaid', term: '美人鱼', range: '欧洲 · 近代至全球', culture: '跨文化',
      body: '欧洲民间与文学中的半人半鱼形象，经安徒生《海的女儿》与电影工业成为全球符号。近现代汉译以「美人鱼」对译 mermaid，又与本土的「鲛人」「人鱼」叠合。',
      terms: ['mermaid', '美人鱼', '人鱼', '人魚'],
      link: '#/db?culture=跨文化'
    }
  ];

  function lineageCol(item) {
    return '<article class="lineage">' +
      '<div class="lineage__figure">' + JR.figure(item.figure) + '</div>' +
      '<div class="lineage__head">' +
      '<h3 class="lineage__term">' + JR.esc(item.term) + '</h3>' +
      '<span class="caption">' + JR.esc(item.range) + '</span>' +
      '</div>' +
      '<p class="lineage__body">' + JR.esc(item.body) + '</p>' +
      '<p class="lineage__terms">' + JR.esc(item.terms.join(' / ')) + '</p>' +
      '<a class="text-link" href="' + item.link + '">查看相关条目' + JR.icon('arrow') + '</a>' +
      '</article>';
  }

  function render() {
    var n = JR.entries.length;
    var cult = culturesPresent();
    var counts = S.traits ? S.traits.length : 0;
    var featuredList = featured();
    var obs = observations();
    var assetRoot = JR.escAttr(window.JR_FIGURE_ASSET_ROOT || 'assets/');
    var conf = ['确证', '版本存异', '待核'].map(function (id) {
      return '<span class="home-conf__item"><span class="badge ' + (id === '确证' ? 'badge--ok' : id === '版本存异' ? 'badge--warn' : 'badge--unknown') + '">' + JR.esc(id) + '</span><span class="mono">' + countConfidence(id) + '</span></span>';
    }).join('');

    return '' +
      /* ------------------------------------------------ 开篇 */
      '<section class="hero">' +
      '<div class="wrap hero__grid">' +
      '<div class="hero__copy">' +
      '<p class="hero__overline">跨文化神话研究档案</p>' +
      '<h1 class="display hero__title">从鲛人<span class="hero__title-line">到美人鱼</span></h1>' +
      '<p class="hero__sub">从古籍、译名与当代作品中，<br>追索鲛人、塞壬与美人鱼的演变。</p>' +
      '<form class="hero__cta" role="search" aria-label="检索资料库">' +
      '<div class="search hero__search">' + JR.icon('search') +
      '<label class="sr-only" for="home-q">搜索题名、异名或引文</label>' +
      '<input class="input" id="home-q" name="q" type="search" placeholder="题名、异名、引文" maxlength="80">' +
      '</div>' +
      '<button class="btn btn--solid" type="submit">检索</button>' +
      '</form>' +
      '<div class="hero__links">' +
      '<a class="text-link" href="#/db">浏览资料库' + JR.icon('arrow') + '</a>' +
      '<a class="text-link" href="#/timeline">沿时间轴阅读' + JR.icon('arrow') + '</a>' +
      '</div>' +
      '</div>' +
      '<figure class="hero__visual">' +
      '<img class="hero__art" src="' + assetRoot + 'jiaoren.webp" srcset="' + assetRoot + 'jiaoren-720.webp 720w, ' + assetRoot + 'jiaoren.webp 1448w" sizes="(max-width: 680px) 92vw, 55vw" width="1448" height="1086" fetchpriority="high" alt="海浪中的鲛人手执薄绡，珠滴顺着绡纱滑落。">' +
      '<figcaption class="hero__note"><strong>鲛人 · 织绡与泣珠</strong><span>AI 创作示意</span></figcaption>' +
      '</figure>' +
      '</div>' +
      '</section>' +

      '<dl class="wrap home-stats" aria-label="收录概况">' +
      statBlock(String(n), '条目', '古籍、译名与当代作品') +
      statBlock(spanText(), '时间跨度', '按条目年代估算') +
      statBlock(String(Object.keys(cult).length), '谱系', '中国、西方、东亚、跨文化') +
      statBlock(String(counts), '编码维度', '形态、能力与叙事功能') +
      '</dl>' +

      /* ------------------------------------------------ 三条谱系 */
      '<section class="section home-lineages">' +
      '<div class="wrap">' +
      '<div class="section-head">' +
      '<h2 class="section-title">鲛人、塞壬与美人鱼</h2>' +
      '<p class="section-desc">三条源流各有自己的文本与图像传统，又在翻译、宗教、出版与影视中交叠。可以从名称、外形与叙事功能入手，逐条比对。</p>' +
      '<p class="caption">下列图像均为 AI 创作示意。塞壬陶片为虚构图像。</p>' +
      '</div>' +
      '<div class="lineage-grid">' + LINEAGES.map(lineageCol).join('') + '</div>' +
      '</div>' +
      '</section>' +

      /* ------------------------------------------------ 数据的形状 */
      '<section class="section home-data">' +
      '<div class="wrap home-data__grid">' +
      '<div class="home-data__left">' +
      '<h2 class="section-title">年代与置信度</h2>' +
      '<p class="section-desc">年代分布反映本站的收录范围。引用前，请核对条目的出处与版本。</p>' +
      '<div class="home-conf" aria-label="置信度分布">' + conf + '</div>' +
      '</div>' +
      '<div class="home-data__right">' +
      '<div class="home-hist">' +
      '<div class="home-hist__head"><h3>条目按世纪分布</h3><a class="text-link" href="#/timeline">打开时间轴' + JR.icon('arrow') + '</a></div>' +
      (histogram() || '<p class="caption">年代记录暂不足以绘制分布。</p>') +
      '</div>' +
      '</div>' +
      '</div>' +
      '</section>' +

      /* ------------------------------------------------ 数据观察 */
      (obs.length ? '<section class="section home-obs">' +
        '<div class="wrap">' +
        '<div class="section-head">' +
        '<h2 class="section-title">可复核的研究线索</h2>' +
        '<p class="section-desc">以下判断由当前已有编码自动汇总，属于可复核的检索线索，不是研究结论。点击链接可以在资料库或比较台复现这组筛选。</p>' +
        '</div>' +
        '<ol class="obs-list">' +
        obs.map(function (o) {
          return '<li class="obs"><h3 class="obs__title">' + JR.esc(o.title) + '</h3>' +
            '<p class="obs__text">' + JR.esc(o.text) + '</p>' +
            '<a class="text-link" href="' + o.link + '">' + JR.esc(o.linkText) + JR.icon('arrow') + '</a></li>';
        }).join('') +
        '</ol></div></section>' : '') +

      /* ------------------------------------------------ 精选条目 */
      '<section class="section home-featured">' +
      '<div class="wrap">' +
      '<div class="section-head section-head--row">' +
      '<h2 class="section-title">条目选读</h2>' +
      '<a class="text-link" href="#/db">浏览全部 ' + n + ' 条' + JR.icon('arrow') + '</a>' +
      '</div>' +
      '<ol class="home-entries">' + featuredList.map(entryRow).join('') + '</ol>' +
      '</div>' +
      '</section>' +

      /* ------------------------------------------------ 使用路径 */
      '<section class="section home-paths">' +
      '<div class="wrap">' +
      '<div class="section-head">' +
      '<h2 class="section-title">使用指南</h2>' +
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
      '<h2 class="section-title">研究与引用</h2>' +
      '<div class="home-closing__side">' +
      '<p class="home-closing__title">从鲛人到美人鱼——关于神话形象的跨文化重构的可视化研究</p>' +
      '<p class="home-closing__text">收录古籍记载、译名与当代作品中的具体案例，供民间文学、比较文学与神话学研究使用。引用前请核对原典与版本；条目的置信度标注见详情页。</p>' +
      '<a class="btn btn--ghost btn--sm" href="#/about">阅读研究说明</a>' +
      '</div>' +
      '</div>' +
      '</section>';
  }

  function mount(root) {
    var form = root.querySelector('.hero__cta');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      JR.go('db', { q: form.elements.q.value.trim() });
    });
  }

  JR.page('home', {
    title: '首页',
    render: render,
    mount: mount
  });
})();
