#!/usr/bin/env node
/* ==========================================================================
   数据与结构校验（无浏览器）
   用法：node tools/check.js [--strict]
   --strict：页面文件缺失也视为失败（交付前使用）
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const STRICT = process.argv.includes('--strict');
let failures = 0;
let warnings = 0;
const log = (...a) => console.log(...a);
const fail = (msg) => { failures++; log('  ✗ ' + msg); };
const warn = (msg) => { warnings++; log('  ! ' + msg); };

function read(file) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

function loadScripts(files) {
  const sandbox = {
    console: { log: () => {}, warn: () => {}, error: () => {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    location: { hash: '#/' },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    dispatchEvent: () => {},
    matchMedia: () => ({ matches: false }),
    CustomEvent: function (type, opts) { this.type = type; this.detail = opts && opts.detail; },
    navigator: { clipboard: null },
    document: {
      readyState: 'complete',
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      createElement: () => ({ classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, appendChild() {}, removeChild() {} }),
      addEventListener() {},
      body: { appendChild() {}, removeChild() {} }
    }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  const missing = [];
  for (const file of files) {
    const src = read(file);
    if (src === null) { missing.push(file); continue; }
    try {
      vm.runInContext(src, sandbox, { filename: file });
    } catch (err) {
      return { sandbox, missing, error: { file, err } };
    }
  }
  return { sandbox, missing };
}

function main() {
  log('\n鲛人数据库 · 数据与结构校验\n' + '='.repeat(48));

  /* ---------- 必备文件 ---------- */
  const coreFiles = [
    'index.html', 'data/schema.js', 'js/core.js', 'js/app.js', 'js/figures.js',
    'js/pages/home.js', 'js/pages/about.js', 'css/base.css', 'css/components.css',
    'css/pages-home.css', 'css/pages-db.css', 'css/pages-viz.css', 'docs/CONVENTIONS.md'
  ];
  const pageFiles = ['js/pages/db.js', 'js/pages/entry.js', 'js/pages/compare.js', 'js/pages/timeline.js', 'js/pages/terms.js'];
  log('\n[结构]');
  coreFiles.forEach((f) => { if (!read(f)) fail('缺少文件：' + f); });
  pageFiles.forEach((f) => { if (!read(f)) (STRICT ? fail : warn)('缺少页面文件：' + f); });

  /* ---------- 装载数据 ---------- */
  log('\n[数据装载]');
  const dataFiles = ['data/schema.js', 'data/entries-cn.js', 'data/entries-global.js', 'data/bibliography.js', 'js/figures.js', 'js/core.js'];
  const loaded = loadScripts(dataFiles);
  if (loaded.missing && loaded.missing.length) {
    log('  （尚未出现：' + loaded.missing.join('、') + '，跳过相关校验）');
  }
  if (loaded.error) {
    fail(loaded.error.file + ' 语法或运行错误：' + loaded.error.err.message);
    summary();
    return;
  }
  const win = loaded.sandbox;
  const S = win.JR_SCHEMA;
  const entries = (win.JR_DATA && win.JR_DATA.entries) || [];
  if (!S) { fail('JR_SCHEMA 未定义'); summary(); return; }

  log('  条目总数：' + entries.length);
  if (!entries.length) fail('没有任何条目（data/entries-*.js 未提供数据）');

  /* ---------- 字段校验 ---------- */
  log('\n[字段校验]');
  const kindIds = S.kinds.map((k) => k.id);
  const subtypeIds = S.subtypes || [];
  const cultureIds = S.cultures.map((c) => c.id);
  const mediumIds = S.mediums.map((m) => m.id);
  const confidenceIds = S.confidences.map((c) => c.id);
  const traitIds = new Set(S.traits.map((t) => t.id));
  const idSeen = new Set();
  const entryIds = new Set(entries.map((e) => e && e.id));
  let summaryLenBad = 0, sigLenBad = 0, noSource = 0, noTrait = 0, relMissing = 0;

  entries.forEach((e) => {
    const tag = e && e.id ? e.id : '（无 id 条目）';
    if (!e || typeof e !== 'object') { fail('条目不是对象'); return; }
    if (!e.id || !/^(cn|gl)-[a-z0-9-]+$/.test(e.id)) fail(tag + '：id 应为 cn-/gl- 前缀的小写连字符串');
    if (idSeen.has(e.id)) fail(tag + '：id 重复'); else idSeen.add(e.id);
    if (!e.title) fail(tag + '：缺少 title');
    if (!e.work) fail(tag + '：缺少 work');
    if (!e.eraLabel) fail(tag + '：缺少 eraLabel');
    if (!e.dateDisplay) fail(tag + '：缺少 dateDisplay');
    if (e.year !== null && typeof e.year !== 'number') fail(tag + '：year 必须是数字或 null');
    if (!kindIds.includes(e.kind)) fail(tag + '：kind 非法（' + e.kind + '）');
    if (e.subtype && subtypeIds.length && !subtypeIds.includes(e.subtype)) fail(tag + '：subtype 非法（' + e.subtype + '）');
    if (!cultureIds.includes(e.culture)) fail(tag + '：culture 非法（' + e.culture + '）');
    if (e.medium && !mediumIds.includes(e.medium)) fail(tag + '：medium 非法（' + e.medium + '）');
    if (!confidenceIds.includes(e.confidence)) fail(tag + '：confidence 非法（' + e.confidence + '）');
    if (!e.term || !e.term.primary) fail(tag + '：缺少 term.primary');
    if (!Array.isArray(e.traits) || e.traits.length < 1) { noTrait++; warn(tag + '：没有特征编码'); }
    else {
      e.traits.forEach((t) => {
        if (!traitIds.has(t)) { fail(tag + '：未知 trait ' + t); return; }
        if (t.indexOf('f_') === 0) fail(tag + '：traits 混入叙事功能 id（' + t + '），应放入 narratives');
        else if (t.indexOf('m_') !== 0 && t.indexOf('b_') !== 0) fail(tag + '：trait 前缀非法（' + t + '）');
      });
      if (e.traits.length > 8) warn(tag + '：traits 超过 8 项');
      if (new Set(e.traits).size !== e.traits.length) warn(tag + '：traits 有重复');
    }
    if (!Array.isArray(e.narratives) || e.narratives.length < 1) warn(tag + '：没有叙事功能编码');
    else {
      e.narratives.forEach((n) => {
        if (!traitIds.has(n)) { fail(tag + '：未知 narrative ' + n); return; }
        if (n.indexOf('f_') !== 0) fail(tag + '：narratives 混入非叙事功能 id（' + n + '）');
      });
      if (e.narratives.length > 3) warn(tag + '：narratives 超过 3 项');
    }
    if (!Array.isArray(e.sources) || !e.sources.length) { noSource++; warn(tag + '：没有登记出处'); }
    else if (!e.sources.every((s) => s && s.label)) fail(tag + '：sources 项缺少 label');
    if (typeof e.summary !== 'string' || e.summary.length < 80) { summaryLenBad++; warn(tag + '：summary 偏短（' + (e.summary || '').length + ' 字）'); }
    if (typeof e.significance !== 'string' || e.significance.length < 40) { sigLenBad++; warn(tag + '：significance 偏短（' + (e.significance || '').length + ' 字）'); }
    if (e.kind === 'translation' && !(e.term && e.term.original)) warn(tag + '：译名/译本条目缺少 term.original');
    (e.related || []).forEach((rid) => { if (!entryIds.has(rid)) { relMissing++; warn(tag + '：related 指向不存在的 id ' + rid); } });
    if (e.figure && win.JR_FIGURES && !win.JR_FIGURES[e.figure]) warn(tag + '：figure 键不存在 ' + e.figure);
    if (e.excerpt && e.excerpt.length > 800) warn(tag + '：excerpt 超过 800 字');
    if (e.dateDisplay && /\u2014/.test(e.dateDisplay)) warn(tag + '：dateDisplay 含破折号，建议改用「至」');
    /* 空引文政策：文本类必填，作品信息类可空但须说明 */
    const textMedium = ['典籍', '图像', '诗歌', '译名'].includes(e.medium);
    const textKind = e.kind === 'ancient';
    if (!e.excerpt || !e.excerpt.trim()) {
      if (textMedium || textKind) warn(tag + '：文本类条目缺少 excerpt');
      else {
        const noteText = (e.summary || '') + ' ' + ((e.term && e.term.note) || '');
        if (noteText.indexOf('无原文引文') < 0) warn(tag + '：空引文条目未注明「无原文引文」');
      }
    }
  });

  /* ---------- 分布 ---------- */
  log('\n[分布]');
  const by = (fn) => entries.reduce((m, e) => { const k = fn(e) || '（空）'; m[k] = (m[k] || 0) + 1; return m; }, {});
  log('  类型：' + JSON.stringify(by((e) => S.kindById[e.kind] || e.kind)));
  log('  谱系：' + JSON.stringify(by((e) => e.culture)));
  log('  置信度：' + JSON.stringify(by((e) => e.confidence)));
  const years = entries.map((e) => e.year).filter((y) => typeof y === 'number');
  if (years.length) log('  年代：' + Math.min(...years) + ' 至 ' + Math.max(...years));
  const yb = {};
  entries.forEach((e) => { const k = e.kind; yb[k] = (yb[k] || 0) + 1; });
  if (yb.ancient && yb.ancient < 12) warn('ancient 条目偏少：' + yb.ancient);
  if (yb.translation && yb.translation < 6) warn('translation 条目偏少：' + yb.translation);
  if (yb.modern && yb.modern < 10) warn('modern 条目偏少：' + yb.modern);

  /* ---------- 文本卫生 ---------- */
  log('\n[文本卫生]');
  const allStrings = [];
  const walk = (v, where) => {
    if (typeof v === 'string') allStrings.push({ s: v, where });
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, where + '[' + i + ']'));
    else if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k], where + '.' + k));
  };
  entries.forEach((e) => walk(e, e.id));
  const badTokens = ['undefined', 'NaN', 'lorem', 'TODO', '待填'];
  badTokens.forEach((tok) => {
    const re = new RegExp('(^|[^A-Za-z0-9_])' + tok + '([^A-Za-z0-9_]|$)', tok === 'NaN' || tok === 'TODO' ? '' : 'i');
    const hits = allStrings.filter((x) => re.test(x.s));
    if (hits.length) warn('发现占位/异常标记「' + tok + '」：' + hits.slice(0, 3).map((x) => x.where).join(', '));
  });

  /* ---------- 参考书目 ---------- */
  log('\n[参考书目]');
  const bib = win.JR_BIB || [];
  log('  书目条数：' + bib.length);
  if (!bib.length) warn('data/bibliography.js 为空');
  const bibIds = new Set();
  bib.forEach((b, i) => {
    const tag = b && b.id ? b.id : '#index-' + i;
    if (!b || !b.title) fail('书目 ' + tag + ' 缺 title');
    if (b && b.id && bibIds.has(b.id)) fail('书目 id 重复：' + b.id);
    if (b && b.id) bibIds.add(b.id);
    if (b && b.author && b.year && !/^\d{4}$/.test(String(b.year))) warn('书目 ' + tag + '：year 非四位数字（' + b.year + '）');
  });

  /* ---------- 页面脚本语法 ---------- */
  log('\n[页面脚本]');
  pageFiles.concat(['js/pages/home.js', 'js/pages/about.js']).forEach((f) => {
    const src = read(f);
    if (!src) return;
    try { new vm.Script(src, { filename: f }); }
    catch (err) { fail(f + ' 语法错误：' + err.message); }
  });

  summary();
}

function summary() {
  log('\n' + '='.repeat(48));
  if (failures) log('结果：' + failures + ' 项失败，' + warnings + ' 项提醒。');
  else log('结果：通过。' + (warnings ? '（' + warnings + ' 项提醒，建议逐条查看）' : ''));
  process.exitCode = failures ? 1 : 0;
}

main();
