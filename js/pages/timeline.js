/* ==========================================================================
   鲛人研究数据库 · 时间轴页面（#/timeline）
   依赖：js/core.js（window.JR）、data/schema.js
   结构：四条谱系泳道 + 线性年代横轴；render 只返回 HTML 字符串，
         筛选、浮层、focus 定位等交互全部在 mount 中绑定并在 unmount 清理。
   ========================================================================== */
(function (global) {
  'use strict';

  var JR = global.JR;
  if (!JR) return;

  /* ------------------------------------------------------------ 常量 */
  var CULTURES = ['中国', '西方', '东亚', '跨文化'];
  var KINDS = ['ancient', 'translation', 'modern'];
  var SCALES = {
    long: { id: 'long', label: '长时段', min: -800, max: 2026, span: '约公元前 800 至 2026' },
    modern: { id: 'modern', label: '近现代', min: 1800, max: 2026, span: '1800 至 2026' }
  };
  var DOT_CLASS = { '中国': 'dot--cn', '西方': 'dot--west', '东亚': 'dot--east', '跨文化': 'dot--cross' };
  var LANE_ROWS = 3;
  var ROW_H = 28;
  var TRACK_H = 100;
  var AREA_W = 820;
  var MIN_GAP = 22;

  var ctx = null;

  /* ------------------------------------------------------------ 小工具 */
  function str(v) {
    if (v === null || v === undefined) return '';
    return typeof v === 'string' ? v : String(v);
  }
  function arr(v) { return Array.isArray(v) ? v : []; }
  function num(v) { return (typeof v === 'number' && isFinite(v)) ? v : null; }
  function esc(v) { return JR.esc(str(v)); }
  function pct(ratio) {
    var r = Math.max(0, Math.min(1, isFinite(ratio) ? ratio : 0));
    return (Math.round(r * 100000) / 1000) + '%';
  }
  function eachNode(list, fn) {
    for (var i = 0; i < list.length; i++) fn(list[i], i);
  }
  function cultureOf(entry) {
    var c = str(entry && entry.culture);
    return CULTURES.indexOf(c) >= 0 ? c : '跨文化';
  }
  function kindOf(entry) {
    var k = str(entry && entry.kind);
    return KINDS.indexOf(k) >= 0 ? k : 'ancient';
  }
  function dotClass(culture) { return DOT_CLASS[culture] || 'dot--cross'; }
  function reduceMotion() {
    return !!(JR.isReducedMotion && JR.isReducedMotion());
  }
  function isNarrow() {
    try {
      return !!(global.matchMedia && global.matchMedia('(max-width: 760px)').matches);
    } catch (err) { return false; }
  }
  function closest(el, selector) {
    if (!el || typeof el.closest !== 'function') return null;
    return el.closest(selector);
  }

  /* ------------------------------------------------------------ 查询参数 */
  function parseList(value, all, keepDefault) {
    if (typeof value !== 'string' || value === '') return all.slice();
    var parts = value.split(',');
    var picked = [];
    parts.forEach(function (raw) {
      var v = raw.replace(/^\s+|\s+$/g, '');
      if (!v) return;
      if (all.indexOf(v) >= 0 && picked.indexOf(v) < 0) picked.push(v);
    });
    if (!parts.length) return all.slice();
    var onlyNone = parts.length === 1 && parts[0].replace(/^\s+|\s+$/g, '') === 'none';
    if (onlyNone) return [];
    if (!picked.length) return keepDefault === false ? [] : all.slice();
    return all.filter(function (v) { return picked.indexOf(v) >= 0; });
  }
  function serializeList(list, all) {
    if (list.length >= all.length) return '';
    if (!list.length) return 'none';
    return all.filter(function (v) { return list.indexOf(v) >= 0; }).join(',');
  }
  function normalize(params) {
    var p = params || {};
    return {
      scale: p.scale === 'modern' ? 'modern' : 'long',
      cultures: parseList(p.culture, CULTURES),
      kinds: parseList(p.kind, KINDS),
      view: 'chart',
      focus: str(p.focus)
    };
  }
  function isDefaultFilters(st) {
    return st.cultures.length === CULTURES.length && st.kinds.length === KINDS.length;
  }
  function syncURL() {
    if (!ctx || typeof JR.replaceQuery !== 'function') return;
    var st = ctx.state;
    JR.replaceQuery({
      scale: st.scale === 'long' ? '' : 'modern',
      culture: serializeList(st.cultures, CULTURES),
      kind: serializeList(st.kinds, KINDS)
    }, 'timeline');
  }

  /* ------------------------------------------------------------ 数据与坐标 */
  function dataSummary(axis) {
    var all = arr(JR.entries);
    var dated = 0;
    var inScale = 0;
    all.forEach(function (e) {
      var y = num(e.year);
      if (y === null) return;
      dated += 1;
      if (y >= axis.min && y <= axis.max) inScale += 1;
    });
    return { all: all.length, dated: dated, undated: all.length - dated, inScale: inScale, outside: dated - inScale };
  }
  function poolEntries(axis) {
    return arr(JR.entries).filter(function (e) {
      var y = num(e.year);
      return y !== null && y >= axis.min && y <= axis.max;
    });
  }
  function applyFilters(list, st) {
    return list.filter(function (e) {
      return st.cultures.indexOf(cultureOf(e)) >= 0 && st.kinds.indexOf(kindOf(e)) >= 0;
    });
  }
  function centuryLabel(c) {
    return c < 0 ? '前' + Math.abs(c) + '世纪' : c + '世纪';
  }
  function centuryIndex(year) {
    var y = num(year);
    if (y === null) return { key: 'unknown', label: '年代待考', start: 99999 };
    if (y < 0) {
      var c = Math.floor((Math.abs(y) - 1) / 100) + 1;
      return { key: 'bce-' + c, label: '前' + c + '世纪', start: -c * 100 };
    }
    var ce = y <= 0 ? 1 : Math.floor((y - 1) / 100) + 1;
    return { key: 'ce-' + ce, label: ce + '世纪', start: (ce - 1) * 100 + 1 };
  }
  function normalizeDate(text) {
    /* 数据条目的 dateDisplay 常用 U+2014 表示年代区间；项目排版约定正文不用破折号，
       故在展示层归一为「至」，不改动数据文件。 */
    return str(text).replace(/\s*\u2014\s*/g, ' 至 ').replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
  }
  function dateLine(entry) {
    var display = str(entry && entry.dateDisplay);
    if (display) return normalizeDate(display);
    var y = num(entry && entry.year);
    if (y !== null) return normalizeDate(JR.fmtYear(y, str(entry.yearNote)));
    return normalizeDate(str(entry && entry.eraLabel)) || '年代待考';
  }
  function edgeClass(edge) {
    if (edge === 'start') return ' tl-axis__label--start';
    if (edge === 'end') return ' tl-axis__label--end';
    return '';
  }
  function axisFor(scale) {
    var min = scale.min;
    var max = scale.max;
    var span = max - min;
    var axis = { id: scale.id, min: min, max: max, span: span, grids: [], centuries: [], years: [] };
    function pos(year) { return (year - min) / span; }
    if (scale.id === 'long') {
      var cs = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
      cs.forEach(function (c) {
        var year = c < 0 ? c * 100 : (c - 1) * 100 + 1;
        var p = pos(year);
        axis.grids.push({ pos: p, major: c === 1 });
        if (c === -8 || c === -4 || c === 1 || c === 5 || c === 9 || c === 13 || c === 17 || c === 21) {
          axis.centuries.push({ pos: p, text: centuryLabel(c), edge: p < 0.015 ? 'start' : (p > 0.975 ? 'end' : '') });
        }
      });
      axis.years.push({ pos: 0, text: '约前800', edge: 'start' });
      axis.years.push({ pos: 1, text: '2026', edge: 'end' });
    } else {
      [1801, 1901, 2001].forEach(function (year) {
        axis.grids.push({ pos: pos(year), major: true });
      });
      [19, 20, 21].forEach(function (c) {
        var p = pos((c - 1) * 100 + 1);
        axis.centuries.push({ pos: p, text: c + '世纪', edge: p < 0.015 ? 'start' : (p > 0.975 ? 'end' : '') });
      });
      for (var y = 1800; y <= 2025; y += 25) {
        var py = pos(y);
        axis.grids.push({ pos: py, major: false });
        if (y === 1800 || y === 1850 || y === 1900 || y === 1950 || y === 2000) {
          axis.years.push({ pos: py, text: String(y), edge: py < 0.015 ? 'start' : (py > 0.975 ? 'end' : '') });
        }
      }
      axis.years.push({ pos: 1, text: '2026', edge: 'end' });
    }
    return axis;
  }
  function laneData(list, axis) {
    var lanes = {};
    CULTURES.forEach(function (c) { lanes[c] = { list: [], placed: {} }; });
    CULTURES.forEach(function (c) {
      var lane = lanes[c];
      lane.list = list.filter(function (e) { return cultureOf(e) === c; }).sort(function (a, b) {
        return (num(a.year) || 0) - (num(b.year) || 0);
      });
      var gapYears = axis.span * MIN_GAP / AREA_W;
      var rowLast = [];
      lane.list.forEach(function (e, index) {
        var y = num(e.year);
        if (y === null) y = axis.min;
        var row = -1;
        for (var i = 0; i < LANE_ROWS; i++) {
          if (rowLast[i] === undefined || Math.abs(y - rowLast[i]) >= gapYears) { row = i; break; }
        }
        if (row < 0) {
          row = 0;
          var best = -1;
          for (var j = 0; j < LANE_ROWS; j++) {
            var gap = typeof rowLast[j] === 'number' ? Math.abs(y - rowLast[j]) : axis.span;
            if (gap > best) { best = gap; row = j; }
          }
        }
        rowLast[row] = y;
        lane.placed[e.id] = { row: row, left: (y - axis.min) / axis.span, index: index };
      });
    });
    return lanes;
  }

  /* ------------------------------------------------------------ 摘要字段 */
  function markAria(entry) {
    var parts = [str(entry.title) || '未命名条目', dateLine(entry), JR.kindLabel(kindOf(entry)), cultureOf(entry)];
    return parts.join('，');
  }
  function markerHTML(entry, lane, focused) {
    var info = lane.placed[entry.id] || { row: 0, left: 0.5, index: 0 };
    var top = 10 + info.row * ROW_H;
    var delay = Math.min(320, info.index * 8);
    return '<button type="button" class="tl-mark ' + JR.cultureClass(cultureOf(entry)) + ' tl-mark--' + kindOf(entry) + (focused ? ' is-focus' : '') + '"' +
      ' style="left:' + pct(info.left) + ';top:' + top + 'px;--tl-delay:' + delay + 'ms"' +
      ' data-entry-id="' + JR.escAttr(entry.id) + '"' +
      ' aria-label="' + JR.escAttr(markAria(entry)) + '">' +
      '<span class="tl-mark__dot" aria-hidden="true"></span>' +
      '</button>';
  }
  function listItemHTML(entry) {
    var c = cultureOf(entry);
    return '<li class="tl-item">' +
      '<a class="tl-item__title" href="#/entry/' + JR.param(entry.id) + '">' + esc(entry.title) + '</a>' +
      '<span class="tl-item__meta mono">' + esc(dateLine(entry)) + '</span>' +
      '<span class="tag tag--ghost">' + esc(JR.kindLabel(kindOf(entry))) + '</span>' +
      '<span class="culture ' + JR.cultureClass(c) + '"><span class="dot ' + dotClass(c) + '"></span>' + esc(c) + '</span>' +
      '</li>';
  }

  /* ------------------------------------------------------------ 图表 HTML */
  function axisHTML(axis) {
    var unit = axis.id === 'long' ? '世纪' : '年代';
    var tickHTML = '';
    var centuryHTML = '';
    var yearsHTML = '';
    var gridHTML = '';
    axis.grids.forEach(function (g) {
      tickHTML += '<span class="tl-tick' + (g.major ? ' tl-tick--major' : '') + '" style="left:' + pct(g.pos) + '"></span>';
      gridHTML += '<span class="tl-grid' + (g.major ? ' tl-grid--major' : '') + '" style="left:' + pct(g.pos) + '"></span>';
    });
    axis.centuries.forEach(function (t) {
      centuryHTML += '<span class="tl-axis__clabel' + edgeClass(t.edge) + '" style="left:' + pct(t.pos) + '">' + esc(t.text) + '</span>';
    });
    axis.years.forEach(function (t) {
      yearsHTML += '<span class="tl-axis__ylabel mono' + edgeClass(t.edge) + '" style="left:' + pct(t.pos) + '">' + esc(t.text) + '</span>';
    });
    return {
      gridHTML: gridHTML,
      markup: '<div class="tl-axis" aria-hidden="true">' +
        '<div class="tl-axis__corner"><span class="mono">' + esc(unit) + '</span></div>' +
        '<div class="tl-axis__track">' +
          '<div class="tl-axis__area">' +
            '<span class="tl-axis__centuries">' + centuryHTML + '</span>' +
            '<span class="tl-axis__years">' + yearsHTML + '</span>' +
            '<span class="tl-axis__ticks">' + tickHTML + '</span>' +
          '</div>' +
        '</div>' +
        '</div>'
    };
  }
  function chartHTML(list, st, axis, focusId) {
    var lanes = laneData(list, axis);
    var axisParts = axisHTML(axis);
    var laneHTML = '';
    CULTURES.forEach(function (c) {
      var lane = lanes[c];
      var marks = '';
      lane.list.forEach(function (e) {
        marks += markerHTML(e, lane, !!(focusId && e.id === focusId));
      });
      laneHTML += '<div class="tl-lane">' +
        '<div class="tl-lane__label">' +
          '<span class="culture ' + JR.cultureClass(c) + '"><span class="dot ' + dotClass(c) + '"></span>' + esc(c) + '</span>' +
          '<span class="tl-lane__count mono">' + lane.list.length + ' 条</span>' +
        '</div>' +
        '<div class="tl-track" style="height:' + TRACK_H + 'px">' +
          '<div class="tl-track__area">' +
            '<span class="tl-lane__grids" aria-hidden="true">' + axisParts.gridHTML + '</span>' +
            (lane.list.length ? marks : '<span class="tl-lane__nodata">本尺度内暂无条目</span>') +
          '</div>' +
        '</div>' +
        '</div>';
    });
    return '<p class="caption tl-scroll-hint">窄屏下可横向滚动查看完整时间轴，也可切换到列表视图。</p>' +
      '<div class="tl-scroll" role="region" tabindex="0" aria-label="时间轴图：' + esc(SCALES[st.scale].label) + '，四条泳道依次为中国、西方、东亚、跨文化。每个标记可打开对应条目；按 Tab 可逐个聚焦。">' +
        '<div class="tl-chart">' +
          axisParts.markup +
          laneHTML +
        '</div>' +
      '</div>' +
      '<p class="caption tl-chart__note">' + esc(axisCaption(axis)) + '</p>';
  }
  function axisCaption(axis) {
    if (axis.id === 'long') return '横轴为世纪，每格 100 年，深线为公元 1 世纪分界；标记位置按年份线性映射。';
    return '横轴为年代，每格 25 年，深线为 19、20、21 世纪分界；标记位置按年份线性映射。';
  }
  function listHTML(list, axis, openAll) {
    if (!list.length) return '';
    var groups = [];
    var map = {};
    list.forEach(function (e) {
      var c = centuryIndex(e.year);
      if (!map[c.key]) {
        map[c.key] = { key: c.key, label: c.label, start: c.start, list: [] };
        groups.push(map[c.key]);
      }
      map[c.key].list.push(e);
    });
    groups.sort(function (a, b) { return a.start - b.start; });
    return '<div class="tl-list-wrap">' + groups.map(function (g) {
      return '<details class="tl-century"' + (openAll ? ' open' : '') + '>' +
        '<summary class="tl-century__summary">' +
          '<span class="tl-century__label">' + esc(g.label) + '</span>' +
          '<span class="tl-century__count mono">' + g.list.length + ' 条</span>' +
        '</summary>' +
        '<ul class="tl-items">' + g.list.map(listItemHTML).join('') + '</ul>' +
        '</details>';
    }).join('') + '</div>';
  }
  function countHTML(filteredLen, summary) {
    var extra = [];
    if (summary.undated) extra.push('无年代 ' + summary.undated + ' 条');
    if (summary.outside) extra.push('尺度外 ' + summary.outside + ' 条');
    var note = '全部 ' + summary.all + ' 条' + (extra.length ? '；' + extra.join('，') : '');
    return '当前显示 <strong>' + filteredLen + '</strong> 条<span class="tl-count__sep">/</span>尺度内 ' + summary.inScale + ' 条' +
      '<span class="tl-count__note">' + esc(note) + '</span>';
  }
  function emptyHTML(summary, st) {
    var title = '';
    var text = '';
    var action = '';
    if (!summary.all) {
      title = '暂无可绘制的条目';
      text = '数据文件还没有装入条目。时间轴会在数据可用后自动呈现；也可以先到资料库查看说明。';
      action = '<a class="btn btn--ghost btn--sm" href="#/db">前往资料库</a>';
    } else if (!summary.inScale) {
      title = '当前时间尺度内没有条目';
      if (st.scale === 'long') {
        text = '所收条目的年代都落在 2026 年之后，或没有可定位的年份。可切换到近现代尺度查看。';
        action = '<button type="button" class="btn btn--ghost btn--sm" data-tl-scale="modern">切换到近现代</button>';
      } else {
        text = '近现代尺度内没有条目，可切换回长时段查看完整编年。';
        action = '<button type="button" class="btn btn--ghost btn--sm" data-tl-scale="long">切换到长时段</button>';
      }
    } else {
      title = '没有符合筛选的条目';
      text = '当前谱系与类型筛选下没有结果。可以重置筛选，或切换到列表视图逐条浏览。';
      action = '<button type="button" class="btn btn--ghost btn--sm" data-tl-reset>重置筛选</button>';
    }
    return '<div class="empty tl-empty">' +
      '<p class="empty__title">' + esc(title) + '</p>' +
      '<p class="empty__text">' + esc(text) + '</p>' +
      action +
      '</div>';
  }

  /* ------------------------------------------------------------ 页面片段 */
  function headHTML(st, summary) {
    return '<header class="page-head tl-head">' +
      '<p class="kicker">编年</p>' +
      '<div class="page-head__row">' +
        '<div class="tl-head__main">' +
          '<h1 class="display display--sm" id="tl-title">时间轴</h1>' +
          '<p class="lede mt-4">这里是鲛人、人鱼、美人鱼、塞壬等形象在年代上的编年视图。四条泳道按谱系分开，每个标记是一条已收条目，横轴按年份线性排布，同年或年代相邻的标记会在道内分层错开。悬停或聚焦可查看摘要，点击进入条目详情。</p>' +
        '</div>' +
        '<p class="meta tl-head__meta">所收条目 ' + summary.all + ' 条<br>可定位年代 ' + summary.dated + ' 条<br>当前尺度 ' + esc(SCALES[st.scale].span) + '</p>' +
      '</div>' +
      '</header>';
  }
  function controlsHTML(st, pool, summary, filteredLen) {
    var cultureCounts = {};
    var kindCounts = {};
    pool.forEach(function (e) {
      var c = cultureOf(e);
      var k = kindOf(e);
      cultureCounts[c] = (cultureCounts[c] || 0) + 1;
      kindCounts[k] = (kindCounts[k] || 0) + 1;
    });
    var scaleButtons = ['long', 'modern'].map(function (id) {
      return '<button type="button" class="btn btn--sm tl-seg__btn" data-tl-scale="' + id + '" aria-pressed="' + (st.scale === id ? 'true' : 'false') + '">' +
        esc(SCALES[id].label) + '</button>';
    }).join('');
    var cultureChips = CULTURES.map(function (c) {
      return '<button type="button" class="chip tl-chip" data-tl-culture="' + JR.escAttr(c) + '" aria-pressed="' + (st.cultures.indexOf(c) >= 0 ? 'true' : 'false') + '">' +
        '<span class="dot ' + dotClass(c) + '" aria-hidden="true"></span>' + esc(c) +
        '<span class="chip__count">' + (cultureCounts[c] || 0) + '</span></button>';
    }).join('');
    var kindChips = KINDS.map(function (k) {
      return '<button type="button" class="chip tl-chip" data-tl-kind="' + k + '" aria-pressed="' + (st.kinds.indexOf(k) >= 0 ? 'true' : 'false') + '">' +
        esc(JR.kindLabel(k)) + '<span class="chip__count">' + (kindCounts[k] || 0) + '</span></button>';
    }).join('');
    return '<div class="tl-controls">' +
      '<div class="tl-controls__row">' +
        '<span class="field-label tl-controls__label" id="tl-scale-label">时间尺度</span>' +
        '<div class="btn-group tl-seg" role="group" aria-labelledby="tl-scale-label">' + scaleButtons + '</div>' +
        '<p class="caption tl-scale-note">长时段 ' + esc(SCALES.long.span) + '；近现代 ' + esc(SCALES.modern.span) + '。</p>' +
      '</div>' +
      '<div class="tl-controls__row">' +
        '<span class="field-label tl-controls__label" id="tl-culture-label">谱系</span>' +
        '<div class="chip-list" role="group" aria-labelledby="tl-culture-label" data-tl-cultures>' + cultureChips + '</div>' +
      '</div>' +
      '<div class="tl-controls__row">' +
        '<span class="field-label tl-controls__label" id="tl-kind-label">类型</span>' +
        '<div class="chip-list" role="group" aria-labelledby="tl-kind-label" data-tl-kinds>' + kindChips + '</div>' +
        '<button type="button" class="btn btn--ghost btn--sm tl-reset" data-tl-reset' + (isDefaultFilters(st) ? ' disabled' : '') + '>重置筛选</button>' +
      '</div>' +
      '<div class="toolbar tl-toolbar">' +
        '<p class="count tl-count" data-tl-count role="status" aria-live="polite">' + countHTML(filteredLen, summary) + '</p>' +
        '<div class="toolbar__group">' +
          '<span class="field-label tl-view-label" id="tl-view-label">视图</span>' +
          '<div class="btn-group tl-seg" role="group" aria-labelledby="tl-view-label">' +
            '<button type="button" class="btn btn--sm tl-seg__btn" data-tl-view="chart" aria-pressed="' + (st.view === 'chart' ? 'true' : 'false') + '">时序图' + JR.icon('timeline') + '</button>' +
            '<button type="button" class="btn btn--sm tl-seg__btn" data-tl-view="list" aria-pressed="' + (st.view === 'list' ? 'true' : 'false') + '">列表' + JR.icon('list') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '</div>';
  }
  function legendHTML() {
    var cultureItems = CULTURES.map(function (c) {
      return '<span class="tl-legend__item"><span class="dot ' + dotClass(c) + '" aria-hidden="true"></span>' + esc(c) + '</span>';
    }).join('');
    return '<div class="tl-legend panel panel--flat">' +
      '<div class="tl-legend__group">' +
        '<span class="tl-legend__title">谱系</span>' + cultureItems +
      '</div>' +
      '<div class="tl-legend__group">' +
        '<span class="tl-legend__title">类型</span>' +
        '<span class="tl-legend__item"><span class="tl-legend__shape tl-legend__shape--ancient" aria-hidden="true"></span>古籍与古典图像</span>' +
        '<span class="tl-legend__item"><span class="tl-legend__shape tl-legend__shape--translation" aria-hidden="true"></span>译名与译本</span>' +
        '<span class="tl-legend__item"><span class="tl-legend__shape tl-legend__shape--modern" aria-hidden="true"></span>当代作品与论评</span>' +
      '</div>' +
      '<p class="caption tl-legend__note">颜色表示谱系，形状表示类型。跨文化条目统一作灰色空心标记，以免与其他谱系混同；颜色与形状都相同的标记，靠泳道内的三层错位分开。</p>' +
      '</div>';
  }
  function footnoteHTML() {
    return '<p class="caption tl-footnote">年份取条目的 year 字段，估算取中值；无年代或落在尺度外的条目暂不在图中定位，可在 <a class="link" href="#/db">资料库</a> 中检索。列表视图按世纪分组，是时序图的文本替代路径。</p>';
  }

  /* ------------------------------------------------------------ 渲染 */
  function renderPage(params) {
    var st = normalize(params);
    var axis = axisFor(SCALES[st.scale]);
    var summary = dataSummary(axis);
    var pool = poolEntries(axis);
    var filtered = applyFilters(pool, st);
    var empty = filtered.length === 0;
    var focusId = str(params && params.focus);
    return '<section class="wrap section section--page tl-page" aria-labelledby="tl-title">' +
      headHTML(st, summary) +
      controlsHTML(st, pool, summary, filtered.length) +
      '<div class="tl-results">' +
        '<div class="tl-chart-host" data-tl-chart' + (empty ? ' hidden' : '') + '>' +
          (empty ? '' : chartHTML(filtered, st, axis, focusId)) +
        '</div>' +
        '<div class="tl-list-host" data-tl-list hidden>' +
          (empty ? '' : listHTML(filtered, axis, false)) +
        '</div>' +
        '<div class="tl-empty-host" data-tl-empty' + (empty ? '' : ' hidden') + '>' +
          (empty ? emptyHTML(summary, st) : '') +
        '</div>' +
      '</div>' +
      legendHTML() +
      footnoteHTML() +
      '</section>';
  }

  /* ------------------------------------------------------------ 浮层 */
  function createTip() {
    if (typeof document === 'undefined') return;
    var tip = document.createElement('div');
    tip.className = 'tl-tip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    document.body.appendChild(tip);
    ctx.tip = tip;
    ctx.cleanups.push(function () {
      if (tip.parentNode) tip.parentNode.removeChild(tip);
    });
  }
  function showTip(marker) {
    if (!ctx || !ctx.tip) return;
    var entry = JR.byId(marker.getAttribute('data-entry-id'));
    if (!entry) return;
    var traits = arr(entry.traits).slice(0, 2).map(function (t) { return esc(JR.traitLabel(t)); });
    var culture = cultureOf(entry);
    ctx.tip.innerHTML = '<p class="tl-tip__title">' + esc(entry.title) + '</p>' +
      '<p class="tl-tip__meta mono">' + esc(dateLine(entry)) + '</p>' +
      '<p class="tl-tip__line"><span class="tl-tip__kind">' + esc(JR.kindLabel(kindOf(entry))) + '</span>' +
        '<span class="culture ' + JR.cultureClass(culture) + '"><span class="dot ' + dotClass(culture) + '"></span>' + esc(culture) + '</span></p>' +
      (traits.length ? '<p class="tl-tip__traits">特征：' + traits.join(' · ') + '</p>' : '<p class="tl-tip__traits muted">特征尚未标注</p>') +
      '<p class="tl-tip__hint">点击查看条目</p>';
    ctx.tip.hidden = false;
    ctx.tip.classList.add('is-on');
    positionTip(marker);
  }
  function positionTip(marker) {
    if (!ctx || !ctx.tip) return;
    var tip = ctx.tip;
    var rect = marker.getBoundingClientRect();
    var width = tip.offsetWidth;
    var height = tip.offsetHeight;
    var vw = global.innerWidth || 1024;
    var vh = global.innerHeight || 768;
    var left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(12, Math.min(left, vw - width - 12));
    var top = rect.top - height - 10;
    if (top < 8) top = rect.bottom + 10;
    if (top + height > vh - 8) top = Math.max(8, vh - height - 8);
    tip.style.left = Math.round(left) + 'px';
    tip.style.top = Math.round(top) + 'px';
  }
  function hideTip() {
    if (!ctx || !ctx.tip) return;
    ctx.tip.hidden = true;
    ctx.tip.classList.remove('is-on');
  }

  /* ------------------------------------------------------------ 交互重绘 */
  function paint() {
    if (!ctx) return;
    var st = ctx.state;
    var root = ctx.root;
    var refs = ctx.refs;
    var axis = axisFor(SCALES[st.scale]);
    var summary = dataSummary(axis);
    var pool = poolEntries(axis);
    var filtered = applyFilters(pool, st);
    var empty = filtered.length === 0;
    hideTip();
    refs.chart.innerHTML = empty ? '' : chartHTML(filtered, st, axis, '');
    refs.list.innerHTML = empty ? '' : listHTML(filtered, axis, ctx.narrow);
    refs.empty.innerHTML = empty ? emptyHTML(summary, st) : '';
    refs.chart.hidden = empty || st.view !== 'chart';
    refs.list.hidden = empty || st.view !== 'list';
    refs.empty.hidden = !empty;
    refs.count.innerHTML = countHTML(filtered.length, summary);
    eachNode(root.querySelectorAll('[data-tl-scale]'), function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-tl-scale') === st.scale ? 'true' : 'false');
    });
    eachNode(root.querySelectorAll('[data-tl-view]'), function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-tl-view') === st.view ? 'true' : 'false');
    });
    var cultureCounts = {};
    var kindCounts = {};
    pool.forEach(function (e) {
      var c = cultureOf(e);
      var k = kindOf(e);
      cultureCounts[c] = (cultureCounts[c] || 0) + 1;
      kindCounts[k] = (kindCounts[k] || 0) + 1;
    });
    eachNode(root.querySelectorAll('[data-tl-culture]'), function (btn) {
      var c = btn.getAttribute('data-tl-culture');
      btn.setAttribute('aria-pressed', st.cultures.indexOf(c) >= 0 ? 'true' : 'false');
      var counter = btn.querySelector('.chip__count');
      if (counter) counter.textContent = String(cultureCounts[c] || 0);
    });
    eachNode(root.querySelectorAll('[data-tl-kind]'), function (btn) {
      var k = btn.getAttribute('data-tl-kind');
      btn.setAttribute('aria-pressed', st.kinds.indexOf(k) >= 0 ? 'true' : 'false');
      var counter = btn.querySelector('.chip__count');
      if (counter) counter.textContent = String(kindCounts[k] || 0);
    });
    if (refs.reset) refs.reset.disabled = isDefaultFilters(st);
  }
  function toggleValue(list, value, all) {
    if (!value || all.indexOf(value) < 0) return list;
    var index = list.indexOf(value);
    if (index >= 0) list.splice(index, 1);
    else list.push(value);
    list.sort(function (a, b) { return all.indexOf(a) - all.indexOf(b); });
    return list;
  }
  function onClick(ev) {
    if (!ctx) return;
    var st = ctx.state;
    var target = ev.target;
    var mark = closest(target, '.tl-mark');
    if (mark) {
      var id = mark.getAttribute('data-entry-id');
      if (id) JR.go('entry/' + encodeURIComponent(id));
      return;
    }
    var scaleBtn = closest(target, '[data-tl-scale]');
    if (scaleBtn) {
      var scale = scaleBtn.getAttribute('data-tl-scale');
      if (SCALES[scale] && st.scale !== scale) {
        st.scale = scale;
        st.focus = '';
        syncURL();
        paint();
      }
      return;
    }
    var cultureBtn = closest(target, '[data-tl-culture]');
    if (cultureBtn) {
      toggleValue(st.cultures, cultureBtn.getAttribute('data-tl-culture'), CULTURES);
      st.focus = '';
      syncURL();
      paint();
      return;
    }
    var kindBtn = closest(target, '[data-tl-kind]');
    if (kindBtn) {
      toggleValue(st.kinds, kindBtn.getAttribute('data-tl-kind'), KINDS);
      st.focus = '';
      syncURL();
      paint();
      return;
    }
    if (closest(target, '[data-tl-reset]')) {
      st.cultures = CULTURES.slice();
      st.kinds = KINDS.slice();
      st.focus = '';
      syncURL();
      paint();
      return;
    }
    var viewBtn = closest(target, '[data-tl-view]');
    if (viewBtn) {
      var view = viewBtn.getAttribute('data-tl-view');
      if ((view === 'chart' || view === 'list') && st.view !== view) {
        st.view = view;
        paint();
      }
    }
  }
  function markerFrom(ev) { return closest(ev.target, '.tl-mark'); }
  function onPointerOver(ev) {
    var mark = markerFrom(ev);
    if (mark) showTip(mark);
  }
  function onPointerOut(ev) {
    var mark = markerFrom(ev);
    if (!mark) return;
    var to = ev.relatedTarget;
    if (to && to.nodeType === 1 && mark.contains(to)) return;
    hideTip();
  }
  function onFocusIn(ev) {
    var mark = markerFrom(ev);
    if (mark) showTip(mark);
  }
  function onFocusOut(ev) {
    var mark = markerFrom(ev);
    if (mark) hideTip();
  }
  function onKeyDown(ev) {
    if (ev.key === 'Escape') hideTip();
  }
  function applyFocus(focusId) {
    if (!ctx) return;
    var root = ctx.root;
    var entry = JR.byId(focusId);
    var marker = null;
    eachNode(root.querySelectorAll('.tl-mark'), function (el) {
      if (!marker && el.getAttribute('data-entry-id') === focusId) marker = el;
    });
    if (!marker) {
      if (entry) JR.toast('「' + str(entry.title) + '」不在当前时间尺度或筛选范围内');
      return;
    }
    try { marker.scrollIntoView({ block: 'center', inline: 'nearest' }); }
    catch (err) { try { marker.scrollIntoView(); } catch (err2) {} }
    var scroll = root.querySelector('.tl-scroll');
    if (scroll) {
      try {
        var mr = marker.getBoundingClientRect();
        var sr = scroll.getBoundingClientRect();
        scroll.scrollLeft += (mr.left - sr.left) - (sr.width - mr.width) / 2;
      } catch (err3) {}
    }
    marker.classList.add('is-focus');
    if (!reduceMotion()) {
      marker.classList.add('tl-pulse');
      ctx.pulseTimer = setTimeout(function () {
        if (marker && marker.classList) marker.classList.remove('tl-pulse');
        ctx.pulseTimer = null;
      }, 1600);
    }
  }

  /* ------------------------------------------------------------ 页面注册 */
  JR.page('timeline', {
    title: '时间轴',
    render: function (params) { return renderPage(params || {}); },
    mount: function (root, params) {
      var st = normalize(params || {});
      var refs = {
        chart: root.querySelector('[data-tl-chart]'),
        list: root.querySelector('[data-tl-list]'),
        empty: root.querySelector('[data-tl-empty]'),
        count: root.querySelector('[data-tl-count]'),
        reset: root.querySelector('.tl-reset')
      };
      if (!refs.chart || !refs.count) return;
      ctx = { root: root, state: st, refs: refs, narrow: isNarrow(), tip: null, pulseTimer: null, cleanups: [] };
      function bind(el, type, fn) {
        el.addEventListener(type, fn);
        ctx.cleanups.push(function () { el.removeEventListener(type, fn); });
      }
      createTip();
      bind(root, 'click', onClick);
      bind(root, 'mouseover', onPointerOver);
      bind(root, 'mouseout', onPointerOut);
      bind(root, 'focusin', onFocusIn);
      bind(root, 'focusout', onFocusOut);
      bind(root, 'keydown', onKeyDown);
      if (typeof global.addEventListener === 'function') {
        var onViewport = function () { hideTip(); };
        global.addEventListener('scroll', onViewport, true);
        global.addEventListener('resize', onViewport);
        ctx.cleanups.push(function () {
          global.removeEventListener('scroll', onViewport, true);
          global.removeEventListener('resize', onViewport);
        });
      }
      if (st.focus) {
        applyFocus(st.focus);
        st.focus = '';
      } else if (ctx.narrow) {
        st.view = 'list';
        paint();
      }
    },
    unmount: function () {
      if (!ctx) return;
      if (ctx.pulseTimer) clearTimeout(ctx.pulseTimer);
      var cleanups = ctx.cleanups || [];
      for (var i = 0; i < cleanups.length; i++) {
        try { cleanups[i](); } catch (err) {}
      }
      ctx = null;
    }
  });
})(typeof window !== 'undefined' ? window : this);
