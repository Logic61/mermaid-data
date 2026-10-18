#!/usr/bin/env node
/* ==========================================================================
   DOM 无关渲染冒烟测试
   在 Node 中装载 schema/数据/核心/页面脚本，调用每页 render()，检查：
   - 能否返回非空 HTML 字符串
   - 是否包含 undefined / NaN / [object Object] / TODO / lorem 等异常输出
   - 站内 #/ 链接是否指向已注册页面或存在的条目 id
   用法：node tools/render-check.js
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let failures = 0;
let warnings = 0;
const log = (...a) => console.log(...a);
const fail = (msg) => { failures++; log('  ✗ ' + msg); };
const warn = (msg) => { warnings++; log('  ! ' + msg); };

function read(file) {
  const full = path.join(ROOT, file);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
}

function makeSandbox() {
  const sandbox = {
    console: { log: () => {}, warn: () => {}, error: () => {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    location: { hash: '#/' },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    dispatchEvent: () => {},
    matchMedia: () => ({ matches: false }),
    CustomEvent: function (type, opts) { this.type = type; this.detail = opts && opts.detail; },
    navigator: { clipboard: null },
    history: { replaceState: () => {} },
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
  return sandbox;
}

function run(sandbox, file) {
  const src = read(file);
  if (src === null) return { skipped: true };
  try {
    vm.runInContext(src, sandbox, { filename: file });
    return { ok: true };
  } catch (err) {
    return { error: err, file };
  }
}

const PAGE_FILES = [
  'js/pages/home.js',
  'js/pages/db.js',
  'js/pages/entry.js',
  'js/pages/compare.js',
  'js/pages/timeline.js',
  'js/pages/terms.js',
  'js/pages/about.js'
];

function main() {
  log('\n鲛人数据库 · 渲染冒烟测试\n' + '='.repeat(48));

  const sandbox = makeSandbox();
  const preload = ['data/schema.js', 'data/entries-cn.js', 'data/entries-global.js', 'data/bibliography.js', 'js/figures.js', 'js/core.js'];
  for (const file of preload) {
    const result = run(sandbox, file);
    if (result.skipped) { warn('跳过缺失文件：' + file); continue; }
    if (result.error) { fail(file + ' 装载失败：' + result.error.message); return finish(); }
  }

  const JR = sandbox.JR;
  if (!JR) { fail('window.JR 未定义'); return finish(); }
  JR.installEntries(sandbox.JR_DATA.entries || []);
  log('  已装载条目：' + JR.entries.length + ' 条');
  if (!JR.entries.length) warn('没有条目，页面将进入空状态（仍测试可渲染性）');

  for (const file of PAGE_FILES) {
    const result = run(sandbox, file);
    if (result.skipped) { warn('跳过缺失页面：' + file); continue; }
    if (result.error) { fail(file + ' 装载失败：' + result.error.message); }
  }

  const ids = JR.entries.map((e) => e.id);
  const first = ids[0] || 'missing-id';
  const sampleIds = ids.slice(0, 3);
  const routeSet = new Set(['', 'db', 'entry', 'compare', 'timeline', 'terms', 'about']);

  const cases = [
    { page: 'home', params: {}, args: {} },
    { page: 'db', params: {}, args: {} },
    { page: 'db', params: { q: '鲛', culture: '中国', traits: 'b_tears_pearl', sort: 'year-desc' }, args: {} },
    { page: 'entry', params: {}, args: { id: first } },
    { page: 'entry', params: {}, args: { id: 'not-exist-id' } },
    { page: 'compare', params: {}, args: {} },
    { page: 'compare', params: { ids: sampleIds.join(',') }, args: {} },
    { page: 'timeline', params: {}, args: {} },
    { page: 'terms', params: {}, args: {} },
    { page: 'about', params: {}, args: {} }
  ];

  log('\n[页面渲染]');
  for (const c of cases) {
    const page = JR.pages[c.page];
    const tag = c.page + (c.args.id ? ' id=' + c.args.id : '') + (c.params.ids ? ' ids=' + c.params.ids : '');
    if (!page) { warn('页面未注册：' + c.page); continue; }
    let html;
    try {
      html = page.render(c.params || {}, c.args || {});
    } catch (err) {
      fail(tag + ' render 抛错：' + (err && err.message));
      continue;
    }
    if (typeof html !== 'string') { fail(tag + ' render 未返回字符串'); continue; }
    if (html.length < 100) fail(tag + ' 返回内容过短（' + html.length + ' 字符）');

    ['undefined', 'NaN', '[object Object]', 'TODO', 'lorem', '待填'].forEach((token) => {
      if (html.toLowerCase().includes(token.toLowerCase())) fail(tag + ' 输出包含异常标记「' + token + '」');
    });
    if ((html.match(/<h1[\s>]/g) || []).length !== 1) warn(tag + ' 页面 h1 数量不是 1');
    if (/onclick=|onchange=|oninput=/.test(html)) fail(tag + ' 使用了内联事件属性');
    if (/<script/i.test(html)) fail(tag + ' 输出中包含 <script>');

    // 站内链接检查
    const hrefs = Array.from(html.matchAll(/href="#\/([^"?]+)(?:\?[^"]*)?"/g)).map((m) => m[1]);
    hrefs.forEach((href) => {
      const seg = href.replace(/^\/+|\/+$/g, '');
      const firstSeg = seg.split('/')[0];
      if (!firstSeg) return;
      if (!routeSet.has(firstSeg)) fail(tag + ' 链接指向未知路由：' + href);
      if (firstSeg === 'entry') {
        const id = decodeURIComponent(seg.split('/')[1] || '');
        if (id && ids.indexOf(id) < 0) warn(tag + ' 链接指向不存在的条目：' + id);
      }
    });
    const zeroLinks = Array.from(html.matchAll(/href="#\/entry\/([^"?]+)/g)).length;
    log('  · ' + tag.padEnd(42, ' ') + String(html.length).padStart(7) + ' 字符，' + zeroLinks + ' 个条目链接');
  }

  finish();
}

function finish() {
  log('\n' + '='.repeat(48));
  if (failures) log('结果：' + failures + ' 项失败，' + warnings + ' 项提醒。');
  else log('结果：通过。' + (warnings ? '（' + warnings + ' 项提醒）' : ''));
  process.exitCode = failures ? 1 : 0;
}

main();
