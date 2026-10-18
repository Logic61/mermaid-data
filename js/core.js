/* ==========================================================================
   鲛人研究数据库 · 核心工具层
   依赖：data/schema.js（JR_SCHEMA, JR_DATA）
   暴露：window.JR
   约定：所有页面脚本通过 JR.page() 注册；渲染函数返回 HTML 字符串。
   ========================================================================== */
(function (global) {
  'use strict';

  var S = global.JR_SCHEMA || {};

  var JR = {
    schema: S,
    pages: {},
    entries: [],
    byIdMap: {},
    compareMax: 4
  };

  /* ---------------------------------------------------------------- 转义 */
  var ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  JR.esc = function (v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/[&<>"']/g, function (c) { return ESC_MAP[c]; });
  };
  JR.escAttr = JR.esc;

  /* ---------------------------------------------------------------- 年份 */
  JR.fmtYear = function (y, note) {
    if (typeof y !== 'number' || !isFinite(y)) return '';
    var base;
    if (y < 0) base = '公元前' + Math.abs(y) + '年';
    else if (y === 0) base = '公元 1 年';
    else base = '公元 ' + y + ' 年';
    return (note ? note : '') + base;
  };
  JR.yearShort = function (y) {
    if (typeof y !== 'number' || !isFinite(y)) return '';
    if (y < 0) return '前' + Math.abs(y);
    return String(y);
  };
  JR.fmtRange = function (a, b) {
    if (typeof a !== 'number') return '';
    if (typeof b !== 'number' || a === b) return JR.fmtYear(a);
    return JR.yearShort(a) + ' 至 ' + JR.fmtYear(b);
  };
  /* 世纪区间：返回 [start, end] */
  JR.centuryRange = function (century) {
    var c = Math.round(century);
    if (c <= 0) return [-c * 100, -c * 100 + 99];
    return [(c - 1) * 100, c * 100 - 1];
  };

  /* ---------------------------------------------------------------- 查表 */
  JR.byId = function (id) { return JR.byIdMap[id] || null; };
  JR.trait = function (id) { return (S.traitById && S.traitById[id]) || null; };
  JR.traitLabel = function (id) {
    var t = JR.trait(id);
    return t ? t.label : id;
  };
  JR.traitDesc = function (id) {
    var t = JR.trait(id);
    return t ? t.desc : '';
  };
  JR.traitGroup = function (id) {
    var t = JR.trait(id);
    return t ? t.group : '';
  };
  JR.narrativeLabel = function (id) {
    var found = null;
    (S.narratives || []).some(function (n) { if (n.id === id) { found = n; return true; } return false; });
    return found ? found.label : id;
  };
  JR.kindLabel = function (id) { return (S.kindById && S.kindById[id]) || id; };
  JR.cultureClass = function (c) {
    return { '中国': 'is-cn', '西方': 'is-west', '东亚': 'is-east', '跨文化': 'is-cross' }[c] || 'is-other';
  };
  JR.kindClass = function (k) { return 'is-' + (k || 'other'); };

  /* ---------------------------------------------------------------- 数据装配 */
  JR.installEntries = function (list) {
    var seen = {};
    var problems = [];
    var clean = [];
    (list || []).forEach(function (e) {
      if (!e || typeof e !== 'object') return;
      if (!e.id) { problems.push('条目缺少 id'); return; }
      if (seen[e.id]) { problems.push('重复 id: ' + e.id); return; }
      if (!e.title) { problems.push(e.id + ' 缺少 title'); return; }
      seen[e.id] = true;
      /* 归一化可选字段 */
      e.kind = e.kind || 'ancient';
      e.subtype = e.subtype || '';
      e.work = e.work || e.title;
      e.creator = e.creator || '';
      e.eraLabel = e.eraLabel || '';
      e.year = typeof e.year === 'number' && isFinite(e.year) ? e.year : null;
      e.yearNote = e.yearNote || '';
      e.dateDisplay = (e.dateDisplay || (e.year !== null ? JR.fmtYear(e.year, e.yearNote) : (e.eraLabel || '年代待考')))
        .replace(/\u2014/g, '至');
      e.culture = e.culture || '跨文化';
      e.region = e.region || '';
      e.medium = e.medium || '';
      e.term = e.term || { primary: e.title, variants: [], original: '', note: '' };
      e.term.variants = Array.isArray(e.term.variants) ? e.term.variants : [];
      e.traits = Array.isArray(e.traits) ? e.traits.filter(function (t) { return !!JR.trait(t); }) : [];
      e.narratives = Array.isArray(e.narratives) ? e.narratives.filter(function (n) { return !!JR.trait(n); }) : [];
      e.tags = Array.isArray(e.tags) ? e.tags : [];
      e.sources = Array.isArray(e.sources) ? e.sources : [];
      e.related = Array.isArray(e.related) ? e.related : [];
      e.excerpt = e.excerpt || '';
      e.excerptSource = e.excerptSource || '';
      e.translation = e.translation || '';
      e.summary = e.summary || '';
      e.significance = e.significance || '';
      e.confidence = e.confidence || '待核';
      clean.push(e);
    });
    clean.sort(function (a, b) {
      var ya = a.year === null ? 9999 : a.year;
      var yb = b.year === null ? 9999 : b.year;
      if (ya !== yb) return ya - yb;
      return String(a.title).localeCompare(String(b.title), 'zh-Hans-CN');
    });
    JR.entries = clean;
    JR.byIdMap = {};
    clean.forEach(function (e) { JR.byIdMap[e.id] = e; });
    JR.problems = problems;
    if (problems.length && global.console) console.warn('[JR] 数据问题：', problems);
    return clean;
  };

  JR.entriesBy = function (kind) {
    return JR.entries.filter(function (e) { return e.kind === kind; });
  };
  JR.relatedOf = function (entry) {
    return (entry && entry.related || []).map(JR.byId).filter(Boolean);
  };
  JR.entriesWithTrait = function (id) {
    return JR.entries.filter(function (e) { return e.traits.indexOf(id) >= 0 || e.narratives.indexOf(id) >= 0; });
  };
  JR.yearOf = function (e) { return e.year === null ? null : e.year; };
  JR.sortByYear = function (list) {
    return list.slice().sort(function (a, b) {
      var ya = a.year === null ? 9999 : a.year;
      var yb = b.year === null ? 9999 : b.year;
      return ya - yb;
    });
  };

  /* ---------------------------------------------------------------- 通用工具 */
  JR.unique = function (arr) {
    var out = [];
    arr.forEach(function (v) { if (v !== '' && v !== null && v !== undefined && out.indexOf(v) < 0) out.push(v); });
    return out;
  };
  JR.debounce = function (fn, ms) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms || 200);
    };
  };
  JR.param = function (value) { return encodeURIComponent(value == null ? '' : String(value)); };

  /* hash 路由参数解析 */
  JR.parseHash = function (hash) {
    var h = (hash || global.location.hash || '#/').replace(/^#/, '');
    if (!h) h = '/';
    var qi = h.indexOf('?');
    var path = (qi >= 0 ? h.slice(0, qi) : h).replace(/^\/?/, '');
    var qs = qi >= 0 ? h.slice(qi + 1) : '';
    var params = {};
    if (qs) {
      qs.split('&').forEach(function (pair) {
        if (!pair) return;
        var i = pair.indexOf('=');
        var k = i >= 0 ? pair.slice(0, i) : pair;
        var v = i >= 0 ? pair.slice(i + 1) : '';
        try { params[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' ')); }
        catch (err) { params[k] = v; }
      });
    }
    return { path: path, params: params };
  };
  JR.getQuery = function () { return JR.parseHash().params; };
  JR.buildHash = function (path, params) {
    var qs = [];
    Object.keys(params || {}).forEach(function (k) {
      var v = params[k];
      if (v === '' || v === null || v === undefined) return;
      if (Array.isArray(v)) v = v.join(',');
      qs.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(v)));
    });
    return '#/' + String(path || '').replace(/^\/+/, '') + (qs.length ? '?' + qs.join('&') : '');
  };
  JR.go = function (path, params) {
    var hash = path.indexOf('#') === 0 ? path : JR.buildHash(path, params);
    if (global.location.hash === hash) {
      try { global.dispatchEvent(new HashChangeEvent('hashchange')); } catch (err) { global.dispatchEvent(new Event('hashchange')); }
      return;
    }
    global.location.hash = hash;
  };
  JR.replaceQuery = function (patch, path) {
    var cur = JR.parseHash();
    var params = Object.assign({}, cur.params, patch || {});
    Object.keys(params).forEach(function (k) {
      if (params[k] === '' || params[k] === null || params[k] === undefined) delete params[k];
      else if (Array.isArray(params[k]) && !params[k].length) delete params[k];
    });
    var hash = JR.buildHash(path || cur.path, params);
    try {
      if (history && history.replaceState) history.replaceState(null, '', hash);
      else global.location.hash = hash;
    } catch (err) {
      /* file:// 下部分浏览器禁止 history.replaceState：保留内存中的筛选状态即可 */
    }
  };

  /* ---------------------------------------------------------------- 比较台状态 */
  var CMP_KEY = 'jr-compare-v1';
  function readCompare() {
    try {
      var raw = global.localStorage.getItem(CMP_KEY);
      if (!raw) return [];
      var list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return list.filter(function (id) { return !!JR.byId(id); }).slice(0, JR.compareMax);
    } catch (err) { return []; }
  }
  function writeCompare(list) {
    list = JR.unique(list).filter(function (id) { return !!JR.byId(id); }).slice(0, JR.compareMax);
    try { global.localStorage.setItem(CMP_KEY, JSON.stringify(list)); } catch (err) {}
    global.dispatchEvent(new CustomEvent('jr:compare', { detail: { ids: list } }));
    return list;
  }
  JR.compare = {
    get: function () { return readCompare(); },
    set: function (ids) { return writeCompare(ids || []); },
    add: function (id) {
      var list = readCompare();
      if (list.indexOf(id) < 0) list.push(id);
      return writeCompare(list);
    },
    remove: function (id) {
      return writeCompare(readCompare().filter(function (x) { return x !== id; }));
    },
    toggle: function (id) {
      var list = readCompare();
      if (list.indexOf(id) >= 0) list = list.filter(function (x) { return x !== id; });
      else list.push(id);
      return writeCompare(list);
    },
    clear: function () { return writeCompare([]); },
    has: function (id) { return readCompare().indexOf(id) >= 0; },
    isFull: function () { return readCompare().length >= JR.compareMax; }
  };

  /* ---------------------------------------------------------------- 图标（项目内置，线性 1.5px） */
  var ICONS = {
    arrow: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    back: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M17 10H4M9 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    search: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13.2 13.2 17 17" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    close: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4l12 12M16 4 4 16" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    plus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14M3 10h14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    check: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m3 11 4.5 4.5L17 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    filter: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4h14L11 11v5l-2 1v-6L3 4Z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    download: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v9M6 8l4 4 4-4M3 16h14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    print: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 7V3h8v4M4 7h12v8h-2M6 12h8v5H6z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    timeline: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h14M6 6v8M11 6v8M15 6v8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    compare: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3v14M16 3v14M7 6h6M7 10h6M7 14h6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    external: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 3h6v6M17 3l-8 8M15 12v5H3V5h5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    menu: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    grid: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    list: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
  };
  JR.icon = function (name) { return ICONS[name] || ''; };

  /* ---------------------------------------------------------------- 图版（SVG，由 js/figures.js 注册） */
  JR.figure = function (name, cls) {
    if (!name || !global.JR_FIGURES || !global.JR_FIGURES[name]) return '';
    return '<span class="figure ' + (cls || '') + '">' + global.JR_FIGURES[name] + '</span>';
  };

  /* ---------------------------------------------------------------- 页面注册 */
  JR.page = function (name, def) {
    if (!name || !def || typeof def.render !== 'function') {
      if (global.console) console.error('[JR] 页面注册失败：', name);
      return;
    }
    JR.pages[name] = def;
  };
  JR.currentPage = null;

  /* ---------------------------------------------------------------- 下载 */
  JR.download = function (filename, content, mime) {
    try {
      var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (err) {
      if (global.console) console.warn('[JR] 下载失败', err);
    }
  };
  JR.toCsv = function (rows, columns) {
    function cell(v) {
      var s = v === null || v === undefined ? '' : String(v);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    }
    var lines = [columns.map(function (c) { return cell(c.label); }).join(',')];
    rows.forEach(function (row) {
      lines.push(columns.map(function (c) { return cell(c.value(row)); }).join(','));
    });
    return '\ufeff' + lines.join('\r\n');
  };

  /* ---------------------------------------------------------------- 轻提示 */
  JR.toast = function (message, ms) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.classList.remove('is-visible'); }, ms || 2200);
  };

  /* ---------------------------------------------------------------- 杂项 */
  JR.escapeRegex = function (s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  JR.highlight = function (text, query) {
    var safe = JR.esc(text);
    var q = (query || '').trim();
    if (!q || q.length > 40) return safe;
    var re = new RegExp('(' + JR.escapeRegex(JR.esc(q)) + ')', 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  };
  JR.scrollTop = function () {
    try { global.scrollTo({ top: 0, behavior: 'instant' }); } catch (err) { global.scrollTo(0, 0); }
  };
  JR.isReducedMotion = function () {
    return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  global.JR = JR;
})(window);
