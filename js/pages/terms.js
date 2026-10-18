/* ==========================================================================
   鲛人研究数据库 · 名称谱系页面（#/terms）
   依赖：js/core.js（window.JR）、data/schema.js
   结构：固定的 980x600 设计画布上，用绝对定位的节点按钮与内联 SVG 连线
         排出名称源流；节点统计全部来自条目 term 字段。
         render 只返回 HTML 字符串，交互在 mount 中绑定、unmount 中清理。
   ========================================================================== */
(function (global) {
  'use strict';

  var JR = global.JR;
  if (!JR) return;

  var CANVAS_W = 980;
  var CANVAS_H = 600;

  /* ------------------------------------------------------------ 名称节点 */
  var NODES = [
    {
      id: 'cn-jiao', name: '鲛人', orig: '鲛人 · 泉先 · 泉客 · 渊客', stream: 'cn', x: 100, y: 92,
      keys: ['鲛人', '泉先', '泉客', '渊客'],
      desc: '汉魏六朝志怪与地理志中的水中异类，常与泣珠、织绡相连；与「人鱼」的指称时有交叠。'
    },
    {
      id: 'cn-renyu', name: '人鱼', orig: '人鱼（古义与近现代义）', stream: 'cn', x: 330, y: 92,
      keys: ['人鱼'],
      desc: '汉语中兼指人首鱼身的异类与近代译入的 mermaid；古义与近现代义并不完全重合。'
    },
    {
      id: 'cn-meiren', name: '美人鱼', orig: '美人鱼 / 美人魚', stream: 'cn', x: 560, y: 92,
      keys: ['美人鱼', '美人魚'],
      desc: '近现代汉语中的通名，常见于童话、影视与商业图像；与「人鱼」在语用上互有分工。'
    },
    {
      id: 'west-siren', name: 'Σειρήν / Siren', orig: 'Σειρήν · Sirens · Sirenes', stream: 'west', x: 100, y: 255,
      keys: ['Σειρήν', 'Σειρην', 'Σειρῆν', 'Σειρῆνες', 'Seirenes', 'Seirēnes', 'Sirenes', 'Sirenas', 'Sirenae', 'Siren', 'Sirens', 'Sirena'],
      desc: '古希腊文献与图像中的歌唱者；古风时期图像多作人首鸟身，与后世的鱼尾形象不同。'
    },
    {
      id: 'west-sairen', name: '塞壬', orig: 'Siren 音译', stream: 'west', x: 330, y: 215,
      keys: ['塞壬'],
      desc: '汉语对 Siren 的音译，多见于译诗、译论与文学研究；所指随语境在鸟身与鱼尾之间摆动。'
    },
    {
      id: 'west-haiyao', name: '海妖', orig: 'Sirens 意译', stream: 'west', x: 330, y: 300,
      keys: ['海妖'],
      desc: '汉语意译，语义较宽，可指塞壬、美人鱼或泛指海中怪物；精确指涉依赖上下文。'
    },
    {
      id: 'west-merge', name: '中世纪图像合流', orig: '鱼尾塞壬 · 镜与梳', stream: 'west', x: 560, y: 255,
      keys: ['塞壬', '海妖', 'Siren', 'Sirens'],
      desc: '中世纪欧洲图像中，塞壬渐与鱼尾人形、镜与梳等母题结合，成为后来美人鱼图像的重要来源之一。'
    },
    {
      id: 'east-ningyo', name: '人魚', orig: 'にんぎょ · 人魚', stream: 'east', x: 100, y: 415,
      keys: ['人魚', 'にんぎょ'],
      desc: '日本文献中的鱼形异类，形象多为人头鱼身；与汉语「鲛人」传统有接触，但不能直接等同。'
    },
    {
      id: 'east-hime', name: '人魚姫', orig: '人魚姫（《海的女儿》日译名）', stream: 'east', x: 330, y: 385,
      keys: ['人魚姫'],
      desc: '安徒生童话《海的女儿》的日译标题，通常作「人魚姫」；标题用字与汉语「美人鱼」不同。'
    },
    {
      id: 'east-mermaid', name: 'マーメイド', orig: 'mermaid 音译', stream: 'east', x: 330, y: 470,
      keys: ['マーメイド'],
      desc: '英语 mermaid 的日语音译，常见于流行文化商品与影视译名，多与「人魚」并用。'
    },
    {
      id: 'east-ineo', name: '인어', orig: '人魚 的朝鲜语汉字词', stream: 'east', x: 100, y: 540,
      keys: ['인어'],
      desc: '朝鲜语中的「人魚」，与日语「人魚」同用汉字词根；现代韩语多写作谚文。'
    },
    {
      id: 'sci-sirenia', name: '儒艮 / 海牛目', orig: 'Sirenia · Dugong · Manatee', stream: 'sci', x: 560, y: 540,
      keys: ['儒艮', '海牛目', '海牛', 'Sirenia', 'Dugong', 'Manatee'],
      desc: '海牛目的学名常被认为取自塞壬；近代「美人鱼」目击常被解释为儒艮或海牛，属于命名与观察史问题，不是直接的形象演化。'
    },
    {
      id: 'conv', name: '美人鱼 · mermaid', orig: '合流后的近现代通名', stream: 'conv', x: 852, y: 276,
      keys: ['美人鱼', '美人魚', 'mermaid'],
      desc: '译名互借与大众化之后的合流点；各语言内部仍有分化，具体等同关系因文本而异。'
    }
  ];

  /* ------------------------------------------------------------ 连线 */
  var EDGES = [
    { from: 'cn-jiao', to: 'cn-renyu', stream: 'cn', kind: 'solid' },
    { from: 'cn-renyu', to: 'cn-meiren', stream: 'cn', kind: 'solid' },
    { from: 'cn-meiren', to: 'conv', stream: 'cn', kind: 'solid' },
    { from: 'west-siren', to: 'west-sairen', stream: 'west', kind: 'dashed' },
    { from: 'west-siren', to: 'west-haiyao', stream: 'west', kind: 'dashed' },
    { from: 'west-sairen', to: 'west-merge', stream: 'west', kind: 'solid' },
    { from: 'west-haiyao', to: 'west-merge', stream: 'west', kind: 'solid' },
    { from: 'west-merge', to: 'conv', stream: 'west', kind: 'solid' },
    { from: 'east-ningyo', to: 'east-hime', stream: 'east', kind: 'solid' },
    { from: 'east-ningyo', to: 'east-mermaid', stream: 'east', kind: 'dashed' },
    { from: 'east-ningyo', to: 'east-ineo', stream: 'east', kind: 'dashed' },
    { from: 'east-hime', to: 'conv', stream: 'east', kind: 'dashed' },
    { from: 'east-mermaid', to: 'conv', stream: 'east', kind: 'dashed' },
    { from: 'west-siren', to: 'sci-sirenia', stream: 'sci', kind: 'dashed', route: 'elbow' }
  ];

  var EDGE_LABELS = [
    { x: 208, y: 224, text: '音译', stream: 'west' },
    { x: 208, y: 300, text: '意译', stream: 'west' },
    { x: 208, y: 458, text: '音译', stream: 'east' },
    { x: 170, y: 354, text: '学名取自塞壬', stream: 'sci' }
  ];

  var STREAM_LABELS = [
    { text: '中国', cls: 'cn', x: 16, y: 36 },
    { text: '地中海', cls: 'west', x: 16, y: 194 },
    { text: '日本 / 朝鲜', cls: 'east', x: 16, y: 354 },
    { text: '科学旁支', cls: 'sci', x: 476, y: 486 }
  ];

  var NOTE_LIST = [
    {
      title: '「鲛」与鲨鱼',
      text: '「鲛」在古汉语里也可指鲨鱼一类海鱼，其皮可制饰物；而「鲛人」是传说中居水、能织绡泣珠的人形异类。二者只是共用一个字，所指并不相同，不能因字面相同就把鲛人当成鲨鱼。据通行辞书说，这两义多分列，但具体早期用例、释义边界与地域差异仍需逐条核对，此处不从字源上作进一步推断，也不把现代词典的分项直接当成古义证据。',
      flag: '待核'
    },
    {
      title: '塞壬的图像前史',
      text: '古希腊古风时期的塞壬图像多作人首鸟身，以歌声引诱航海者；鱼尾人形、常持镜与梳的形象要到中世纪欧洲才流行，并逐渐与美人鱼传统靠拢。因此不宜把荷马史诗中的塞壬直接等同美人鱼：两者在图像志上有承继与合流，但时代、形态与叙事功能并不同步，混用会掩盖演变的层次。讨论具体作品时，宜先说明依据的是哪一时期的文本或图像传统。',
      flag: ''
    },
    {
      title: '海牛目与「美人鱼」',
      text: '据常见的科学史叙述，海牛目（Sirenia）的学名被认为取自塞壬，与传统中半人半鱼的海妖想象有关。近代航海记录里的「美人鱼」目击，也常被解释为儒艮或海牛：儒艮抱幼浮出水面时，远看或许近似人形。这类解释流传很广，但具体个案仍应回到航海日志、博物学图版与采集记录逐条核对，不宜当作定论；海牛目的命名与「美人鱼」形象的关系，也应与文学传统区别看待。',
      flag: '待核'
    },
    {
      title: '「人鱼」与「美人鱼」',
      text: '近现代汉语中，「人鱼」可以泛指人首鱼身或鱼尾人形的异类，也常作为 mermaid 的对应词；「美人鱼」因安徒生童话《海的女儿》的汉译与大众文化传播，更多指年轻女性、爱情叙事与商业图像中的形象。二者语义有重叠，语用重心不同，在标题、译名与日常叙述里可以互换，但并不总是等价。现有语料尚不足以支撑严格的比例判断，此处只作倾向性说明，分布待核。',
      flag: '待核'
    }
  ];

  var NODE_MAP = {};
  NODES.forEach(function (node) { NODE_MAP[node.id] = node; });

  var DOT_CLASS = { '中国': 'dot--cn', '西方': 'dot--west', '东亚': 'dot--east', '跨文化': 'dot--cross' };

  var ctx = null;

  /* ------------------------------------------------------------ 小工具 */
  function str(v) {
    if (v === null || v === undefined) return '';
    return typeof v === 'string' ? v : String(v);
  }
  function arr(v) { return Array.isArray(v) ? v : []; }
  function num(v) { return (typeof v === 'number' && isFinite(v)) ? v : null; }
  function esc(v) { return JR.esc(str(v)); }
  function eachNode(list, fn) {
    for (var i = 0; i < list.length; i++) fn(list[i], i);
  }
  function closest(el, selector) {
    if (!el || typeof el.closest !== 'function') return null;
    return el.closest(selector);
  }
  function nodeById(id) { return NODE_MAP[str(id)] || null; }
  function isNarrow() {
    try {
      return !!(global.matchMedia && global.matchMedia('(max-width: 760px)').matches);
    } catch (err) { return false; }
  }
  function reduceMotion() {
    return !!(JR.isReducedMotion && JR.isReducedMotion());
  }
  function kindOf(entry) {
    var k = str(entry && entry.kind);
    return k || 'ancient';
  }
  function cultureOf(entry) {
    var c = str(entry && entry.culture);
    return c || '跨文化';
  }
  function dotClass(culture) { return DOT_CLASS[culture] || 'dot--cross'; }
  function normalizeDate(text) {
    /* 数据条目的 dateDisplay 常用 U+2014 表示年代区间；项目排版约定正文不用破折号，
       故在展示层归一为「至」，不改动数据文件。 */
    return str(text).replace(/\s*\u2014\s*/g, ' 至 ').replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
  }
  function dateLine(entry) {
    var display = str(entry && entry.dateDisplay);
    if (display) return normalizeDate(display);
    var y = num(entry && entry.year);
    if (y !== null) return normalizeDate(JR.fmtYear(y, str(entry && entry.yearNote)));
    return normalizeDate(str(entry && entry.eraLabel)) || '年代待考';
  }
  function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ------------------------------------------------------------ 名称匹配 */
  function termStrings(entry) {
    var term = entry && entry.term;
    var out = [];
    if (term) {
      out.push(str(term.primary));
      arr(term.variants).forEach(function (v) { out.push(str(v)); });
      out.push(str(term.original));
    }
    return out.filter(function (v) { return !!v; });
  }
  function keyMatches(text, key) {
    if (!text || !key) return false;
    if (/^[A-Za-z]/.test(key)) {
      var lower = text.toLowerCase();
      var k = key.toLowerCase();
      var re = new RegExp('(^|[^a-z])' + escapeRegex(k) + '(s)?($|[^a-z])');
      return re.test(lower);
    }
    return text.toLowerCase().indexOf(key.toLowerCase()) >= 0;
  }
  function entryMatchesNode(entry, node) {
    if (!node) return false;
    var strings = termStrings(entry);
    for (var i = 0; i < strings.length; i++) {
      for (var j = 0; j < node.keys.length; j++) {
        if (keyMatches(strings[i], node.keys[j])) return true;
      }
    }
    return false;
  }
  function entriesForNode(node) {
    if (!node) return [];
    return arr(JR.entries).filter(function (entry) { return entryMatchesNode(entry, node); });
  }
  function nodeCountMap() {
    var map = {};
    NODES.forEach(function (node) { map[node.id] = entriesForNode(node).length; });
    return map;
  }

  /* ------------------------------------------------------------ 连线几何 */
  function edgePoint(from, to) {
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    if (!dx && !dy) return { x: from.x, y: from.y };
    var halfW = 86;
    var halfH = 34;
    var sx = dx === 0 ? Infinity : halfW / Math.abs(dx);
    var sy = dy === 0 ? Infinity : halfH / Math.abs(dy);
    var scale = Math.min(sx, sy);
    return { x: from.x + dx * scale, y: from.y + dy * scale };
  }
  function round2(v) { return Math.round(v * 10) / 10; }
  function pathFor(edge) {
    var from = NODE_MAP[edge.from];
    var to = NODE_MAP[edge.to];
    if (!from || !to) return '';
    if (edge.route === 'elbow') {
      var start = { x: from.x, y: from.y + 34 };
      var end = { x: to.x + 86, y: to.y };
      var midY = 340;
      return 'M' + round2(start.x) + ' ' + round2(start.y) +
        ' L' + round2(start.x) + ' ' + midY +
        ' L700 ' + midY +
        ' L700 ' + round2(end.y) +
        ' L' + round2(end.x) + ' ' + round2(end.y);
    }
    var a = edgePoint(from, to);
    var b = edgePoint(to, from);
    return 'M' + round2(a.x) + ' ' + round2(a.y) + ' L' + round2(b.x) + ' ' + round2(b.y);
  }
  function edgeSVG() {
    var streams = ['cn', 'west', 'east', 'sci'];
    var defs = '<defs>' + streams.map(function (s) {
      return '<marker id="term-arrow-' + s + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
        '<path d="M1 1 L9 5 L1 9" class="term-arrowhead term-arrowhead--' + s + '"></path>' +
        '</marker>';
    }).join('') + '</defs>';
    var paths = EDGES.map(function (edge) {
      var d = pathFor(edge);
      if (!d) return '';
      return '<path d="' + d + '" class="term-edge term-edge--' + edge.stream + (edge.kind === 'dashed' ? ' term-edge--dashed' : '') + '"' +
        ' marker-end="url(#term-arrow-' + edge.stream + ')"></path>';
    }).join('');
    var labels = EDGE_LABELS.map(function (label) {
      return '<text x="' + label.x + '" y="' + label.y + '" class="term-edge__label term-edge__label--' + label.stream + '" text-anchor="middle" aria-hidden="true">' + esc(label.text) + '</text>';
    }).join('');
    return '<svg class="term-edges" width="' + CANVAS_W + '" height="' + CANVAS_H + '" viewBox="0 0 ' + CANVAS_W + ' ' + CANVAS_H + '" aria-hidden="true" focusable="false">' +
      defs + paths + labels + '</svg>';
  }

  /* ------------------------------------------------------------ 图 HTML */
  function nodeHTML(node, selectedId, count) {
    var active = selectedId === node.id;
    return '<button type="button" class="term-node term-node--' + node.stream + (active ? ' is-active' : '') + '"' +
      ' style="left:' + node.x + 'px;top:' + node.y + 'px"' +
      ' data-term-id="' + JR.escAttr(node.id) + '"' +
      ' aria-pressed="' + (active ? 'true' : 'false') + '"' +
      ' aria-label="' + JR.escAttr(node.name + '，相关条目 ' + count + ' 条') + '">' +
      '<span class="term-node__name">' + esc(node.name) + '</span>' +
      '<span class="term-node__orig mono">' + esc(node.orig) + '</span>' +
      '<span class="term-node__count mono" aria-hidden="true">' + count + '</span>' +
      '</button>';
  }
  function streamLabelHTML(item) {
    var dot = { cn: 'dot--cn', west: 'dot--west', east: 'dot--east', sci: 'dot--cross' }[item.cls] || 'dot--cross';
    return '<span class="term-stream term-stream--' + item.cls + '" style="left:' + item.x + 'px;top:' + item.y + 'px">' +
      '<span class="dot ' + dot + '" aria-hidden="true"></span>' + esc(item.text) + '</span>';
  }
  function graphHTML(selectedId, counts) {
    var nodesHTML = '';
    NODES.forEach(function (node) {
      nodesHTML += nodeHTML(node, selectedId, counts[node.id] || 0);
    });
    return '<div class="term-graph">' +
      '<div class="term-graph__head">' +
        '<h2 class="section-title term-subtitle" id="term-graph-title">名称谱系图</h2>' +
        '<div class="term-legend" aria-hidden="true">' +
          '<span class="term-legend__item"><span class="term-legend__line"></span>演化 / 合流</span>' +
          '<span class="term-legend__item"><span class="term-legend__line term-legend__line--dashed"></span>译名 / 命名借用</span>' +
        '</div>' +
      '</div>' +
      '<p class="caption term-graph__hint">实线表示同一语言传统内的名称演化或合流，虚线表示跨语言的译名、音译与命名借用，线色沿用源流颜色。节点右下角数字为相关条目数，点击节点可筛选下方条目，再次点击可取消选择。</p>' +
      '<div class="term-scroll" tabindex="0" role="region" aria-label="名称谱系图：中国、地中海、日本与朝鲜三条源流，加上科学旁支与合流区。按 Tab 可逐个聚焦名称节点。">' +
        '<div class="term-canvas" style="width:' + CANVAS_W + 'px;height:' + CANVAS_H + 'px">' +
          edgeSVG() +
          '<div class="term-converge" style="left:736px;top:208px;width:232px;height:196px" aria-hidden="true">' +
            '<p class="term-converge__label mono">合流区</p>' +
            '<p class="term-converge__note">译名互借与大众化之后的合流点，具体等同关系因文本而异。</p>' +
          '</div>' +
          STREAM_LABELS.map(streamLabelHTML).join('') +
          nodesHTML +
        '</div>' +
      '</div>' +
      '</div>';
  }

  /* ------------------------------------------------------------ 名称筛出条目 */
  function termEntryHTML(entry) {
    var term = entry.term || {};
    var names = [str(term.primary)].concat(arr(term.variants)).filter(function (v) { return !!v; });
    var display = names.slice(0, 3).join(' / ');
    var culture = cultureOf(entry);
    return '<li class="term-entry">' +
      '<div class="term-entry__main">' +
        '<a class="term-entry__title" href="#/entry/' + JR.param(entry.id) + '">' + esc(entry.title) + '</a>' +
        '<p class="term-entry__names">名称：<span class="mono">' + esc(display || '未注') + '</span>' +
          (str(term.original) ? '<span class="term-entry__orig mono">原词：' + esc(term.original) + '</span>' : '') +
        '</p>' +
      '</div>' +
      '<div class="term-entry__meta">' +
        '<span class="mono">' + esc(dateLine(entry)) + '</span>' +
        '<span class="tag tag--ghost">' + esc(JR.kindLabel(kindOf(entry))) + '</span>' +
        '<span class="culture ' + JR.cultureClass(culture) + '"><span class="dot ' + dotClass(culture) + '" aria-hidden="true"></span>' + esc(culture) + '</span>' +
      '</div>' +
      '</li>';
  }
  function selectedEntriesHTML(selected) {
    if (!selected) {
      if (!arr(JR.entries).length) {
        return '<section class="term-picked" data-term-entries>' +
          '<div class="empty term-empty">' +
            '<p class="empty__title">暂无可列出的条目</p>' +
            '<p class="empty__text">数据文件尚未装入条目。图谱中的名称节点仍会显示，待条目可用后即可按名称筛选。</p>' +
          '</div>' +
          '</section>';
      }
      return '<section class="term-picked" data-term-entries>' +
        '<p class="note term-pick">点击上方名称节点，这里会列出与该名称相关的条目；再次点击同一节点可取消选择。</p>' +
        '</section>';
    }
    var list = JR.sortByYear(entriesForNode(selected));
    var head = '<div class="term-picked__head">' +
      '<p class="kicker">按名称筛出</p>' +
      '<div class="term-picked__row">' +
        '<h2 class="term-picked__title">「' + esc(selected.name) + '」相关条目 <span class="mono term-picked__num">' + list.length + '</span></h2>' +
        '<button type="button" class="btn btn--ghost btn--sm" data-term-clear>取消选择</button>' +
      '</div>' +
      '<p class="term-picked__desc">' + esc(selected.desc) + '</p>' +
      '<p class="caption term-picked__meta">原词写法：' + esc(selected.orig) + '。统计口径：条目的 term.primary、variants 或 original 任一字段包含该名称，简繁与大小写按同一词处理。</p>' +
      '<p class="sr-only" role="status">「' + esc(selected.name) + '」相关条目 ' + list.length + ' 条</p>' +
      '</div>';
    if (!list.length) {
      return '<section class="term-picked" data-term-entries>' + head +
        '<div class="empty term-empty">' +
          '<p class="empty__title">该名称下暂无条目</p>' +
          '<p class="empty__text">数据库尚未装入条目，或暂无条目以该名称为 primary、variants 或 original。可先查看其他节点。</p>' +
        '</div></section>';
    }
    return '<section class="term-picked" data-term-entries>' + head +
      '<ul class="term-entries">' + list.map(termEntryHTML).join('') + '</ul>' +
      '</section>';
  }

  /* ------------------------------------------------------------ 译名对照表 */
  function buildRows(entries) {
    var map = {};
    var rows = [];
    (entries || []).forEach(function (entry) {
      var term = entry.term || {};
      var name = str(term.primary) || str(entry.title);
      if (!name) return;
      var row = map[name];
      if (!row) {
        row = map[name] = { name: name, count: 0, originals: [], sources: [], min: null, max: null, rep: null, first: entry };
        rows.push(row);
      }
      row.count += 1;
      var original = str(term.original);
      if (original && row.originals.indexOf(original) < 0) row.originals.push(original);
      var source = sourceLabel(entry);
      if (source && row.sources.indexOf(source) < 0) row.sources.push(source);
      var year = num(entry.year);
      if (year !== null) {
        if (row.min === null || year < row.min) row.min = year;
        if (row.max === null || year > row.max) row.max = year;
        if (!row.rep || year < num(row.rep.year)) row.rep = entry;
      }
    });
    rows.forEach(function (row) {
      if (!row.rep) row.rep = row.first;
    });
    return rows;
  }
  function scriptLabel(text) {
    if (!text) return '';
    if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(text)) return '希腊字母';
    if (/[\u3040-\u30FF]/.test(text)) return '日文';
    if (/[\uAC00-\uD7AF]/.test(text)) return '韩文';
    if (/[\u4E00-\u9FFF]/.test(text)) return '汉文';
    if (/[A-Za-z]/.test(text)) return '拉丁字母';
    return '';
  }
  function sourceLabel(entry) {
    var region = str(entry.region) || str(entry.culture);
    var script = scriptLabel(str(entry.term && entry.term.original));
    var parts = [];
    if (region) parts.push(region);
    if (script) parts.push(script);
    return parts.join(' · ');
  }
  function yearRangeLabel(min, max) {
    if (min === null) return '待考';
    if (max === null || min === max) return JR.fmtYear(min);
    return JR.fmtRange(min, max);
  }
  function sortRows(rows, sort, dir) {
    var list = rows.slice();
    var nameCmp = function (a, b) { return a.name.localeCompare(b.name, 'zh-Hans-CN'); };
    list.sort(function (a, b) {
      if (sort === 'count') {
        if (a.count !== b.count) return dir === 'desc' ? b.count - a.count : a.count - b.count;
        return nameCmp(a, b);
      }
      if (sort === 'year') {
        var ay = a.min === null ? Infinity : a.min;
        var by = b.min === null ? Infinity : b.min;
        if (ay !== by) return dir === 'desc' ? by - ay : ay - by;
        return nameCmp(a, b);
      }
      var cmp = nameCmp(a, b);
      return dir === 'desc' ? -cmp : cmp;
    });
    return list;
  }
  function ariaSort(key, sort, dir) {
    if (key !== sort) return 'none';
    return dir === 'asc' ? 'ascending' : 'descending';
  }
  function sortLabel(key, text, sort, dir) {
    if (key !== sort) return text;
    return text + ' ' + (dir === 'asc' ? '↑' : '↓');
  }
  function tableHTML(entries, sort, dir) {
    var rows = buildRows(entries);
    if (!rows.length) {
      return '<div class="empty term-table-empty">' +
        '<p class="empty__title">暂无可汇总的译名</p>' +
        '<p class="empty__text">条目装入后，这里会按 term.primary 归并生成译名对照表。</p>' +
        '</div>';
    }
    var sorted = sortRows(rows, sort, dir);
    var body = sorted.map(function (row) {
      return '<tr>' +
        '<th scope="row" class="term-table__name">' + esc(row.name) + '</th>' +
        '<td class="term-table__orig mono">' + esc(row.originals.join('；') || '未注') + '</td>' +
        '<td class="term-table__source">' + esc(row.sources.join('；') || '未注') + '</td>' +
        '<td class="term-table__count num">' + row.count + '</td>' +
        '<td class="term-table__years mono">' + esc(yearRangeLabel(row.min, row.max)) + '</td>' +
        '<td class="term-table__rep">' + (row.rep ? '<a class="link" href="#/entry/' + JR.param(row.rep.id) + '">' + esc(row.rep.title) + '</a>' : '') + '</td>' +
        '</tr>';
    }).join('');
    return '<div class="table-wrap">' +
      '<table class="table term-table">' +
        '<caption class="sr-only">译名对照表，按条目 term 字段汇总</caption>' +
        '<thead><tr>' +
          '<th scope="col" aria-sort="' + ariaSort('name', sort, dir) + '"><button type="button" class="term-sort" data-term-sort="name">' + esc(sortLabel('name', '名称', sort, dir)) + '</button></th>' +
          '<th scope="col">原词</th>' +
          '<th scope="col">语言 / 来源</th>' +
          '<th scope="col" aria-sort="' + ariaSort('count', sort, dir) + '"><button type="button" class="term-sort" data-term-sort="count">' + esc(sortLabel('count', '出现条目数', sort, dir)) + '</button></th>' +
          '<th scope="col" aria-sort="' + ariaSort('year', sort, dir) + '"><button type="button" class="term-sort" data-term-sort="year">' + esc(sortLabel('year', '年代范围', sort, dir)) + '</button></th>' +
          '<th scope="col">代表条目</th>' +
        '</tr></thead>' +
        '<tbody>' + body + '</tbody>' +
      '</table>' +
      '</div>';
  }
  function tableSectionHTML(entries, sort, dir) {
    return '<section class="term-section term-table-section" aria-labelledby="term-table-title">' +
      '<div class="section-head term-section__head">' +
        '<h2 class="section-title term-subtitle" id="term-table-title">译名对照表</h2>' +
        '<p class="section-desc">由条目 term 字段汇总：同名 primary 归并，原词与来源取并集。来源一栏取条目的 region 字段，文字线索据原词写法判定，不据此推定语种。点击表头可按名称、出现条目数或年代范围排序。</p>' +
      '</div>' +
      '<div data-term-table>' + tableHTML(entries, sort, dir) + '</div>' +
      '</section>';
  }

  /* ------------------------------------------------------------ 概念辨析 */
  function notesHTML() {
    return '<section class="term-section term-notes" aria-labelledby="term-notes-title">' +
      '<div class="section-head term-section__head">' +
        '<p class="kicker">辨析</p>' +
        '<h2 class="section-title term-subtitle" id="term-notes-title">四则概念辨析</h2>' +
        '<p class="section-desc">以下短注用于避免常见的名称混同。涉及尚未逐条核对的说法，标注「待核」；不引未经核对的书名、卷次与页码。</p>' +
      '</div>' +
      '<div class="term-notes__grid">' + NOTE_LIST.map(function (note) {
        return '<article class="panel term-note">' +
          '<h3 class="term-note__title">' + esc(note.title) + '</h3>' +
          '<p class="term-note__text">' + esc(note.text) + '</p>' +
          (note.flag ? '<p class="term-note__flag"><span class="badge badge--warn">' + esc(note.flag) + '</span> 本条为倾向性说明，具体用例待补。</p>' : '') +
          '</article>';
      }).join('') + '</div>' +
      '</section>';
  }

  /* ------------------------------------------------------------ 页面片段 */
  function headHTML(rowsCount) {
    return '<header class="page-head term-head">' +
      '<p class="kicker">名称</p>' +
      '<div class="page-head__row">' +
        '<div class="term-head__main">' +
          '<h1 class="display display--sm" id="term-title">名称谱系</h1>' +
          '<p class="lede mt-4">名称会滑动：鲛人、人鱼、美人鱼、塞壬、海妖、Siren、mermaid、人魚、マーメイド、인어，以及作为科学旁支的儒艮与海牛目。下图按三条源流与一个合流区排布名称关系，节点可点击筛选条目；下方另有译名对照表与概念辨析。</p>' +
        '</div>' +
        '<p class="meta term-head__meta">名称节点 ' + NODES.length + ' 个<br>译名归并 ' + rowsCount + ' 组<br>统计依据 term 字段</p>' +
      '</div>' +
      '</header>';
  }
  function footnoteHTML() {
    return '<p class="caption term-footnote">本页的名称关系是检索与阅读的示意图，依据条目字段自动统计，不构成词源或等同关系的结论；节点之间的连线不表示时间先后或直接传承。条目详情以各条目的 sources 与 confidence 为准。</p>';
  }

  /* ------------------------------------------------------------ 渲染 */
  function renderPage(params) {
    var p = params || {};
    var selectedId = nodeById(p.term) ? str(p.term) : '';
    var selected = nodeById(selectedId);
    var counts = nodeCountMap();
    var rowsCount = buildRows(arr(JR.entries)).length;
    return '<section class="wrap section section--page term-page" aria-labelledby="term-title">' +
      headHTML(rowsCount) +
      '<section class="term-section term-graph-section" aria-labelledby="term-graph-title">' +
        graphHTML(selectedId, counts) +
      '</section>' +
      '<section class="term-section term-picked-section" aria-labelledby="term-picked-title">' +
        '<h2 class="section-title term-subtitle" id="term-picked-title">按名称浏览条目</h2>' +
        selectedEntriesHTML(selected) +
      '</section>' +
      tableSectionHTML(arr(JR.entries), 'name', 'asc') +
      notesHTML() +
      footnoteHTML() +
      '</section>';
  }

  /* ------------------------------------------------------------ 交互 */
  function selectNode(id, fromClick) {
    if (!ctx) return;
    var node = nodeById(id);
    var next = node ? node.id : '';
    if (fromClick && next && next === ctx.state.selectedId) next = '';
    ctx.state.selectedId = next;
    var selected = nodeById(next);
    eachNode(ctx.root.querySelectorAll('[data-term-id]'), function (btn) {
      var active = btn.getAttribute('data-term-id') === next;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (ctx.refs.entries) ctx.refs.entries.innerHTML = selectedEntriesHTML(selected);
    if (typeof JR.replaceQuery === 'function') JR.replaceQuery({ term: next || '' }, 'terms');
    if (selected && isNarrow() && ctx.refs.entries) {
      try {
        ctx.refs.entries.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
      } catch (err) { try { ctx.refs.entries.scrollIntoView(); } catch (err2) {} }
    }
  }
  function applySort(key) {
    if (!ctx) return;
    if (key !== 'name' && key !== 'count' && key !== 'year') return;
    if (ctx.state.sort === key) {
      ctx.state.dir = ctx.state.dir === 'asc' ? 'desc' : 'asc';
    } else {
      ctx.state.sort = key;
      ctx.state.dir = key === 'count' ? 'desc' : 'asc';
    }
    if (ctx.refs.table) {
      ctx.refs.table.innerHTML = tableHTML(arr(JR.entries), ctx.state.sort, ctx.state.dir);
    }
  }
  function onClick(ev) {
    if (!ctx) return;
    var target = ev.target;
    var nodeBtn = closest(target, '[data-term-id]');
    if (nodeBtn) {
      selectNode(nodeBtn.getAttribute('data-term-id'), true);
      return;
    }
    if (closest(target, '[data-term-clear]')) {
      selectNode('', true);
      return;
    }
    var sortBtn = closest(target, '[data-term-sort]');
    if (sortBtn) {
      applySort(sortBtn.getAttribute('data-term-sort'));
    }
  }

  /* ------------------------------------------------------------ 页面注册 */
  JR.page('terms', {
    title: '名称谱系',
    render: function (params) { return renderPage(params || {}); },
    mount: function (root, params) {
      var p = params || {};
      var selectedId = nodeById(p.term) ? str(p.term) : '';
      var refs = {
        entries: root.querySelector('[data-term-entries]'),
        table: root.querySelector('[data-term-table]')
      };
      if (!refs.entries || !refs.table) return;
      ctx = {
        root: root,
        refs: refs,
        state: { selectedId: selectedId, sort: 'name', dir: 'asc' },
        cleanups: []
      };
      root.addEventListener('click', onClick);
      ctx.cleanups.push(function () { root.removeEventListener('click', onClick); });
      if (str(p.term) && !selectedId && typeof JR.replaceQuery === 'function') {
        JR.replaceQuery({ term: '' }, 'terms');
      }
    },
    unmount: function () {
      if (!ctx) return;
      var cleanups = ctx.cleanups || [];
      for (var i = 0; i < cleanups.length; i++) {
        try { cleanups[i](); } catch (err) {}
      }
      ctx = null;
    }
  });
})(typeof window !== 'undefined' ? window : this);
