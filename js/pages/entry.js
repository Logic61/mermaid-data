/* ==========================================================================
   鲛人研究数据库 · 条目详情
   依赖：data/schema.js、js/core.js（JR.*）。render 返回纯 HTML 字符串。
   页面私有样式前缀：.entry-（见 css/pages-db.css）
   ========================================================================== */
(function (global) {
  'use strict';

  var JR = global.JR;
  var S = JR.schema || {};
  var MAX_CMP = JR.compareMax || 4;
  var CONF_CLASS = { '确证': 'badge--ok', '版本存异': 'badge--unknown', '待核': 'badge--warn' };

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
  function yearShort(e) {
    var y = yearOf(e);
    if (y === null) return '待考';
    var note = String(e.yearNote || '');
    if (note.length > 4) note = '';
    return note + JR.yearShort(y);
  }
  function confidenceBadge(confidence) {
    var c = confidence || '待核';
    var cls = CONF_CLASS[c] || 'badge--unknown';
    return '<span class="badge ' + cls + '">' + JR.esc(c) + '</span>';
  }
  function safeUrl(url) {
    var u = String(url || '').trim();
    return /^https?:\/\//i.test(u) ? u : '';
  }
  function sectionTitle(no, title) {
    return '<h2 class="entry-sec__title"><span class="entry-sec__no mono">' + JR.esc(no) + '</span>' +
      '<span>' + JR.esc(title) + '</span></h2>';
  }
  function section(no, title, body) {
    return '<section class="entry-sec">' + sectionTitle(no, title) +
      '<div class="entry-sec__body">' + body + '</div></section>';
  }
  function placeholder(text) {
    return '<p class="entry-placeholder muted">' + JR.esc(text) + '</p>';
  }
  function citationText(e) {
    var workRaw = String(e.work || e.title || '').trim();
    var work = workRaw.charAt(0) === '《' ? workRaw : '《' + workRaw + '》';
    var creator = String(e.creator || '佚名').trim();
    var when = String(e.dateDisplay || e.eraLabel || '年代待考').trim();
    var sources = listOf(e.sources);
    var src = String(e.excerptSource || (sources[0] && sources[0].label) || '出处待核').trim();
    return creator + '：' + work + '，' + when + '。出处：' + src;
  }
  function traitsHref(e) {
    var traitIds = listOf(e.traits).filter(function (id) { return JR.traitGroup(id) === '形态' || JR.traitGroup(id) === '能力'; }).slice(0, 3);
    var narrativeIds = listOf(e.narratives).filter(function (id) { return JR.traitGroup(id) === '叙事'; }).slice(0, 2);
    if (!traitIds.length && !narrativeIds.length) {
      return JR.buildHash('db', { q: termOf(e).primary || e.title || '' });
    }
    var params = {};
    if (traitIds.length) params.traits = traitIds.join(',');
    if (narrativeIds.length) params.narratives = narrativeIds.join(',');
    return JR.buildHash('db', params);
  }

  /* ---------------------------------------------------------------- 渲染：页头 */
  function headHtml(e, cmpOn) {
    var term = termOf(e);
    var variants = listOf(term.variants);
    var kinds = [];
    if (e.kind) kinds.push(JR.kindLabel(e.kind));
    if (e.subtype) kinds.push(e.subtype);
    return '<header class="entry-head">' +
      '<nav class="breadcrumb" aria-label="面包屑">' +
      '<a href="#/db">资料库</a>' +
      '<span class="breadcrumb__sep" aria-hidden="true">/</span>' +
      '<span aria-current="page">条目</span>' +
      '</nav>' +
      '<div class="entry-head__main">' +
      '<div class="entry-head__text">' +
      '<p class="entry-head__tags">' +
      '<span class="tag tag--ghost">' + JR.esc(kinds.join(' · ') || '条目') + '</span>' +
      confidenceBadge(e.confidence) +
      '</p>' +
      '<h1 class="display display--sm entry-title">' + JR.esc(e.title) + '</h1>' +
      (term.primary || variants.length
        ? '<p class="entry-head__names"><span class="entry-head__names-k">通名</span>' +
          '<span class="serif">' + JR.esc(term.primary || '待核') + '</span>' +
          (variants.length ? '<span class="entry-head__names-alt">异名 ' + JR.esc(variants.join('、')) + '</span>' : '') +
          (term.original ? '<span class="entry-head__names-orig mono">' + JR.esc(term.original) + '</span>' : '') +
          '</p>'
        : '') +
      '<dl class="entry-sub">' +
      '<div class="entry-sub__item"><dt>作品</dt><dd>' + (e.work ? JR.esc(e.work) : '<span class="muted">待考</span>') + '</dd></div>' +
      '<div class="entry-sub__item"><dt>作者</dt><dd>' + (e.creator ? JR.esc(e.creator) : '<span class="muted">待考</span>') + '</dd></div>' +
      '<div class="entry-sub__item"><dt>年代</dt><dd>' + JR.esc(e.dateDisplay || e.eraLabel || '年代待考') + '</dd></div>' +
      '<div class="entry-sub__item"><dt>地区</dt><dd>' + (e.region ? '<span class="dot ' + JR.escAttr(JR.cultureClass(e.culture)) + '"></span>' + JR.esc(e.region) : '<span class="muted">待考</span>') + '</dd></div>' +
      '<div class="entry-sub__item"><dt>媒介</dt><dd>' + (e.medium ? JR.esc(e.medium) : '<span class="muted">待考</span>') + '</dd></div>' +
      '<div class="entry-sub__item"><dt>置信度</dt><dd>' + confidenceBadge(e.confidence) + '</dd></div>' +
      '</dl>' +
      '</div>' +
      '<div class="entry-head__actions">' +
      '<button type="button" class="btn btn--sm btn--ghost" data-entry-copy aria-label="复制引文到剪贴板">复制引文</button>' +
      '<button type="button" class="btn btn--sm btn--ghost entry-cmp-btn' + (cmpOn ? ' is-on' : '') + '"' +
      ' data-compare-toggle="' + JR.escAttr(e.id) + '" data-compare-title="' + JR.escAttr(e.title) + '"' +
      ' aria-pressed="' + (cmpOn ? 'true' : 'false') + '"' +
      ' aria-label="' + JR.escAttr((cmpOn ? '移出比较：' : '加入比较：') + e.title) + '">' +
      '<span data-compare-label>' + (cmpOn ? '已选' : '加入比较') + '</span></button>' +
      '<a class="btn btn--sm btn--ghost" href="#/db">返回资料库</a>' +
      '</div>' +
      '</div>' +
      '</header>';
  }

  /* ---------------------------------------------------------------- 渲染：正文 */
  function quoteHtml(e) {
    var source = String(e.excerptSource || '').trim();
    if (!source) {
      var sources = listOf(e.sources);
      if (sources[0] && sources[0].label) source = String(sources[0].label);
    }
    var body;
    if (e.excerpt) {
      body = '<blockquote class="entry-quote__text serif">' + JR.esc(e.excerpt) + '</blockquote>';
    } else {
      body = '<p class="entry-quote__text entry-quote__text--empty muted">本条目暂无逐字引文，以下释读以摘要与出处为准。</p>';
    }
    return '<section class="entry-quote" aria-label="原文引文">' +
      '<p class="entry-quote__label kicker">原文</p>' +
      body +
      (source ? '<p class="entry-quote__src">出处：' + JR.esc(source) + '</p>' : '<p class="entry-quote__src muted">出处待核</p>') +
      (e.translation ? '<div class="entry-quote__trans"><span class="entry-quote__trans-k">今译 / 官方译名</span>' + JR.esc(e.translation) + '</div>' : '') +
      '</section>';
  }

  function summaryHtml(e) {
    return section('01', '条目释读', e.summary ? '<p class="body-text">' + JR.esc(e.summary) + '</p>' : placeholder('本条目尚未撰写释读。'));
  }

  function significanceHtml(e) {
    return section('02', '研究意义', e.significance ? '<p class="body-text">' + JR.esc(e.significance) + '</p>' : placeholder('本条目尚未撰写研究意义。'));
  }

  function termHtml(e) {
    var term = termOf(e);
    var rows = [];
    if (term.primary) rows.push(['通名', '<span class="serif">' + JR.esc(term.primary) + '</span>']);
    var variants = listOf(term.variants);
    if (variants.length) rows.push(['异名', '<span class="serif">' + JR.esc(variants.join('、')) + '</span>']);
    if (term.original) rows.push(['原文 / 外文', '<span class="mono">' + JR.esc(term.original) + '</span>']);
    if (term.note) rows.push(['说明', JR.esc(term.note)]);
    if (!rows.length) return section('03', '名称信息', placeholder('本条目暂无名称字段。'));
    return section('03', '名称信息',
      '<dl class="entry-terms">' + rows.map(function (row) {
        return '<div class="entry-terms__row"><dt>' + row[0] + '</dt><dd>' + row[1] + '</dd></div>';
      }).join('') + '</dl>');
  }

  function codesHtml(e) {
    var marked = {};
    listOf(e.traits).forEach(function (id) { marked[id] = true; });
    listOf(e.narratives).forEach(function (id) { marked[id] = true; });
    var groups = [{ id: '形态', items: [] }, { id: '能力', items: [] }, { id: '叙事', items: [] }];
    var byId = {};
    groups.forEach(function (g) { byId[g.id] = g; });
    (S.traits || []).forEach(function (t) {
      if (!marked[t.id]) return;
      var g = byId[t.group];
      if (g) g.items.push(t);
    });
    var total = groups.reduce(function (n, g) { return n + g.items.length; }, 0);
    if (!total) return section('04', '形象与叙事编码', placeholder('本条目尚未标注形象与叙事编码。'));
    var body = groups.filter(function (g) { return g.items.length; }).map(function (g) {
      return '<div class="entry-code">' +
        '<h3 class="entry-code__title">' + JR.esc(g.id) + '<span class="entry-code__n mono">' + g.items.length + '</span></h3>' +
        '<ul class="entry-code__list">' + g.items.map(function (t) {
          return '<li class="entry-code__item">' +
            '<p class="entry-code__label"><span class="tag">' + JR.esc(t.label) + '</span></p>' +
            '<p class="entry-code__desc">' + JR.esc(t.desc) + '</p>' +
            '</li>';
        }).join('') + '</ul>' +
        '</div>';
    }).join('');
    return section('04', '形象与叙事编码',
      '<p class="entry-code__hint muted small">编码依据《编码手册》的术语表。同一特征在不同条目中的判定边界可能存异，引用前请核对原文。</p>' + body);
  }

  function sourcesHtml(e) {
    var sources = listOf(e.sources);
    var bits = [];
    if (!sources.length && !e.excerptSource) {
      return section('05', '出处与核对', placeholder('本条目暂无核对来源。'));
    }
    if (sources.length) {
      bits.push('<ol class="entry-sources">' + sources.map(function (s) {
        var label = String(s.label || '').trim();
        var detail = String(s.detail || '').trim();
        var url = safeUrl(s.url);
        var head = url
          ? '<a class="link entry-source__link" href="' + JR.escAttr(url) + '" target="_blank" rel="noopener noreferrer">' + JR.esc(label || url) + JR.icon('external') + '<span class="sr-only">（在新窗口打开）</span></a>'
          : '<span class="entry-source__label">' + JR.esc(label || '未标注') + '</span>';
        return '<li class="entry-source">' + head +
          (detail ? '<span class="entry-source__detail muted">' + JR.esc(detail) + '</span>' : '') +
          '</li>';
      }).join('') + '</ol>');
    }
    if (e.excerptSource) {
      bits.push('<p class="caption entry-sources__note">引文出处：' + JR.esc(e.excerptSource) +
        (e.confidence ? '；置信度：' + JR.esc(e.confidence) : '') + '</p>');
    } else {
      bits.push('<p class="caption entry-sources__note">出处核对状态：' + confidenceBadge(e.confidence) + '</p>');
    }
    return section('05', '出处与核对', bits.join(''));
  }

  function relatedHtml(e) {
    var related = JR.relatedOf(e).slice(0, 4);
    if (!related.length) return section('06', '关联条目', placeholder('本条目暂无关联条目。'));
    return section('06', '关联条目',
      '<ul class="entry-related">' + related.map(function (r) {
        return '<li class="entry-related__item"><a class="entry-related__link" href="#/entry/' + encodeURIComponent(r.id) + '">' +
          '<span class="entry-related__kind meta">' + JR.esc(JR.kindLabel(r.kind)) + '</span>' +
          '<span class="entry-related__title serif">' + JR.esc(r.title) + '</span>' +
          '<span class="entry-related__meta meta"><span class="mono">' + JR.esc(yearShort(r)) + '</span>' +
          (r.culture ? ' · ' + JR.esc(r.culture) : '') + '</span>' +
          '</a></li>';
      }).join('') + '</ul>');
  }

  /* ---------------------------------------------------------------- 渲染：侧栏 */
  function suggestFigure(e) {
    /* 条目未给 figure 时，按谱系与形态特征选取示意线描；仅为版式配图，不指认原图 */
    var marked = {};
    listOf(e.traits).forEach(function (id) { marked[id] = true; });
    listOf(e.narratives).forEach(function (id) { marked[id] = true; });
    var eastAsian = e.culture === '东亚';
    var chinese = e.culture === '中国';
    var laterThan1800 = e.kind === 'modern' || (yearOf(e) !== null && yearOf(e) >= 1800);

    if (marked.m_bird_body) return 'siren-bird';
    if (marked.m_twin_tail) return 'dual-tail';
    if (marked.m_fish_tail || marked.m_human_upper) {
      if (eastAsian) return 'ningyo';
      if (chinese) return 'jiao-ren';
      if (laterThan1800) return 'mermaid';
      return 'siren-fish';
    }
    if (marked.b_siren_song) return 'siren-bird';
    if (marked.b_tears_pearl || marked.b_weave_silk) {
      return (chinese || eastAsian) ? 'jiao-ren' : 'mermaid';
    }
    if (marked.m_shapeshift) {
      if (eastAsian) return 'ningyo';
      if (chinese) return 'jiao-ren';
      return 'mermaid';
    }
    if (marked.b_voice_trade || marked.b_sacrifice_foam) return 'mermaid';
    return '';
  }

  function plateHtml(e) {
    var explicit = e.figure && global.JR_FIGURES && global.JR_FIGURES[e.figure] ? e.figure : '';
    var name = explicit || suggestFigure(e);
    var fig = name ? JR.figure(name, 'figure--ink') : '';
    if (!fig) {
      return '<div class="entry-plate entry-plate--empty">' +
        '<p class="entry-plate__empty">暂无图版</p>' +
        '<p class="caption">本条目的图版尚待补充。</p>' +
        '</div>';
    }
    var caption = explicit
      ? '据文献描述重绘的示意线描，非原件图像。'
      : '示意线描，依据谱系与形态特征选取，非该条目原图。';
    return '<figure class="entry-plate">' + fig +
      '<figcaption class="caption entry-plate__cap">' + caption + '</figcaption>' +
      '</figure>';
  }

  function cardHtml(e) {
    var term = termOf(e);
    return '<section class="panel entry-card" aria-label="档案卡">' +
      '<p class="panel-title">档案卡</p>' +
      '<dl class="entry-card__list">' +
      '<div class="entry-card__row"><dt>编号</dt><dd class="mono entry-card__id">' + JR.esc(e.id) + '</dd></div>' +
      '<div class="entry-card__row"><dt>类型</dt><dd>' + JR.esc(JR.kindLabel(e.kind)) + (e.subtype ? '<span class="muted"> · ' + JR.esc(e.subtype) + '</span>' : '') + '</dd></div>' +
      '<div class="entry-card__row"><dt>年代</dt><dd>' + JR.esc(e.dateDisplay || e.eraLabel || '年代待考') + '</dd></div>' +
      '<div class="entry-card__row"><dt>谱系</dt><dd>' + (e.culture ? '<span class="dot ' + JR.escAttr(JR.cultureClass(e.culture)) + '"></span>' + JR.esc(e.culture) : '待考') + '</dd></div>' +
      '<div class="entry-card__row"><dt>地区</dt><dd>' + (e.region ? JR.esc(e.region) : '待考') + '</dd></div>' +
      '<div class="entry-card__row"><dt>媒介</dt><dd>' + (e.medium ? JR.esc(e.medium) : '待考') + '</dd></div>' +
      '<div class="entry-card__row"><dt>置信度</dt><dd>' + confidenceBadge(e.confidence) + '</dd></div>' +
      '<div class="entry-card__row"><dt>通名</dt><dd>' + (term.primary ? JR.esc(term.primary) : '待考') + '</dd></div>' +
      '</dl>' +
      '</section>';
  }

  function actionsHtml(e) {
    return '<section class="entry-aside-sec" aria-label="条目操作">' +
      '<h2 class="entry-aside__title">操作</h2>' +
      '<div class="entry-actions">' +
      '<button type="button" class="btn btn--sm btn--ghost entry-cmp-btn" data-compare-toggle="' + JR.escAttr(e.id) + '"' +
      ' data-compare-title="' + JR.escAttr(e.title) + '" aria-pressed="false" aria-label="' + JR.escAttr('加入比较：' + e.title) + '">' +
      '<span data-compare-label>加入比较</span></button>' +
      '<a class="btn btn--sm btn--ghost" href="' + JR.escAttr(traitsHref(e)) + '">检索同特征条目</a>' +
      '<a class="btn btn--sm btn--ghost" href="' + JR.escAttr('#/timeline?focus=' + encodeURIComponent(e.id)) + '">在时间轴中查看</a>' +
      '</div>' +
      '</section>';
  }

  function pagerHtml(e) {
    var index = -1;
    JR.entries.some(function (x, i) {
      if (x.id === e.id) { index = i; return true; }
      return false;
    });
    var prev = index > 0 ? JR.entries[index - 1] : null;
    var next = index >= 0 && index < JR.entries.length - 1 ? JR.entries[index + 1] : null;
    function link(target, dir, label) {
      if (!target) {
        return '<span class="entry-pager__item is-disabled"><span class="entry-pager__k meta">' + label + '</span>' +
          '<span class="entry-pager__t muted">' + (dir === 'prev' ? '已是首条' : '已是末条') + '</span></span>';
      }
      return '<a class="entry-pager__item" href="#/entry/' + encodeURIComponent(target.id) + '">' +
        '<span class="entry-pager__k meta">' + label + '</span>' +
        '<span class="entry-pager__t serif">' + JR.esc(target.title) + '</span>' +
        '<span class="entry-pager__y meta mono">' + JR.esc(yearShort(target)) + '</span>' +
        '</a>';
    }
    return '<nav class="entry-pager" aria-label="按年份相邻的条目">' +
      link(prev, 'prev', '上一条') +
      link(next, 'next', '下一条') +
      '</nav>';
  }

  function cmpBarHtml(cmpIds) {
    var n = cmpIds.length;
    return '<div class="entry-cmpbar" data-cmp-bar role="region" aria-label="比较台"' + (n ? '' : ' hidden') + '>' +
      '<div class="wrap entry-cmpbar__inner">' +
      '<p class="entry-cmpbar__label"><span data-cmp-label>已选 ' + n + ' / ' + MAX_CMP + ' 条</span>' +
      '<span class="entry-cmpbar__hint">并置比较最多 ' + MAX_CMP + ' 条</span></p>' +
      '<div class="entry-cmpbar__actions">' +
      '<a class="btn btn--solid btn--sm" href="#/compare">查看比较</a>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-cmp-clear>清空</button>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  /* ---------------------------------------------------------------- 渲染：页面 */
  function notFoundHtml(id) {
    return '<section class="wrap section section--page entry-page">' +
      '<nav class="breadcrumb" aria-label="面包屑">' +
      '<a href="#/db">资料库</a>' +
      '<span class="breadcrumb__sep" aria-hidden="true">/</span>' +
      '<span aria-current="page">条目</span>' +
      '</nav>' +
      '<div class="empty entry-notfound mt-8">' +
      '<h1 class="empty__title">没有找到这个条目</h1>' +
      '<p class="empty__text">地址中的条目编号可能已经变更，或该条目尚未录入。可以回到资料库重新检索。</p>' +
      '<a class="btn btn--ghost" href="#/db">返回资料库</a>' +
      '</div>' +
      (id ? '<p class="caption entry-notfound__id">请求的编号：<span class="mono">' + JR.esc(id) + '</span></p>' : '') +
      '</section>';
  }

  function layoutHtml(e, cmpOn) {
    return '<div class="entry-layout">' +
      '<div class="entry-main">' +
      quoteHtml(e) +
      summaryHtml(e) +
      significanceHtml(e) +
      termHtml(e) +
      codesHtml(e) +
      sourcesHtml(e) +
      relatedHtml(e) +
      '</div>' +
      '<aside class="entry-aside" aria-label="图版、档案卡与操作">' +
      plateHtml(e) +
      cardHtml(e) +
      actionsHtml(e) +
      pagerHtml(e) +
      '</aside>' +
      '</div>';
  }

  JR.page('entry', {
    title: '条目',

    render: function (params, args) {
      var id = args && args.id ? String(args.id) : '';
      var entry = id ? JR.byId(id) : null;
      if (!entry) return notFoundHtml(id);
      var cmpIds = JR.compare.get();
      var cmpOn = cmpIds.indexOf(entry.id) >= 0;
      return '<section class="wrap section section--page entry-page">' +
        headHtml(entry, cmpOn) +
        layoutHtml(entry) +
        cmpBarHtml(cmpIds) +
        '</section>';
    },

    mount: function (root, params, args) {
      cleanupFns = [];
      var id = args && args.id ? String(args.id) : '';
      var entry = id ? JR.byId(id) : null;

      function on(target, type, fn) {
        if (!target) return;
        target.addEventListener(type, fn);
        cleanupFns.push(function () { target.removeEventListener(type, fn); });
      }

      function syncCompare() {
        var ids = JR.compare.get();
        var has = {};
        ids.forEach(function (cid) { has[cid] = true; });
        Array.prototype.forEach.call(root.querySelectorAll('[data-compare-toggle]'), function (btn) {
          var cid = btn.getAttribute('data-compare-toggle');
          var title = btn.getAttribute('data-compare-title') || '';
          var isOn = !!has[cid];
          btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
          btn.classList.toggle('is-on', isOn);
          var textEl = btn.querySelector('[data-compare-label]');
          if (textEl) textEl.textContent = isOn ? '已选' : '加入比较';
          btn.setAttribute('aria-label', (isOn ? '移出比较：' : '加入比较：') + title);
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

      function currentCitation() {
        return entry ? citationText(entry) : '';
      }

      function fallbackCopy(text) {
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
          JR.toast(okFlag ? '引文已复制到剪贴板' : '复制失败，请手动选择引文文本');
        } catch (err) {
          JR.toast('复制失败，请手动选择引文文本');
        }
      }

      function copyCitation() {
        var text = currentCitation();
        if (!text) return;
        if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
          global.navigator.clipboard.writeText(text).then(function () {
            JR.toast('引文已复制到剪贴板');
          }, function () {
            fallbackCopy(text);
          });
        } else {
          fallbackCopy(text);
        }
      }

      function handleCompareToggle(btn) {
        var cid = btn.getAttribute('data-compare-toggle');
        if (!cid) return;
        if (JR.compare.has(cid)) {
          JR.compare.remove(cid);
          JR.toast('已移出比较');
        } else if (JR.compare.isFull()) {
          JR.toast('比较台最多 ' + MAX_CMP + ' 条，请先在比较页移出一条');
        } else {
          var next = JR.compare.add(cid);
          JR.toast('已加入比较，当前 ' + next.length + ' 条');
        }
      }

      on(root, 'click', function (e) {
        var target = e.target;
        if (!target || !target.closest) return;
        if (target.closest('[data-entry-copy]')) { copyCitation(); return; }
        var cmpToggle = target.closest('[data-compare-toggle]');
        if (cmpToggle) { handleCompareToggle(cmpToggle); return; }
        if (target.closest('[data-cmp-clear]')) {
          JR.compare.clear();
          JR.toast('已清空比较台');
        }
      });

      on(global, 'jr:compare', syncCompare);
      on(global, 'storage', function (e) {
        if (e && e.key === 'jr-compare-v1') syncCompare();
      });

      syncCompare();
    },

    unmount: function () {
      cleanupFns.forEach(function (fn) {
        try { fn(); } catch (err) {}
      });
      cleanupFns = [];
      if (global.document && global.document.body) {
        global.document.body.classList.remove('db-has-cmpbar');
      }
    }
  });
})(window);
