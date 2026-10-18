#!/usr/bin/env node
/* ==========================================================================
   导出数据为 JSON，供 tools/build-xlsx.py 生成离线表格
   用法：node tools/export-json.js
   输出：tools/_out/entries.json、tools/_out/bibliography.json、tools/_out/schema.json
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, '_out');
fs.mkdirSync(OUT, { recursive: true });

function load(files) {
  const sandbox = { console };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  for (const file of files) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) { console.warn('缺少文件，跳过：' + file); continue; }
    vm.runInContext(fs.readFileSync(full, 'utf8'), sandbox, { filename: file });
  }
  return sandbox;
}

const win = load(['data/schema.js', 'data/entries-cn.js', 'data/entries-global.js', 'data/bibliography.js']);
const entries = (win.JR_DATA && win.JR_DATA.entries) || [];
const bib = win.JR_BIB || [];
const schema = win.JR_SCHEMA || {};

entries.sort((a, b) => {
  const ya = typeof a.year === 'number' ? a.year : 9999;
  const yb = typeof b.year === 'number' ? b.year : 9999;
  return ya - yb;
});

fs.writeFileSync(path.join(OUT, 'entries.json'), JSON.stringify(entries, null, 2), 'utf8');
fs.writeFileSync(path.join(OUT, 'bibliography.json'), JSON.stringify(bib, null, 2), 'utf8');
fs.writeFileSync(path.join(OUT, 'schema.json'), JSON.stringify(schema, null, 2), 'utf8');

const byKind = entries.reduce((m, e) => { m[e.kind] = (m[e.kind] || 0) + 1; return m; }, {});
console.log('entries=' + entries.length, JSON.stringify(byKind), 'bib=' + bib.length);
console.log('输出目录：' + OUT);
