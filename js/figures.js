/* ==========================================================================
   鲛人研究数据库 · 示意图版
   包括本地 AI 创作插画与内联 SVG 示意图。
   使用：JR.figure('jiao-ren')；键名见 window.JR_FIGURES。
   ========================================================================== */
(function (global) {
  'use strict';

  var ATTR = 'fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var script = global.document && global.document.currentScript;
  var assetRoot = script ? new URL('../assets/', script.src).href : 'assets/';

  var FIGURES = {};

  /* 中国谱系：人首鱼身、织绡、泣珠 */
  FIGURES['jiao-ren'] =
    '<img class="figure__image" src="' + assetRoot + 'jiaoren-720.webp" width="720" height="540" loading="lazy" decoding="async" alt="手执薄绡、鱼尾卷在海浪里的鲛人">';

  /* 希腊古风：人首鸟身塞壬（示意） */
  FIGURES['siren-bird'] =
    '<img class="figure__image" src="' + assetRoot + 'siren.webp" width="800" height="600" loading="lazy" decoding="async" alt="陶绘风格的虚构图像，表现人首鸟身的塞壬">';

  /* 中世纪塞壬：鱼尾、镜与梳 */
  FIGURES['siren-fish'] =
    '<svg viewBox="0 0 240 280" ' + ATTR + '>' +
    '<g opacity=".5"><path d="M16 252c30-8 52 6 82-1s48 6 76-1 36 3 50-2"/></g>' +
    '<path d="M120 30c12 0 21 8 21 19s-9 19-21 19-21-9-21-19 9-19 21-19Z"/>' +
    '<path d="M101 40c-7 12-6 26 2 38M98 50c-9 15-9 30 0 43M139 40c7 12 6 26-2 38M142 50c9 15 9 30 0 43"/>' +
    '<path d="M112 49h.01M128 49h.01" stroke-width="2.2"/><path d="M117 58c2 2 4 2 6 0" opacity=".8"/>' +
    '<path d="M111 68v10M129 68v10"/>' +
    '<path d="M111 78c-13 3-22 12-26 26M129 78c13 3 22 12 26 26"/>' +
    '<path d="M85 104c-2 14 0 24 4 34M155 104c2 14 0 24-4 34"/>' +
    '<path d="M89 138c9 7 20 11 31 11s22-4 31-11v10c-9 7-20 11-31 11s-22-4-31-11v-10Z" opacity=".7"/>' +
    '<path d="M86 108c-12 4-24 0-30-10-4-6-5-13-3-20l16 8c-2 12 5 20 17 22Z"/>' +
    '<path d="M154 108c12 4 24 0 30-10 4-6 5-13 3-20l-16 8c2 12-5 20-17 22Z"/>' +
    '<circle cx="62" cy="70" r="13"/><path d="M62 83v18M54 96h16" opacity=".85"/>' +
    '<path d="M178 62h10v8h-10zM178 70v9M181 70v9M185 70v9M188 70v9" opacity=".9"/>' +
    '<path d="M120 160c-2 16-6 30-12 42M120 160c2 16 6 30 12 42"/>' +
    '<path d="M108 200c4 10 8 20 10 30M132 200c-4 10-8 20-10 30"/>' +
    '<path d="M118 232c-20 4-38 14-50 30 18 0 34 6 46 18 4-18 10-34 18-46M122 232c20 4 38 14 50 30-18 0-34 6-46 18-4-18-10-34-18-46"/>' +
    '<g opacity=".5"><path d="M106 172q14 8 28 0M103 184q17 9 34 0M101 196q18 10 38 0"/></g>' +
    '</svg>';

  /* 近现代：长发文身美人鱼（示意） */
  FIGURES['mermaid'] =
    '<img class="figure__image" src="' + assetRoot + 'mermaid.webp" width="800" height="600" loading="lazy" decoding="async" alt="版画风格的海景，美人鱼坐在浪间的礁石上">';

  /* 日本谱系：人鱼（鱼身人头，长发） */
  FIGURES['ningyo'] =
    '<svg viewBox="0 0 280 200" ' + ATTR + '>' +
    '<g opacity=".5"><path d="M16 170c40-8 68 6 108 0s72 5 108-2 28 2 32-1"/></g>' +
    '<path d="M62 54c10 0 17 7 17 16s-7 16-17 16-17-7-17-16 7-16 17-16Z"/>' +
    '<path d="M48 62c-7 10-8 22-3 34M44 72c-8 12-8 24-2 34M76 62c7 10 8 22 3 34M80 72c8 12 8 24 2 34"/>' +
    '<path d="M55 70h.01M69 70h.01" stroke-width="2"/><path d="M61 78c2 1 4 1 6 0"/>' +
    '<path d="M62 86c-8 6-14 14-16 24"/>' +
    '<path d="M70 92c16 0 34 2 54 8 26 8 54 10 82 6 14-2 26-2 38 2" opacity=".9"/>' +
    '<path d="M70 92c18 12 38 18 62 18 28 0 52-6 74-16" opacity=".55"/>' +
    '<path d="M70 92c-4 14 0 26 10 36 12 8 28 10 46 6" opacity=".8"/>' +
    '<path d="M206 108c14 2 28 8 42 18-12 10-20 22-24 36-8-16-20-28-36-36 8-4 14-10 18-18Z" opacity=".9"/>' +
    '<path d="M180 112c6 12 8 24 6 36M190 114c8 10 12 22 12 34" opacity=".5"/>' +
    '<g opacity=".5"><path d="M100 100q14 8 28 2M118 106q16 8 32 2M140 108q16 6 32 0M162 108q14 4 28 0"/></g>' +
    '<path d="M102 172c24-6 48 4 74-2s40 4 58-2" opacity=".45"/>' +
    '</svg>';

  /* 纹章/商业：双尾塞壬 */
  FIGURES['dual-tail'] =
    '<svg viewBox="0 0 220 280" ' + ATTR + '>' +
    '<path d="M110 26c11 0 19 8 19 18s-8 18-19 18-19-8-19-18 8-18 19-18Z"/>' +
    '<path d="M93 34c-6 10-6 22 1 32M91 43c-8 12-8 24 0 34M127 34c6 10 6 22-1 32M129 43c8 12 8 24 0 34"/>' +
    '<path d="M103 44h.01M117 44h.01" stroke-width="2"/><path d="M108 54c2 1 4 1 6 0"/>' +
    '<path d="M103 62v10M117 62v10"/>' +
    '<path d="M103 72c-12 4-20 14-22 28M117 72c12 4 20 14 22 28"/>' +
    '<path d="M82 98c-2 16-8 30-18 44M138 98c2 16 8 30 18 44"/>' +
    '<path d="M84 140c10 7 18 10 28 10s18-3 26-10" opacity=".8"/>' +
    '<path d="M110 150c-2 20-6 38-12 54M110 150c2 20 6 38 12 54"/>' +
    '<path d="M98 204c-18 6-32 18-40 36 16-2 30 2 40 12 4-18 10-34 18-48M122 204c18 6 32 18 40 36-16-2-30 2-40 12-4-18-10-34-18-48"/>' +
    '<path d="M76 92c-14 0-26 6-34 18 10 2 18 8 22 18 2-12 6-24 12-36M144 92c14 0 26 6 34 18-10 2-18 8-22 18-2-12-6-24-12-36" opacity=".8"/>' +
    '<path d="M60 152c-14 10-22 24-24 40M160 152c14 10 22 24 24 40" opacity=".5"/>' +
    '<g opacity=".45"><path d="M96 166q14 8 28 0M94 178q16 9 32 0M92 190q18 10 36 0"/></g>' +
    '</svg>';

  /* 珠 */
  FIGURES['pearl'] =
    '<svg viewBox="0 0 200 200" ' + ATTR + '>' +
    '<path d="M40 140c10 6 18 14 22 26 12-8 24-12 38-12s26 4 38 12c4-12 12-20 22-26" opacity=".7"/>' +
    '<path d="M22 150c34 10 60 10 92 6s50-2 64 4" opacity=".45"/>' +
    '<path d="M100 36c22 0 38 16 38 36 0 22-20 38-38 52-18-14-38-30-38-52 0-20 16-36 38-36Z"/>' +
    '<path d="M100 50c11 0 20 8 20 19 0 12-11 23-20 31-9-8-20-19-20-31 0-11 9-19 20-19Z" opacity=".45"/>' +
    '<path d="M100 14v10M100 166v10M64 24l6 9M136 24l-6 9M46 60l10 4M154 60l-10 4" opacity=".5"/>' +
    '</svg>';

  /* 装饰水线 */
  FIGURES['wave'] =
    '<svg viewBox="0 0 480 80" ' + ATTR + ' preserveAspectRatio="none">' +
    '<path d="M0 42c26-12 50 12 78 0s52 12 80 0 52 12 80 0 52 12 80 0 52 12 80 0 52 12 82 0"/>' +
    '<path d="M0 56c26-12 50 12 78 0s52 12 80 0 52 12 80 0 52 12 80 0 52 12 80 0 52 12 82 0" opacity=".55"/>' +
    '<path d="M0 70c26-12 50 12 78 0s52 12 80 0 52 12 80 0 52 12 80 0 52 12 80 0 52 12 82 0" opacity=".3"/>' +
    '</svg>';

  global.JR_FIGURES = FIGURES;
  global.JR_FIGURE_ASSET_ROOT = assetRoot;
  global.JR_GENERATED_FIGURES = ['jiao-ren', 'siren-bird', 'mermaid'];
})(window);
