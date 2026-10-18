/* ==========================================================================
   鲛人研究数据库 · 并置比较
   依赖：data/schema.js、js/core.js（JR.*）。render 返回纯 HTML 字符串。
   页面私有样式前缀：.cmp-（见 css/pages-db.css）
   ========================================================================== */
(function (global) {
  'use strict';

  var JR = global.JR;
  var S = JR.schema || {};
  var MAX_CMP = JR.compareMax || 4;
  var GROUP_ORDER = ['形态', '能力', '叙事'];

  var ERAS = [
    { id: 'pre-han', label: '先秦两汉', min: -4000, max: 220 },
    { id: 'wei-jin', label: '魏晋南北朝', min: 220, max: 589 },
    { id: 'sui-tang', label: '隋唐五代', min: 589, max: 979 },
    { id: 'song-yuan', label: '宋元', min: 979, max: 1368 },
    { id: 'ming-qing', label: '明清', min: 1368, max: 1840 },
    { id: 'modern', label: '近现代', min: 1840, max: 1949 },
    { id: 'contemporary', label: '现当代', min: 1949, max: 2200 }
  ];

  var PRESETS = [
    {
      id: 'pearl-weave',
      label: '泣珠与织绡',
      desc: '按「泣珠」「织绡」两项能力检索，观察珠与绡的物产想象如何分布在古今中外。',
      ids: ['b_tears_pearl', 'b_weave_silk']
    },
    {
      id: 'siren-shift',
      label: '塞壬变形',
      desc: '从人首鸟身到鱼尾人形，比较塞壬形象在文本与图像传统中的形态迁移。',
      ids: ['m_bird_body', 'b_siren_song', 'm_fish_tail']
    },
    {
      id: 'love-sacrifice',
      label: '爱情与牺牲',
      desc: '跨类之爱以失声、化沫或死亡告终的叙事组。',
      ids: ['b_love_human', 'b_sacrifice_foam', 'f_love_sacrifice', 'b_voice_trade']
    },
    {
      id: 'ecology',
      label: '生态受难',
      desc: '作为环境破坏、污染与开发受害者的当代形象。',
      ids: ['b_ecology', 'f_ecology']
    }
  ];

  var GROUP_TRAITS = {};
  GROUP_ORDER.forEach(function (g) {
    GROUP_TRAITS[g] = (S.traits || []).filter(function (t) { return t.group === g; });
  });

  var cleanupFns = [];

  /* ---------------------------------------------------------------- 小工具 */
  function listOf(v) { return Array.isArray(v) ? v : []; }
  function termOf(e) {
    return (e && e.term && typeof e.term === 'object')
      ? e.term
      : { primary: '', variants: [], original: '', note: '' };
  }
  function yearOf(e) {
    return (e && typeof e.year === 'number' && isFinite(e.year)) ? e.year : null;
  }
  function yearText(e) {
    var y = yearOf(e);
    if (y === null) return '待考';
    var note = String(e.yearNote || '');
    if (note.length > 4) note = '';
    return note + JR.yearShort(y);
  }
  function pad2(n) {
    var s = String(n);
    while (s.length < 2) s = '0' + s;
    return s;
  }
  function csv(value) {
    if (value === null || value === undefined || value === '') return [];
    return String(value).split(',').map(function (v) { return v.trim(); }).filter(function (v) { return !!v; });
  }
  function todayText() {
    var d = new Date();
    return d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日';
  }
  function markSet(e) {
    var set = {};
    listOf(e.traits).forEach(function (id) { set[id] = true; });
    listOf(e.narratives).forEach(function (id) { set[id] = true; });
    return set;
  }

  /* ---------------------------------------------------------------- 选择集 */
  function resolveEntries(params) {
    var p = params || {};
    var ids = p.ids !== undefined ? csv(p.ids) : JR.compare.get();
    var seen = {};
    var out = [];
    ids.forEach(function (id) {
      if (seen[id]) return;
      seen[id] = true;
      var e = JR.byId(id);
      if (e && out.length < MAX_CMP) out.push(e);
    });
    return out;
  }

  function entrySearchText(e) {
    var term = termOf(e);
    return [
      e.title || '', e.work || '', e.creator || '',
      term.primary || '', listOf(term.variants).join(' '), term.original || '',
      listOf(e.tags).join(' ')
    ].join(' ').toLowerCase();
  }

  function presetEntries(preset) {
    var scored = [];
    JR.entries.forEach(function (e) {
      var score = 0;
      preset.ids.forEach(function (id) {
        if (listOf(e.traits).indexOf(id) >= 0 || listOf(e.narratives).indexOf(id) >= 0) score += 1;
      });
      if (score > 0) scored.push({ e: e, score: score });
    });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      var ya = yearOf(a.e); var yb = yearOf(b.e);
      if (ya === null) ya = 9999;
      if (yb === null) yb = 9999;
      return ya - yb;
    });
    return scored.slice(0, MAX_CMP).map(function (item) { return item.e; });
  }

  function eraGroups() {
    var groups = ERAS.map(function (era) { return { id: era.id, label: era.label, entries: [] }; });
    var undated = { id: 'undated', label: '未编年', entries: [] };
    var byId = {};
    groups.forEach(function (g) { byId[g.id] = g; });
    JR.entries.forEach(function (e) {
      var y = yearOf(e);
      if (y === null) { undated.entries.push(e); return; }
      var placed = false;
      ERAS.forEach(function (era) {
        if (!placed && y >= era.min && y < era.max) {
          byId[era.id].entries.push(e);
          placed = true;
        }
      });
      if (!placed) undated.entries.push(e);
    });
    groups.push(undated);
    return groups.filter(function (g) { return g.entries.length; });
  }

  /* ---------------------------------------------------------------- 矩阵数据 */
  function buildMatrix(entries) {
    var sets = entries.map(markSet);
    var groups = [];
    GROUP_ORDER.forEach(function (group) {
      var rows = [];
      GROUP_TRAITS[group].forEach(function (trait) {
        var has = sets.map(function (set) { return !!set[trait.id]; });
        var hasCount = has.filter(Boolean).length;
        if (!hasCount) return;
        rows.push({
          id: trait.id,
          group: group,
          label: trait.label,
          desc: trait.desc,
          has: has,
          hasCount: hasCount,
          diff: hasCount > 0 && hasCount < entries.length
        });
      });
      if (rows.length) {
        var counts = entries.map(function (e, i) {
          var n = 0;
          GROUP_TRAITS[group].forEach(function (t) { if (sets[i][t.id]) n += 1; });
          return n;
        });
        groups.push({ id: group, rows: rows, total: GROUP_TRAITS[group].length, counts: counts });
      }
    });
    var common = [];
    var diff = [];
    groups.forEach(function (g) {
      g.rows.forEach(function (row) {
        if (row.hasCount === entries.length) common.push(row);
        else diff.push(row);
      });
    });
    return { groups: groups, common: common, diff: diff, sets: sets };
  }

  function summaryPanel(title, rows, note, emptyText) {
    var body = rows.length
      ? '<div class="tag-list cmp-summary__tags">' + rows.map(function (row) {
        var href = row.group === '叙事' ? JR.buildHash('db', { narratives: row.id }) : JR.buildHash('db', { traits: row.id });
        return '<a class="tag tag--ghost cmp-summary__tag" href="' + JR.escAttr(href) + '">' +
          '<span class="cmp-summary__group">' + JR.esc(row.group) + '</span>' + JR.esc(row.label) +
          '</a>';
      }).join('') + '</div>'
      : '<p class="muted cmp-summary__empty">' + JR.esc(emptyText) + '</p>';
    return '<div class="panel cmp-summary__panel">' +
      '<p class="panel-title">' + JR.esc(title) + '<span class="cmp-summary__n mono">' + rows.length + ' 项</span></p>' +
      (note ? '<p class="caption cmp-summary__note">' + JR.esc(note) + '</p>' : '') +
      body +
      '</div>';
  }

  /* ---------------------------------------------------------------- 渲染：页头 */
  function pageHeadHtml(count, compareMode) {
    return '<header class="cmp-head">' +
      '<p class="kicker">比较</p>' +
      '<div class="cmp-head__row">' +
      '<div class="cmp-head__text">' +
      '<h1 class="display display--sm">并置比较</h1>' +
      '<p class="lede cmp-head__lede">' +
      (compareMode
        ? '按形态、能力与叙事功能逐项对照入选条目，读出哪些特征被延续、合并或删除。矩阵只反映已编码的特征，不代表文本中不存在该特征。'
        : '从资料库中选择 2 至 4 条条目并置，按形态、能力与叙事功能建立对照矩阵；也可以载入预设比较组快速开始。') +
      '</p>' +
      '</div>' +
      '<p class="cmp-head__meta meta">' + (compareMode
        ? '当前并置 <strong class="num">' + count + '</strong> 条'
        : '已选 <strong class="num">' + count + '</strong> / ' + MAX_CMP + ' 条') +
      '<span class="cmp-head__meta-sub">资料库共 ' + JR.entries.length + ' 条</span></p>' +
      '</div>' +
      '</header>';
  }

  function emptyDataHtml() {
    return '<div class="empty cmp-empty" role="group" aria-labelledby="cmp-empty-title">' +
      '<p class="empty__title" id="cmp-empty-title">资料库尚无可比较的条目</p>' +
      '<p class="empty__text">条目正在整理与核对中。可先回到资料库或阅读研究说明，稍后重新载入本页。</p>' +
      '<div class="btn-group">' +
      '<a class="btn btn--ghost" href="#/db">前往资料库</a>' +
      '<a class="btn btn--ghost" href="#/about">阅读研究说明</a>' +
      '</div>' +
      '</div>';
  }

  /* ---------------------------------------------------------------- 渲染：选择器 */
  function presetHtml(preset, entries) {
    var enough = entries.length >= 2;
    var list = entries.length
      ? '<ul class="cmp-preset__list">' + entries.map(function (e) {
        return '<li><span class="mono cmp-preset__year">' + JR.esc(yearText(e)) + '</span>' +
          '<span class="cmp-preset__t">' + JR.esc(e.title) + '</span></li>';
      }).join('') + '</ul>'
      : '<p class="muted cmp-preset__empty">当前资料库中没有命中该组特征的条目。</p>';
    return '<div class="panel cmp-preset">' +
      '<p class="cmp-preset__title serif">' + JR.esc(preset.label) + '</p>' +
      '<p class="cmp-preset__desc">' + JR.esc(preset.desc) + '</p>' +
      list +
      '<p class="caption cmp-preset__count">命中 ' + entries.length + ' 条' +
      (enough ? '' : '，不足 2 条，暂不可比较') + '</p>' +
      '<button type="button" class="btn btn--sm btn--ghost cmp-preset__btn" data-cmp-preset="' + JR.escAttr(preset.id) + '"' +
      (enough ? '' : ' disabled') + '>' + (enough ? '载入此组' : '暂不可用') + '</button>' +
      '</div>';
  }

  function pickRowHtml(e, selected) {
    var term = termOf(e);
    var on = selected.indexOf(e.id) >= 0;
    var full = selected.length >= MAX_CMP;
    var meta = '<span class="mono">' + JR.esc(yearText(e)) + '</span>' +
      (e.work ? ' · ' + JR.esc(e.work) : '') +
      (e.culture ? ' · ' + JR.esc(e.culture) : '') +
      (e.kind ? ' · ' + JR.esc(JR.kindLabel(e.kind)) : '');
    return '<li class="cmp-pick-row" data-cmp-pick-row data-search="' + JR.escAttr(entrySearchText(e)) + '">' +
      '<label class="check cmp-pick__label">' +
      '<input type="checkbox" data-cmp-pick value="' + JR.escAttr(e.id) + '"' +
      (on ? ' checked' : '') + (!on && full ? ' disabled' : '') + '>' +
      '<span class="cmp-pick__body">' +
      '<span class="cmp-pick__title serif">' + JR.esc(e.title) + '</span>' +
      '<span class="cmp-pick__meta meta">' + meta + '</span>' +
      (term.primary ? '<span class="cmp-pick__term meta">通名 ' + JR.esc(term.primary) + '</span>' : '') +
      '</span>' +
      '</label>' +
      '</li>';
  }

  function browserGroupsHtml(selected) {
    return eraGroups().map(function (group) {
      return '<div class="cmp-group" data-cmp-group>' +
        '<p class="cmp-group__head"><span class="cmp-group__title">' + JR.esc(group.label) + '</span>' +
        '<span class="cmp-group__n mono">' + group.entries.length + '</span></p>' +
        '<ul class="cmp-group__list">' + group.entries.map(function (e) {
          return pickRowHtml(e, selected);
        }).join('') + '</ul>' +
        '</div>';
    }).join('');
  }

  function chosenListHtml(entries) {
    if (!entries.length) return '';
    return entries.map(function (e, i) {
      return '<li class="cmp-chosen__item">' +
        '<span class="cmp-chosen__order mono">' + pad2(i + 1) + '</span>' +
        '<a class="cmp-chosen__title serif" href="#/entry/' + encodeURIComponent(e.id) + '">' + JR.esc(e.title) + '</a>' +
        '<span class="cmp-chosen__meta meta mono">' + JR.esc(yearText(e)) + '</span>' +
        '<button type="button" class="cmp-chosen__remove" data-cmp-unpick="' + JR.escAttr(e.id) + '"' +
        ' aria-label="' + JR.escAttr('移出已选：' + e.title) + '">' + JR.icon('close') + '</button>' +
        '</li>';
    }).join('');
  }

  function selectorPageHtml(entries) {
    var selected = entries.map(function (e) { return e.id; });
    var presets = PRESETS.map(function (p) { return presetHtml(p, presetEntries(p)); }).join('');
    return '<section class="wrap section section--page cmp-page">' +
      pageHeadHtml(entries.length, false) +
      '<div class="cmp-pick">' +
      '<div class="cmp-pick__main">' +
      '<section class="cmp-presets" aria-labelledby="cmp-presets-title">' +
      '<div class="cmp-sec-head">' +
      '<h2 class="cmp-sec-title" id="cmp-presets-title">预设比较组</h2>' +
      '<p class="caption">按 schema 特征自动挑选条目，最多 4 条；可载入后再调整。</p>' +
      '</div>' +
      '<div class="cmp-presets__grid">' + presets + '</div>' +
      '</section>' +
      '<section class="cmp-browser" aria-labelledby="cmp-browser-title">' +
      '<div class="cmp-sec-head cmp-browser__head">' +
      '<h2 class="cmp-sec-title" id="cmp-browser-title">从资料库选择条目</h2>' +
      '<p class="count"><strong data-cmp-chosen-n>' + selected.length + '</strong> / ' + MAX_CMP + ' 已选</p>' +
      '</div>' +
      '<div class="field cmp-search">' +
      '<label class="field-label" for="cmp-q">搜索条目</label>' +
      '<div class="search">' + JR.icon('search') +
      '<input class="input" id="cmp-q" type="search" data-cmp-q autocomplete="off" placeholder="例如：鲛人、塞壬、安徒生">' +
      '</div>' +
      '<p class="caption cmp-search__hint">可检索题名、作品、作者与异名。最多同时选择 ' + MAX_CMP + ' 条。</p>' +
      '</div>' +
      '<div class="cmp-groups" data-cmp-groups>' + browserGroupsHtml(selected) + '</div>' +
      '<p class="cmp-noresult muted" data-cmp-noresult hidden>没有匹配的条目，可以换一个关键词。</p>' +
      '</section>' +
      '</div>' +
      '<aside class="cmp-chosen panel" aria-label="已选条目">' +
      '<p class="panel-title">已选条目<span class="cmp-chosen__n mono" data-cmp-chosen-count>' + selected.length + '</span><span class="muted"> / ' + MAX_CMP + '</span></p>' +
      '<ol class="cmp-chosen__list" data-cmp-chosen-list>' + chosenListHtml(entries) + '</ol>' +
      '<p class="cmp-chosen__empty muted" data-cmp-chosen-empty' + (entries.length ? ' hidden' : '') + '>尚未选择条目，至少选择 2 条后可开始比较。</p>' +
      '<div class="cmp-chosen__actions">' +
      '<button type="button" class="btn btn--solid" data-cmp-start' + (entries.length >= 2 ? '' : ' disabled') + '>开始比较</button>' +
      '<button type="button" class="btn btn--ghost" data-cmp-clear-sel>清空选择</button>' +
      '</div>' +
      '<p class="caption cmp-chosen__note">选择会保存在本机浏览器中，并在「并置比较」入口显示数量。</p>' +
      '</aside>' +
      '</div>' +
      '</section>';
  }

  /* ---------------------------------------------------------------- 渲染：比较视图 */
  function printHeadHtml(entries) {
    return '<div class="cmp-print-head" aria-hidden="true">' +
      '<p class="cmp-print-head__project">从鲛人到美人鱼 · 跨文化形象研究数据库</p>' +
      '<p class="cmp-print-head__title">并置比较：' + entries.map(function (e) { return JR.esc(e.title); }).join(' / ') + '</p>' +
      '<p class="cmp-print-head__meta">共 ' + entries.length + ' 条 · 生成日期：' + JR.esc(todayText()) + '</p>' +
      '</div>';
  }

  function toolbarHtml(entries) {
    return '<div class="cmp-toolbar" role="toolbar" aria-label="比较操作">' +
      '<div class="cmp-toolbar__group">' +
      '<button type="button" class="btn btn--sm btn--ghost" data-cmp-edit>' + JR.icon('back') + '返回修改</button>' +
      '<button type="button" class="btn btn--sm btn--ghost" data-cmp-clear>清空</button>' +
      '<button type="button" class="btn btn--sm btn--ghost" data-cmp-share>复制分享链接</button>' +
      '<button type="button" class="btn btn--sm btn--ghost" data-cmp-print>' + JR.icon('print') + '打印</button>' +
      '<button type="button" class="btn btn--sm btn--ghost" data-cmp-export>' + JR.icon('download') + '导出 CSV</button>' +
      '</div>' +
      '<div class="cmp-toolbar__group cmp-toolbar__group--end">' +
      '<label class="check cmp-diff">' +
      '<input type="checkbox" data-cmp-diff> <span>仅显示差异</span>' +
      '</label>' +
      '</div>' +
      '</div>';
  }

  function columnHeadHtml(entry) {
    return '<th scope="col" class="cmp-table__col">' +
      '<a class="cmp-table__title serif" href="#/entry/' + encodeURIComponent(entry.id) + '">' + JR.esc(entry.title) + '</a>' +
      '<span class="cmp-table__meta meta"><span class="mono">' + JR.esc(yearText(entry)) + '</span>' +
      (entry.culture ? ' · ' + JR.esc(entry.culture) : '') +
      (entry.kind ? ' · ' + JR.esc(JR.kindLabel(entry.kind)) : '') + '</span>' +
      '<button type="button" class="cmp-table__remove" data-cmp-remove="' + JR.escAttr(entry.id) + '"' +
      ' aria-label="' + JR.escAttr('从比较中移出：' + entry.title) + '">移出</button>' +
      '</th>';
  }

  function profileRowHtml(entries) {
    return '<tr class="cmp-table__profile">' +
      '<th scope="row">名称与摘要</th>' +
      entries.map(function (e) {
        var term = termOf(e);
        var variants = listOf(term.variants);
        return '<td class="cmp-table__profile-cell">' +
          '<p class="cmp-table__name"><span class="serif">' + JR.esc(term.primary || '名称待核') + '</span>' +
          (variants.length ? '<span class="muted"> · 异名 ' + JR.esc(variants.join('、')) + '</span>' : '') +
          (term.original ? '<span class="mono muted"> · ' + JR.esc(term.original) + '</span>' : '') +
          '</p>' +
          '<p class="cmp-table__work meta">' +
          (e.work ? JR.esc(e.work) : '出处待考') +
          (e.creator ? ' · ' + JR.esc(e.creator) : '') +
          (e.eraLabel ? ' · ' + JR.esc(e.eraLabel) : '') +
          '</p>' +
          '<p class="cmp-table__summary">' + (e.summary ? JR.esc(e.summary) : '<span class="muted">暂无摘要。</span>') + '</p>' +
          '</td>';
      }).join('') +
      '</tr>';
  }

  function groupRowHtml(group, entries) {
    var diff = group.rows.some(function (row) { return row.diff; });
    return '<tr class="cmp-table__group" data-diff="' + (diff ? '1' : '0') + '">' +
      '<th scope="rowgroup">' + JR.esc(group.id) + '<span class="cmp-table__group-n mono">' + group.total + '</span></th>' +
      entries.map(function (e, i) {
        return '<td class="cmp-table__cell cmp-table__group-count"><span class="mono">' + group.counts[i] + ' / ' + group.total + '</span></td>';
      }).join('') +
      '</tr>';
  }

  function traitRowHtml(row) {
    return '<tr class="cmp-table__row" data-diff="' + (row.diff ? '1' : '0') + '">' +
      '<th scope="row">' + JR.esc(row.label) + '</th>' +
      row.has.map(function (on) {
        return '<td class="cmp-table__cell ' + (on ? 'is-on' : 'is-off') + '">' +
          '<span class="cmp-mark" aria-hidden="true">' + (on ? '●' : '·') + '</span>' +
          '<span class="sr-only">' + (on ? '有' : '无') + '</span>' +
          '</td>';
      }).join('') +
      '</tr>';
  }

  function matrixHtml(entries, matrix) {
    var minWidth = 190 + entries.length * 220;
    return '<div class="cmp-matrix-head">' +
      '<p class="caption cmp-matrix-legend"><span class="cmp-mark is-on" aria-hidden="true">●</span> 表示条目具备该特征，' +
      '<span class="cmp-mark is-off" aria-hidden="true">·</span> 表示不具备或未编码。列头吸顶，首列固定，可横向滚动。</p>' +
      '</div>' +
      '<div class="cmp-scroll" data-cmp-scroll>' +
      '<table class="cmp-table" style="min-width:' + minWidth + 'px">' +
      '<caption class="sr-only">入选条目的形态、能力与叙事特征对照表</caption>' +
      '<colgroup><col style="width:190px">' +
      entries.map(function () { return '<col>'; }).join('') +
      '</colgroup>' +
      '<thead><tr>' +
      '<th scope="col" class="cmp-table__corner">特征</th>' +
      entries.map(columnHeadHtml).join('') +
      '</tr></thead>' +
      '<tbody>' +
      profileRowHtml(entries) +
      matrix.groups.map(function (group) {
        return groupRowHtml(group, entries) +
          group.rows.map(traitRowHtml).join('');
      }).join('') +
      '</tbody>' +
      '</table>' +
      '</div>';
  }

  function summaryHtml(entries, matrix) {
    return '<section class="cmp-summary" aria-label="特征对照摘要">' +
      summaryPanel('共同特征', matrix.common, '入选条目全部具备的特征。', '入选条目没有共同编码的特征。') +
      summaryPanel('差异特征', matrix.diff, '部分条目具备、部分不具备的特征，是差异分析的重点。', '入选条目在已编码特征上完全一致。') +
      '</section>' +
      '<p class="caption cmp-footnote">矩阵按条目已编码的特征生成，空白格表示未编码，并不等于文本或图像中不存在该特征。' +
      '如需逐条核对，请回到条目详情查看出处与置信度。</p>';
  }

  function comparePageHtml(entries) {
    var matrix = buildMatrix(entries);
    var idsCsv = entries.map(function (e) { return e.id; }).join(',');
    return '<section class="wrap section section--page cmp-page cmp-page--matrix">' +
      '<div class="cmp-print-only">' + printHeadHtml(entries) + '</div>' +
      pageHeadHtml(entries.length, true) +
      toolbarHtml(entries) +
      matrixHtml(entries, matrix) +
      summaryHtml(entries, matrix) +
      '<p class="cmp-share-note caption">分享链接包含当前并置的条目编号：<span class="mono">' + JR.esc(idsCsv) + '</span></p>' +
      '</section>';
  }

  /* ---------------------------------------------------------------- 页面定义 */
  JR.page('compare', {
    title: '并置比较',

    render: function (params) {
      var p = params || {};
      var entries = resolveEntries(p);
      var edit = p.edit === '1';
      if (!JR.entries.length) {
        return '<section class="wrap section section--page cmp-page">' +
          '<header class="cmp-head"><p class="kicker">比较</p>' +
          '<h1 class="display display--sm">并置比较</h1>' +
          '<p class="lede cmp-head__lede">并置比较用于核对条目之间的特征同异。资料库就绪后即可使用。</p></header>' +
          emptyDataHtml() +
          '</section>';
      }
      if (!edit && entries.length >= 2) return comparePageHtml(entries);
      return selectorPageHtml(entries);
    },

    mount: function (root, params) {
      cleanupFns = [];
      var p = params || {};
      var entries = resolveEntries(p);
      var edit = p.edit === '1';
      var compareMode = JR.entries.length > 0 && !edit && entries.length >= 2;

      function on(target, type, fn) {
        if (!target) return;
        target.addEventListener(type, fn);
        cleanupFns.push(function () { target.removeEventListener(type, fn); });
      }

      function copyText(text, okMsg) {
        function fallback() {
          try {
            var ta = global.document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.top = '-1000px';
            ta.style.opacity = '0';
            global.document.body.appendChild(ta);
            ta.select();
            var okFlag = global.document.execCommand && global.document.execCommand('copy');
            global.document.body.removeChild(ta);
            JR.toast(okFlag ? okMsg : '复制失败，请手动复制地址栏链接');
          } catch (err) {
            JR.toast('复制失败，请手动复制地址栏链接');
          }
        }
        if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
          global.navigator.clipboard.writeText(text).then(function () {
            JR.toast(okMsg);
          }, fallback);
        } else {
          fallback();
        }
      }

      if (compareMode) {
        mountCompare(root, entries, on, copyText);
      } else {
        mountSelector(root, entries, on);
      }
    },

    unmount: function () {
      cleanupFns.forEach(function (fn) {
        try { fn(); } catch (err) {}
      });
      cleanupFns = [];
    }
  });

  /* ---------------------------------------------------------------- 比较视图挂载 */
  function mountCompare(root, entries, on, copyText) {
    var idsCsv = entries.map(function (e) { return e.id; }).join(',');
    if (JR.compare.get().join(',') !== idsCsv) JR.compare.set(entries.map(function (e) { return e.id; }));

    function exportCsv() {
      var matrix = buildMatrix(entries);
      var rows = [];
      matrix.groups.forEach(function (group) {
        group.rows.forEach(function (row) {
          rows.push({ group: group.id, label: row.label, has: row.has });
        });
      });
      var columns = [
        { label: '分组', value: function (row) { return row.group; } },
        { label: '特征', value: function (row) { return row.label; } }
      ].concat(entries.map(function (e, i) {
        return {
          label: e.title,
          value: function (row) { return row.has[i] ? '有' : ''; }
        };
      }));
      JR.download('鲛人比较矩阵.csv', JR.toCsv(rows, columns), 'text/csv;charset=utf-8');
      JR.toast('已导出比较矩阵（' + rows.length + ' 行）');
    }

    on(root, 'click', function (e) {
      var target = e.target;
      if (!target || !target.closest) return;

      var editBtn = target.closest('[data-cmp-edit]');
      if (editBtn) {
        JR.go('compare', { ids: idsCsv, edit: '1' });
        return;
      }
      var clearBtn = target.closest('[data-cmp-clear]');
      if (clearBtn) {
        JR.compare.clear();
        JR.toast('已清空比较');
        JR.go('compare');
        return;
      }
      var shareBtn = target.closest('[data-cmp-share]');
      if (shareBtn) {
        var base = String(global.location.href).split('#')[0];
        copyText(base + JR.buildHash('compare', { ids: idsCsv }), '分享链接已复制');
        return;
      }
      var printBtn = target.closest('[data-cmp-print]');
      if (printBtn) {
        if (global.print) global.print();
        return;
      }
      var exportBtn = target.closest('[data-cmp-export]');
      if (exportBtn) {
        exportCsv();
        return;
      }
      var removeBtn = target.closest('[data-cmp-remove]');
      if (removeBtn) {
        var rid = removeBtn.getAttribute('data-cmp-remove');
        var rest = entries.filter(function (e) { return e.id !== rid; }).map(function (e) { return e.id; });
        JR.compare.set(rest);
        JR.toast('已移出比较');
        if (rest.length >= 2) JR.go('compare', { ids: rest.join(',') });
        else JR.go('compare');
        return;
      }
    });

    var diffInput = root.querySelector('[data-cmp-diff]');
    var scroll = root.querySelector('[data-cmp-scroll]');
    if (diffInput && scroll) {
      on(diffInput, 'change', function () {
        scroll.classList.toggle('is-diff-only', diffInput.checked);
        JR.toast(diffInput.checked ? '仅显示差异特征' : '显示全部特征');
      });
    }
  }

  /* ---------------------------------------------------------------- 选择器挂载 */
  function mountSelector(root, initialEntries, on) {
    var sel = initialEntries.map(function (e) { return e.id; });

    function syncChecks() {
      Array.prototype.forEach.call(root.querySelectorAll('[data-cmp-pick]'), function (cb) {
        var id = cb.value;
        var isOn = sel.indexOf(id) >= 0;
        cb.checked = isOn;
        cb.disabled = !isOn && sel.length >= MAX_CMP;
      });
    }

    function renderChosen() {
      var listEl = root.querySelector('[data-cmp-chosen-list]');
      var emptyEl = root.querySelector('[data-cmp-chosen-empty]');
      var chosenEntries = sel.map(JR.byId).filter(Boolean);
      if (listEl) listEl.innerHTML = chosenListHtml(chosenEntries);
      if (emptyEl) emptyEl.hidden = chosenEntries.length > 0;
      Array.prototype.forEach.call(root.querySelectorAll('[data-cmp-chosen-n], [data-cmp-chosen-count]'), function (el) {
        el.textContent = String(sel.length);
      });
      var startBtn = root.querySelector('[data-cmp-start]');
      if (startBtn) startBtn.disabled = sel.length < 2;
    }

    function persist() {
      JR.compare.set(sel);
      JR.replaceQuery({ ids: sel.join(','), edit: '1' }, 'compare');
    }

    function syncSelection() {
      syncChecks();
      renderChosen();
      persist();
    }

    function loadPreset(presetId) {
      var preset = null;
      PRESETS.some(function (p) { if (p.id === presetId) { preset = p; return true; } return false; });
      if (!preset) return;
      var picked = presetEntries(preset);
      if (picked.length < 2) {
        JR.toast('该比较组可用条目不足 2 条');
        return;
      }
      sel = picked.map(function (e) { return e.id; });
      syncSelection();
      JR.toast('已载入比较组「' + preset.label + '」，共 ' + sel.length + ' 条');
    }

    on(root, 'click', function (e) {
      var target = e.target;
      if (!target || !target.closest) return;

      var presetBtn = target.closest('[data-cmp-preset]');
      if (presetBtn) {
        loadPreset(presetBtn.getAttribute('data-cmp-preset'));
        return;
      }
      var unpick = target.closest('[data-cmp-unpick]');
      if (unpick) {
        var uid = unpick.getAttribute('data-cmp-unpick');
        sel = sel.filter(function (id) { return id !== uid; });
        syncSelection();
        return;
      }
      var startBtn = target.closest('[data-cmp-start]');
      if (startBtn) {
        if (sel.length < 2) {
          JR.toast('至少选择 2 条条目才能开始比较');
          return;
        }
        JR.go('compare', { ids: sel.join(',') });
        return;
      }
      var clearBtn = target.closest('[data-cmp-clear-sel]');
      if (clearBtn) {
        sel = [];
        syncSelection();
        JR.toast('已清空选择');
        return;
      }
    });

    on(root, 'change', function (e) {
      var input = e.target;
      if (!input || input.getAttribute('data-cmp-pick') === null) return;
      var id = input.value;
      if (input.checked) {
        if (sel.length >= MAX_CMP) {
          input.checked = false;
          JR.toast('最多同时比较 ' + MAX_CMP + ' 条');
          return;
        }
        if (sel.indexOf(id) < 0) sel.push(id);
      } else {
        sel = sel.filter(function (x) { return x !== id; });
      }
      syncSelection();
    });

    var qInput = root.querySelector('[data-cmp-q]');
    if (qInput) {
      on(qInput, 'input', function () {
        var q = String(qInput.value || '').trim().toLowerCase();
        var groups = root.querySelectorAll('[data-cmp-group]');
        var total = 0;
        Array.prototype.forEach.call(groups, function (group) {
          var rows = group.querySelectorAll('[data-cmp-pick-row]');
          var shown = 0;
          Array.prototype.forEach.call(rows, function (row) {
            var hit = !q || String(row.getAttribute('data-search') || '').indexOf(q) >= 0;
            row.hidden = !hit;
            if (hit) shown += 1;
          });
          group.hidden = shown === 0;
          total += shown;
        });
        var nores = root.querySelector('[data-cmp-noresult]');
        if (nores) nores.hidden = total > 0;
      });
    }

    syncChecks();
    renderChosen();
    JR.compare.set(sel);
    JR.replaceQuery({ ids: sel.join(','), edit: '1' }, 'compare');
  }
})(window);
