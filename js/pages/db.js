/* ==========================================================================
   鲛人研究数据库 · 资料库（检索）
   依赖：data/schema.js、js/core.js（JR.*），本文件在 app.js 之前加载并注册页面。
   契约：render 只返回 HTML 字符串，不得访问 document；事件绑定与 DOM 更新在 mount。
   页面私有样式前缀：.db-（见 css/pages-db.css）
   ========================================================================== */
(function (global) {
  'use strict';

  var JR = global.JR;
  var S = JR.schema || {};
  var MAX_CMP = JR.compareMax || 4;

  /* ---------------------------------------------------------------- 常量 */
  var ERAS = [
    { id: 'pre-han', label: '先秦两汉', min: -4000, max: 220, range: '先秦至公元 220 年' },
    { id: 'wei-jin', label: '魏晋南北朝', min: 220, max: 589, range: '公元 220 至 589 年' },
    { id: 'sui-tang', label: '隋唐五代', min: 589, max: 979, range: '公元 589 至 979 年' },
    { id: 'song-yuan', label: '宋元', min: 979, max: 1368, range: '公元 979 至 1368 年' },
    { id: 'ming-qing', label: '明清', min: 1368, max: 1840, range: '公元 1368 至 1840 年' },
    { id: 'modern', label: '近现代', min: 1840, max: 1949, range: '公元 1840 至 1949 年' },
    { id: 'contemporary', label: '现当代', min: 1949, max: 2200, range: '公元 1949 年至今' }
  ];
  var ERA_IDS = ERAS.map(function (e) { return e.id; });
  var ERA_BY_ID = {};
  ERAS.forEach(function (e) { ERA_BY_ID[e.id] = e; });

  var SORTS = [
    { id: 'year-asc', label: '年代早到晚' },
    { id: 'year-desc', label: '年代晚到早' },
    { id: 'title-asc', label: '题名 A 到 Z' },
    { id: 'kind', label: '类型分组' }
  ];
  var SORT_IDS = SORTS.map(function (s) { return s.id; });
  var DEFAULT_SORT = 'year-asc';

  var KIND_IDS = (S.kinds || []).map(function (k) { return k.id; });
  var CULTURE_IDS = (S.cultures || []).map(function (c) { return c.id; });
  var MEDIUM_IDS = (S.mediums || []).map(function (m) { return m.id; });
  var FACETS = ['kind', 'culture', 'era', 'medium', 'traits', 'narratives'];

  var SHAPE_TRAITS = (S.traits || []).filter(function (t) { return t.group === '形态'; });
  var ABILITY_TRAITS = (S.traits || []).filter(function (t) { return t.group === '能力'; });
  var NARRATIVE_TRAITS = (S.traits || []).filter(function (t) { return t.group === '叙事'; });
  var FEATURE_IDS = SHAPE_TRAITS.concat(ABILITY_TRAITS).map(function (t) { return t.id; });
  var NARRATIVE_IDS = NARRATIVE_TRAITS.map(function (t) { return t.id; });

  var EXPORT_COLUMNS = [
    { label: '题名', value: function (e) { return e.title; } },
    { label: '类型', value: function (e) { return JR.kindLabel(e.kind); } },
    { label: '谱系', value: function (e) { return e.culture || ''; } },
    { label: '年代', value: function (e) { return e.dateDisplay || e.eraLabel || ''; } },
    { label: '年份', value: function (e) { return e.year === null ? '' : e.year; } },
    { label: '作品', value: function (e) { return e.work || ''; } },
    { label: '作者', value: function (e) { return e.creator || ''; } },
    { label: '地区', value: function (e) { return e.region || ''; } },
    { label: '媒介', value: function (e) { return e.medium || ''; } },
    { label: '通名', value: function (e) { return e.term.primary || ''; } },
    { label: '异名', value: function (e) { return (e.term.variants || []).join('、'); } },
    { label: '原文', value: function (e) { return e.term.original || ''; } },
    { label: '形象与能力特征', value: function (e) { return (e.traits || []).map(JR.traitLabel).join('；'); } },
    { label: '叙事功能', value: function (e) { return (e.narratives || []).map(JR.narrativeLabel).join('；'); } },
    { label: '标签', value: function (e) { return (e.tags || []).join('、'); } },
    { label: '置信度', value: function (e) { return e.confidence || ''; } },
    { label: '引文', value: function (e) { return e.excerpt || ''; } },
    { label: '摘要', value: function (e) { return e.summary || ''; } }
  ];

  /* ---------------------------------------------------------------- 小工具 */
  function csv(value) {
    if (value === null || value === undefined || value === '') return [];
    return String(value).split(',').map(function (v) { return v.trim(); }).filter(function (v) { return !!v; });
  }
  function unique(list) {
    var out = [];
    list.forEach(function (v) { if (out.indexOf(v) < 0) out.push(v); });
    return out;
  }
  function onlyKnown(list, allowed) {
    return unique(list).filter(function (v) { return allowed.indexOf(v) >= 0; });
  }
  function pad3(n) {
    var s = String(n);
    while (s.length < 3) s = '0' + s;
    return s;
  }
  function listOf(v) { return Array.isArray(v) ? v : []; }
  function termOf(e) {
    return (e && e.term && typeof e.term === 'object')
      ? e.term
      : { primary: '', variants: [], original: '', note: '' };
  }
  function yearOf(e) {
    return (e && typeof e.year === 'number' && isFinite(e.year)) ? e.year : null;
  }
  function hasId(e, id) {
    return listOf(e.traits).indexOf(id) >= 0 || listOf(e.narratives).indexOf(id) >= 0;
  }

  function cloneState(st) {
    return {
      q: st.q,
      kind: st.kind.slice(),
      culture: st.culture.slice(),
      era: st.era.slice(),
      medium: st.medium.slice(),
      traits: st.traits.slice(),
      narratives: st.narratives.slice(),
      sort: st.sort
    };
  }

  function readState(params) {
    var p = params || {};
    return {
      q: typeof p.q === 'string' ? p.q.trim().slice(0, 80) : '',
      kind: onlyKnown(csv(p.kind), KIND_IDS),
      culture: onlyKnown(csv(p.culture), CULTURE_IDS),
      era: onlyKnown(csv(p.era), ERA_IDS),
      medium: onlyKnown(csv(p.medium), MEDIUM_IDS),
      traits: onlyKnown(csv(p.traits), FEATURE_IDS),
      narratives: onlyKnown(csv(p.narratives), NARRATIVE_IDS),
      sort: SORT_IDS.indexOf(p.sort) >= 0 ? p.sort : DEFAULT_SORT
    };
  }

  function serializeState(st) {
    /* 所有键都显式给出，空值交给 JR.replaceQuery 删除，避免旧参数残留 */
    return {
      q: st.q || '',
      kind: st.kind.length ? st.kind.join(',') : '',
      culture: st.culture.length ? st.culture.join(',') : '',
      era: st.era.length ? st.era.join(',') : '',
      medium: st.medium.length ? st.medium.join(',') : '',
      traits: st.traits.length ? st.traits.join(',') : '',
      narratives: st.narratives.length ? st.narratives.join(',') : '',
      sort: st.sort !== DEFAULT_SORT ? st.sort : ''
    };
  }

  function activeFilterCount(st) {
    var n = st.q ? 1 : 0;
    FACETS.forEach(function (key) { if (st[key].length) n += 1; });
    return n;
  }

  /* ---------------------------------------------------------------- 检索 */
  function searchText(e) {
    var term = termOf(e);
    return [
      e.title || '',
      e.work || '',
      term.primary || '',
      listOf(term.variants).join(' '),
      term.original || '',
      e.summary || '',
      listOf(e.tags).join(' '),
      e.excerpt || ''
    ].join(' ').toLowerCase();
  }

  function entryMatches(e, st) {
    if (st.kind.length && st.kind.indexOf(e.kind) < 0) return false;
    if (st.culture.length && st.culture.indexOf(e.culture) < 0) return false;
    if (st.medium.length && st.medium.indexOf(e.medium) < 0) return false;
    if (st.era.length) {
      var y = yearOf(e);
      if (y === null) return false;
      var hit = st.era.some(function (id) {
        var era = ERA_BY_ID[id];
        return era ? (y >= era.min && y < era.max) : false;
      });
      if (!hit) return false;
    }
    var i;
    for (i = 0; i < st.traits.length; i += 1) {
      if (!hasId(e, st.traits[i])) return false;
    }
    for (i = 0; i < st.narratives.length; i += 1) {
      if (!hasId(e, st.narratives[i])) return false;
    }
    if (st.q && searchText(e).indexOf(st.q.toLowerCase()) < 0) return false;
    return true;
  }

  function filterEntries(st) {
    return JR.entries.filter(function (e) { return entryMatches(e, st); });
  }

  function countFor(facet, value, st) {
    var st2 = cloneState(st);
    if (facet === 'traits' || facet === 'narratives') {
      if (st2[facet].indexOf(value) < 0) st2[facet] = st2[facet].concat([value]);
    } else {
      st2[facet] = [value];
    }
    return filterEntries(st2).length;
  }

  function compareTitle(a, b) {
    return String(a.title || '').localeCompare(String(b.title || ''), 'zh-Hans-CN');
  }

  function sortList(list, sortId) {
    var arr = list.slice();
    if (sortId === 'year-desc') {
      arr.sort(function (a, b) {
        var ya = yearOf(a); var yb = yearOf(b);
        if (ya === null) ya = -Infinity;
        if (yb === null) yb = -Infinity;
        if (ya !== yb) return yb - ya;
        return compareTitle(a, b);
      });
    } else if (sortId === 'title-asc') {
      arr.sort(compareTitle);
    } else if (sortId === 'kind') {
      var kindOrder = {};
      KIND_IDS.forEach(function (id, i) { kindOrder[id] = i; });
      arr.sort(function (a, b) {
        var ka = kindOrder[a.kind]; var kb = kindOrder[b.kind];
        if (ka === undefined) ka = 99;
        if (kb === undefined) kb = 99;
        if (ka !== kb) return ka - kb;
        return compareTitle(a, b);
      });
    } else {
      arr.sort(function (a, b) {
        var ya = yearOf(a); var yb = yearOf(b);
        if (ya === null) ya = Infinity;
        if (yb === null) yb = Infinity;
        if (ya !== yb) return ya - yb;
        return compareTitle(a, b);
      });
    }
    return arr;
  }

  function currentList(st) {
    return sortList(filterEntries(st), st.sort);
  }

  /* ---------------------------------------------------------------- 渲染：页头 */
  function statsHtml() {
    var total = JR.entries.length;
    var years = [];
    var kindCount = {};
    KIND_IDS.forEach(function (id) { kindCount[id] = 0; });
    JR.entries.forEach(function (e) {
      var y = yearOf(e);
      if (y !== null) years.push(y);
      if (kindCount[e.kind] === undefined) kindCount[e.kind] = 0;
      kindCount[e.kind] += 1;
    });
    var span = '暂无';
    if (years.length) {
      var min = Math.min.apply(null, years);
      var max = Math.max.apply(null, years);
      span = JR.fmtRange(min, max);
    }
    var kindBits = (S.kinds || []).map(function (k) {
      return JR.esc(k.label) + ' ' + (kindCount[k.id] || 0);
    }).join(' · ');
    return '<dl class="db-stats" aria-label="数据概览">' +
      '<div class="db-stats__item"><dt>条目</dt><dd><strong class="num">' + total + '</strong> 条</dd></div>' +
      '<div class="db-stats__item"><dt>类型</dt><dd><strong class="num">' + (S.kinds || []).length + '</strong> 类' +
      '<span class="db-stats__sub">' + kindBits + '</span></dd></div>' +
      '<div class="db-stats__item"><dt>年代跨度</dt><dd class="mono db-stats__span">' + JR.esc(span) + '</dd></div>' +
      '</dl>';
  }

  function pageHeadHtml() {
    return '<header class="db-head">' +
      '<p class="kicker">检索</p>' +
      '<div class="db-head__row">' +
      '<div class="db-head__text">' +
      '<h1 class="display display--sm">资料库</h1>' +
      '<p class="lede db-head__lede">按年代、谱系、媒介与形象编码检索鲛人、美人鱼与塞壬条目，筛选结果可导出为 CSV，也可选入比较台并置对照。' +
      '所有条目均标注出处与置信度，供研究核对，不作定本。</p>' +
      '</div>' +
      statsHtml() +
      '</div>' +
      '</header>';
  }

  /* ---------------------------------------------------------------- 渲染：筛选栏 */
  function chipHtml(facet, id, label, title, st) {
    var on = st[facet].indexOf(id) >= 0;
    var count = countFor(facet, id, st);
    return '<button type="button" class="chip db-chip' + (on ? ' is-on' : '') + '"' +
      ' data-facet="' + JR.escAttr(facet) + '" data-value="' + JR.escAttr(id) + '"' +
      ' aria-pressed="' + (on ? 'true' : 'false') + '"' +
      (title ? ' title="' + JR.escAttr(title) + '"' : '') + '>' +
      '<span class="db-chip__label">' + JR.esc(label) + '</span>' +
      '<span class="chip__count" data-chip-count>' + count + '</span>' +
      '</button>';
  }

  function facetHtml(title, hint, inner) {
    return '<section class="db-facet">' +
      '<h2 class="db-facet__title">' + JR.esc(title) + '</h2>' +
      (hint ? '<p class="db-facet__hint">' + hint + '</p>' : '') +
      inner +
      '</section>';
  }

  function chipListHtml(items, facet, st, withDesc) {
    return '<div class="chip-list db-chip-list">' + items.map(function (item) {
      return chipHtml(facet, item.id, item.label, withDesc ? item.desc : '', st);
    }).join('') + '</div>';
  }

  function sideHtml(st) {
    var kinds = (S.kinds || []).map(function (k) { return { id: k.id, label: k.label }; });
    var cultures = (S.cultures || []).map(function (c) { return { id: c.id, label: c.label }; });
    var mediums = (S.mediums || []).map(function (m) { return { id: m.id, label: m.label }; });
    var eras = ERAS.map(function (e) { return { id: e.id, label: e.label, desc: e.range }; });

    var search =
      '<section class="db-facet db-facet--search">' +
      '<h2 class="db-facet__title">关键词</h2>' +
      '<label class="field-label db-facet__label" for="db-q">在题名、作品、异名、摘要、标签与引文中检索</label>' +
      '<div class="search">' + JR.icon('search') +
      '<input class="input" id="db-q" type="search" data-db-q autocomplete="off" placeholder="例如：鲛人、泣珠、安徒生" value="' + JR.escAttr(st.q) + '">' +
      '</div>' +
      '</section>';

    var eraChips = chipListHtml(eras, 'era', st, true);

    return '<aside class="db-side" id="db-filters" data-db-side aria-label="检索筛选">' +
      '<div class="db-side__head">' +
      '<p class="kicker">筛选条件</p>' +
      '<div class="db-side__head-actions">' +
      '<button type="button" class="btn btn--sm btn--ghost db-side__clear" data-db-reset>清除全部</button>' +
      '<button type="button" class="btn btn--sm btn--ghost db-side__close" data-db-close aria-label="收起筛选">' + JR.icon('close') + '</button>' +
      '</div>' +
      '</div>' +
      search +
      facetHtml('类型', '可多选，符合任一类型即计入结果。', chipListHtml(kinds, 'kind', st, false)) +
      facetHtml('谱系', '可多选，符合任一谱系即计入结果。', chipListHtml(cultures, 'culture', st, false)) +
      facetHtml('年代', '可多选，按条目年份归档。近现代取 1840 至 1949 年，现当代自 1949 年起；未编年条目仅在未选年代时显示。', eraChips) +
      facetHtml('媒介', '可多选，符合任一媒介即计入结果。', chipListHtml(mediums, 'medium', st, false)) +
      facetHtml('形象特征', '可多选，条目须同时具备所选特征。',
        '<div class="db-facet__sub"><p class="db-facet__subtitle">形态</p>' + chipListHtml(SHAPE_TRAITS, 'traits', st, true) + '</div>' +
        '<div class="db-facet__sub"><p class="db-facet__subtitle">能力与行为</p>' + chipListHtml(ABILITY_TRAITS, 'traits', st, true) + '</div>') +
      facetHtml('叙事功能', '可多选，条目须同时具备所选叙事功能。', chipListHtml(NARRATIVE_TRAITS, 'narratives', st, true)) +
      '<p class="db-side__note">特征计数为「在当前其他条件下再叠加该特征」后的命中条目数。</p>' +
      '</aside>';
  }

  /* ---------------------------------------------------------------- 渲染：结果 */
  function compareButtonHtml(e, cmpOn) {
    return '<button type="button" class="btn btn--sm btn--ghost db-cmp-btn' + (cmpOn ? ' is-on' : '') + '"' +
      ' data-compare-toggle="' + JR.escAttr(e.id) + '"' +
      ' data-compare-title="' + JR.escAttr(e.title) + '"' +
      ' aria-pressed="' + (cmpOn ? 'true' : 'false') + '"' +
      ' aria-label="' + JR.escAttr((cmpOn ? '移出比较：' : '加入比较：') + e.title) + '">' +
      '<span data-compare-label>' + (cmpOn ? '已选' : '加入比较') + '</span>' +
      '</button>';
  }

  function rowTags(e) {
    var tags = [];
    listOf(e.traits).forEach(function (id) {
      if (tags.length >= 4) return;
      tags.push(JR.traitLabel(id));
    });
    listOf(e.narratives).forEach(function (id) {
      if (tags.length >= 4) return;
      tags.push(JR.narrativeLabel(id));
    });
    if (tags.length < 2) {
      listOf(e.tags).forEach(function (t) {
        if (tags.length >= 4) return;
        tags.push(t);
      });
    }
    return tags.slice(0, 4);
  }

  function rowNameHtml(e) {
    var term = termOf(e);
    var bits = [];
    if (term.primary) bits.push('<span class="db-row__name-main serif">' + JR.esc(term.primary) + '</span>');
    var variants = listOf(term.variants);
    if (variants.length) bits.push('<span class="db-row__name-alt">异名 ' + JR.esc(variants.join('、')) + '</span>');
    if (term.original) bits.push('<span class="db-row__name-orig mono">' + JR.esc(term.original) + '</span>');
    if (!bits.length) bits.push('<span class="muted">名称待核</span>');
    return bits.join('');
  }

  function rowHtml(e, index, st, cmpIds) {
    var y = yearOf(e);
    var yearText = '待考';
    var yearTitle = e.dateDisplay || e.eraLabel || '年代待考';
    if (y !== null) {
      var note = String(e.yearNote || '');
      if (note.length > 4) note = '';
      yearText = note + JR.yearShort(y);
    }
    var nameHtml = rowNameHtml(e);
    var tags = rowTags(e);
    var quote = e.excerpt || '';
    var culture = e.culture || '';
    var cultureHtml = culture
      ? '<span class="culture db-row__culture"><span class="dot ' + JR.escAttr(JR.cultureClass(culture)) + '"></span>' + JR.esc(culture) + '</span>'
      : '';
    var cmpOn = cmpIds.indexOf(e.id) >= 0;

    return '<li class="db-row" data-id="' + JR.escAttr(e.id) + '">' +
      '<span class="db-row__no mono" title="结果序号" aria-hidden="true">' + pad3(index + 1) + '</span>' +
      '<span class="db-row__year mono" title="' + JR.escAttr(yearTitle) + '">' + JR.esc(yearText) + '</span>' +
      '<div class="db-row__main">' +
      '<div class="db-row__head">' +
      '<a class="db-row__title serif" href="#/entry/' + encodeURIComponent(e.id) + '">' + JR.highlight(e.title, st.q) + '</a>' +
      '<span class="db-row__kind meta">' + JR.esc(JR.kindLabel(e.kind)) + '</span>' +
      '</div>' +
      '<p class="db-row__work meta">' +
      (e.work ? JR.esc(e.work) : '<span class="muted">出处待考</span>') +
      (e.creator ? '<span class="db-row__sep">·</span>' + JR.esc(e.creator) : '') +
      (e.eraLabel ? '<span class="db-row__sep">·</span>' + JR.esc(e.eraLabel) : '') +
      '</p>' +
      '<p class="db-row__name">' + nameHtml + '</p>' +
      (tags.length ? '<div class="tag-list db-row__tags">' + tags.map(function (t) {
        return '<span class="tag tag--ghost">' + JR.esc(t) + '</span>';
      }).join('') + '</div>' : '') +
      (quote ? '<p class="db-row__quote">' + JR.highlight(quote, st.q) + '</p>' : '') +
      '</div>' +
      '<div class="db-row__aside">' +
      cultureHtml +
      compareButtonHtml(e, cmpOn) +
      '</div>' +
      '</li>';
  }

  function emptyResultHtml() {
    return '<div class="empty db-empty">' +
      '<p class="empty__title">没有符合当前条件的条目</p>' +
      '<p class="empty__text">可以减少筛选条件，或清除全部筛选后重新浏览资料库。</p>' +
      '<button type="button" class="btn btn--ghost" data-db-reset>清除全部筛选</button>' +
      '</div>';
  }

  function resultHtml(list, st, cmpIds) {
    if (!list.length) return emptyResultHtml();
    return '<h2 class="sr-only">检索结果</h2>' +
      '<ul class="db-list">' + list.map(function (e, i) {
        return rowHtml(e, i, st, cmpIds);
      }).join('') + '</ul>';
  }

  function countHtml(n) {
    return '共 <strong>' + n + '</strong> 条结果';
  }

  function toolbarHtml(listLength, st) {
    var active = activeFilterCount(st);
    return '<div class="toolbar db-toolbar">' +
      '<div class="db-toolbar__left">' +
      '<button type="button" class="btn btn--sm btn--ghost db-side-toggle" data-db-open aria-expanded="false" aria-controls="db-filters">' +
      JR.icon('filter') + '筛选' + (active ? '<span class="db-side-toggle__n">' + active + '</span>' : '') +
      '</button>' +
      '<p class="count db-count" role="status" aria-live="polite" data-db-count>' + countHtml(listLength) + '</p>' +
      '</div>' +
      '<div class="toolbar__group db-toolbar__group">' +
      '<label class="db-sort-label" for="db-sort">排序</label>' +
      '<select class="select db-sort" id="db-sort" data-db-sort>' +
      SORTS.map(function (s) {
        return '<option value="' + JR.escAttr(s.id) + '"' + (s.id === st.sort ? ' selected' : '') + '>' + JR.esc(s.label) + '</option>';
      }).join('') +
      '</select>' +
      '<button type="button" class="btn btn--sm btn--ghost db-export" data-db-export>' + JR.icon('download') + '导出 CSV</button>' +
      '</div>' +
      '</div>';
  }

  function scrimHtml() {
    return '<div class="db-scrim" data-db-scrim hidden></div>';
  }

  function cmpBarHtml(cmpIds) {
    var n = cmpIds.length;
    return '<div class="db-cmpbar" data-cmp-bar role="region" aria-label="比较台"' + (n ? '' : ' hidden') + '>' +
      '<div class="wrap db-cmpbar__inner">' +
      '<p class="db-cmpbar__label"><span data-cmp-label>已选 ' + n + ' / ' + MAX_CMP + ' 条</span>' +
      '<span class="db-cmpbar__hint">并置比较最多 ' + MAX_CMP + ' 条</span></p>' +
      '<div class="db-cmpbar__actions">' +
      '<a class="btn btn--solid btn--sm" href="#/compare">查看比较</a>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-cmp-clear>清空</button>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function emptyDataHtml() {
    return '<div class="empty db-empty db-empty--data">' +
      '<p class="empty__title">资料库尚无可检索的条目</p>' +
      '<p class="empty__text">条目正在整理与核对中。可先阅读研究说明，了解收录范围与编码方式，稍后重新载入本页。</p>' +
      '<a class="btn btn--ghost" href="#/about">阅读研究说明</a>' +
      '</div>';
  }

  /* ---------------------------------------------------------------- 页面定义 */
  var cleanupFns = [];

  JR.page('db', {
    title: '资料库',

    render: function (params) {
      var st = readState(params);
      var cmpIds = JR.compare.get();
      var head = '<section class="wrap section section--page db-page">' + pageHeadHtml();

      if (!JR.entries.length) {
        return head + emptyDataHtml() + '</section>';
      }

      var list = currentList(st);
      return head +
        '<div class="db-layout">' +
        sideHtml(st) +
        '<div class="db-main">' +
        toolbarHtml(list.length, st) +
        '<div class="db-result db-result--list" data-db-result>' + resultHtml(list, st, cmpIds) + '</div>' +
        '</div>' +
        '</div>' +
        scrimHtml() +
        cmpBarHtml(cmpIds) +
        '</section>';
    },

    mount: function (root, params) {
      var st = readState(params);
      cleanupFns = [];
      var drawerOpen = false;
      var qTimer = null;

      function on(target, type, fn) {
        if (!target) return;
        target.addEventListener(type, fn);
        cleanupFns.push(function () { target.removeEventListener(type, fn); });
      }

      function syncCompare() {
        var ids = JR.compare.get();
        var has = {};
        ids.forEach(function (id) { has[id] = true; });
        Array.prototype.forEach.call(root.querySelectorAll('[data-compare-toggle]'), function (btn) {
          var id = btn.getAttribute('data-compare-toggle');
          var label = btn.getAttribute('data-compare-title') || '';
          var isOn = !!has[id];
          btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
          btn.classList.toggle('is-on', isOn);
          var textEl = btn.querySelector('[data-compare-label]');
          if (textEl) textEl.textContent = isOn ? '已选' : '加入比较';
          btn.setAttribute('aria-label', (isOn ? '移出比较：' : '加入比较：') + label);
        });
        var bar = root.querySelector('[data-cmp-bar]');
        if (bar) {
          var n = ids.length;
          bar.hidden = n === 0;
          var countEl = bar.querySelector('[data-cmp-count]');
          if (countEl) countEl.textContent = String(n);
          var labelEl = bar.querySelector('[data-cmp-label]');
          if (labelEl) labelEl.textContent = '已选 ' + n + ' / ' + MAX_CMP + ' 条';
          if (global.document && global.document.body) {
            global.document.body.classList.toggle('db-has-cmpbar', n > 0);
          }
        }
      }

      function updateChipStates() {
        Array.prototype.forEach.call(root.querySelectorAll('[data-facet]'), function (btn) {
          var facet = btn.getAttribute('data-facet');
          var value = btn.getAttribute('data-value');
          if (FACETS.indexOf(facet) < 0) return;
          var isOn = st[facet].indexOf(value) >= 0;
          btn.classList.toggle('is-on', isOn);
          btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
          var countEl = btn.querySelector('[data-chip-count]');
          if (countEl) countEl.textContent = String(countFor(facet, value, st));
        });
      }

      function syncToggleBadge() {
        var toggle = root.querySelector('[data-db-open]');
        if (!toggle) return;
        var active = activeFilterCount(st);
        var badge = toggle.querySelector('.db-side-toggle__n');
        if (active) {
          if (!badge) {
            badge = global.document.createElement('span');
            badge.className = 'db-side-toggle__n';
            toggle.appendChild(badge);
          }
          badge.textContent = String(active);
        } else if (badge) {
          badge.parentNode.removeChild(badge);
        }
      }

      function syncAll() {
        var list = currentList(st);
        var resultEl = root.querySelector('[data-db-result]');
        if (resultEl) resultEl.innerHTML = resultHtml(list, st, JR.compare.get());
        var countEl = root.querySelector('[data-db-count]');
        if (countEl) countEl.innerHTML = countHtml(list.length);
        updateChipStates();
        syncToggleBadge();
        syncCompare();
        JR.replaceQuery(serializeState(st), 'db');
      }

      function resetAll() {
        st = readState({});
        var qInput = root.querySelector('[data-db-q]');
        if (qInput) qInput.value = '';
        var sortSel = root.querySelector('[data-db-sort]');
        if (sortSel) sortSel.value = DEFAULT_SORT;
        syncAll();
      }

      function setDrawer(open, silent) {
        var side = root.querySelector('[data-db-side]');
        var scrim = root.querySelector('[data-db-scrim]');
        var toggle = root.querySelector('[data-db-open]');
        if (!side) return;
        drawerOpen = !!open;
        side.classList.toggle('is-open', !!open);
        if (scrim) {
          scrim.hidden = !open;
          scrim.classList.toggle('is-open', !!open);
        }
        if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (global.document && global.document.body) {
          global.document.body.classList.toggle('db-drawer-open', !!open);
        }
        if (!open) {
          if (!silent && toggle && !toggle.hidden) {
            try { toggle.focus(); } catch (err) {}
          }
          return;
        }
        var first = side.querySelector('[data-db-q]') || side.querySelector('input, select, button');
        if (first) { try { first.focus(); } catch (err) {} }
      }

      function exportCsv() {
        var list = currentList(st);
        if (!list.length) {
          JR.toast('当前筛选没有结果，未导出');
          return;
        }
        JR.download('鲛人数据库_筛选结果.csv', JR.toCsv(list, EXPORT_COLUMNS), 'text/csv;charset=utf-8');
        JR.toast('已导出 ' + list.length + ' 条结果');
      }

      function handleCompareToggle(btn) {
        var id = btn.getAttribute('data-compare-toggle');
        if (!id) return;
        if (JR.compare.has(id)) {
          JR.compare.remove(id);
          JR.toast('已移出比较');
        } else if (JR.compare.isFull()) {
          JR.toast('比较台最多 ' + MAX_CMP + ' 条，请先在比较页移出一条');
        } else {
          var next = JR.compare.add(id);
          JR.toast('已加入比较，当前 ' + next.length + ' 条');
        }
      }

      function handleChipClick(btn) {
        var facet = btn.getAttribute('data-facet');
        var value = btn.getAttribute('data-value');
        if (FACETS.indexOf(facet) < 0) return;
        var list = st[facet].slice();
        var i = list.indexOf(value);
        if (i >= 0) list.splice(i, 1);
        else list.push(value);
        st[facet] = list;
        syncAll();
      }

      /* 关键词 */
      var qInput = root.querySelector('[data-db-q]');
      if (qInput) {
        on(qInput, 'input', function () {
          clearTimeout(qTimer);
          qTimer = setTimeout(function () {
            st.q = qInput.value.trim().slice(0, 80);
            syncAll();
          }, 180);
        });
        on(qInput, 'keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(qTimer);
            st.q = qInput.value.trim().slice(0, 80);
            syncAll();
          } else if (e.key === 'Escape') {
            qInput.value = '';
            st.q = '';
            syncAll();
          }
        });
      }

      /* 排序 */
      var sortSel = root.querySelector('[data-db-sort]');
      if (sortSel) {
        on(sortSel, 'change', function () {
          var v = sortSel.value;
          if (SORT_IDS.indexOf(v) >= 0) {
            st.sort = v;
            syncAll();
          }
        });
      }

      /* 点击委托：筛选片、比较、工具栏、行跳转、抽屉 */
      on(root, 'click', function (e) {
        var target = e.target;
        if (!target || !target.closest) return;

        var chip = target.closest('[data-facet]');
        if (chip) { handleChipClick(chip); return; }

        var cmpToggle = target.closest('[data-compare-toggle]');
        if (cmpToggle) { handleCompareToggle(cmpToggle); return; }

        var reset = target.closest('[data-db-reset]');
        if (reset) { resetAll(); return; }

        var exportBtn = target.closest('[data-db-export]');
        if (exportBtn) { exportCsv(); return; }

        var openBtn = target.closest('[data-db-open]');
        if (openBtn) { setDrawer(true); return; }

        var closeBtn = target.closest('[data-db-close]');
        if (closeBtn) { setDrawer(false); return; }

        var scrim = target.closest('[data-db-scrim]');
        if (scrim) { setDrawer(false); return; }

        var cmpClear = target.closest('[data-cmp-clear]');
        if (cmpClear) {
          JR.compare.clear();
          JR.toast('已清空比较台');
          return;
        }

        if (target.closest('a, button, input, select, label')) return;

        var row = target.closest('.db-row');
        if (row) {
          var id = row.getAttribute('data-id');
          if (id) global.location.hash = '#/entry/' + encodeURIComponent(id);
        }
      });

      /* 比较状态变化 */
      on(global, 'jr:compare', syncCompare);
      on(global, 'storage', function (e) {
        if (e && e.key === 'jr-compare-v1') syncCompare();
      });

      /* 抽屉键盘与视口 */
      on(global.document, 'keydown', function (e) {
        if (!drawerOpen) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          setDrawer(false);
          return;
        }
        if (e.key !== 'Tab') return;
        var side = root.querySelector('[data-db-side]');
        if (!side) return;
        var items = Array.prototype.filter.call(
          side.querySelectorAll('button, input, select, a[href]'),
          function (el) { return !el.disabled && el.type !== 'hidden'; }
        );
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        var active = global.document.activeElement;
        if (e.shiftKey && (active === first || !side.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !side.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      });
      on(global, 'resize', function () {
        if (drawerOpen && global.innerWidth >= 960) setDrawer(false, true);
      });

      cleanupFns.push(function () { clearTimeout(qTimer); });

      /* 初次同步：URL 已由路由提供，不重写；仅校正比较态与控件值 */
      syncCompare();
      if (qInput) qInput.value = st.q;
      if (sortSel) sortSel.value = st.sort;
    },

    unmount: function () {
      cleanupFns.forEach(function (fn) {
        try { fn(); } catch (err) {}
      });
      cleanupFns = [];
      if (global.document && global.document.body) {
        global.document.body.classList.remove('db-has-cmpbar');
        global.document.body.classList.remove('db-drawer-open');
      }
    }
  });
})(window);
