/* ==========================================================================
   鲛人研究数据库 · 数据字典与全局数据容器
   加载顺序：本文件必须最先加载（index.html 中位于所有 data/*.js 之前）。
   数据文件只向 window.JR_DATA.entries / window.JR_BIB 追加内容，不定义函数。
   ========================================================================== */
(function () {
  'use strict';

  window.JR_DATA = window.JR_DATA || { entries: [] };
  window.JR_BIB = window.JR_BIB || [];
  if (!window.JR_DATA.meta) {
    window.JR_DATA.meta = {
      title: '从鲛人到美人鱼',
      subtitle: '关于神话形象的跨文化重构的可视化研究',
      dataUpdated: '2026-10'
    };
  }

  var TRAITS = [
    /* ---- 形态 ---- */
    { id: 'm_human_upper', group: '形态', label: '人形上半身', desc: '头、颈、躯干或手臂呈人形；明确为人首/人面。' },
    { id: 'm_fish_tail', group: '形态', label: '鱼尾', desc: '下半身为鱼尾或鱼形，无足；可含「人面鱼身」「无足」等表述。' },
    { id: 'm_bird_body', group: '形态', label: '人首鸟身', desc: '具鸟身、鸟翼或鸟足；古希腊古风时期塞壬的典型形态。' },
    { id: 'm_twin_tail', group: '形态', label: '双尾', desc: '两条鱼尾并列，常见于中世纪纹章与近现代商业标志。' },
    { id: 'm_scaled', group: '形态', label: '覆鳞', desc: '皮肤覆有鳞片，或文本/图像明确描写鳞状皮肤。' },
    { id: 'm_beauty', group: '形态', label: '美色长发', desc: '容貌美丽、长发、肌肤白皙等外貌修饰，构成「美」的视觉编码。' },
    { id: 'm_shapeshift', group: '形态', label: '可化人形', desc: '能变化为人形、长出双腿，或人形与鱼形之间转换。' },
    { id: 'm_giant', group: '形态', label: '巨大化', desc: '体型明显大于常人，常与神性、古代兵器或海洋力量相关。' },
    { id: 'm_gender_ambig', group: '形态', label: '性别模糊', desc: '性别不明、可男可女，或形象同时具备两性特征。' },

    /* ---- 能力与行为 ---- */
    { id: 'b_tears_pearl', group: '能力', label: '泣珠', desc: '眼泪化为珍珠；包括「泣而成珠」「鲛人泪」及其当代变体。' },
    { id: 'b_weave_silk', group: '能力', label: '织绡', desc: '织造鲛绡、龙纱、鲛绡纱等水中织物，入水不濡。' },
    { id: 'b_siren_song', group: '能力', label: '歌声魅惑', desc: '以歌声迷惑、引诱或伤害听者。' },
    { id: 'b_predator', group: '能力', label: '捕食人类', desc: '主动捕食、拖拽或杀害人类，多与「美丽而危险」并置。' },
    { id: 'b_underwater_realm', group: '能力', label: '水下居所', desc: '居于海中、水下宫殿、龙宫或独立水下文明。' },
    { id: 'b_trade', group: '能力', label: '交易寄居', desc: '与人类市易、寄居人家、以织物或珠换取器物。' },
    { id: 'b_flesh_immortal', group: '能力', label: '食肉长生', desc: '食其肉可获长生不老，常带禁忌与代价。' },
    { id: 'b_oil_lamp', group: '能力', label: '鲛人膏', desc: '脂膏可制长明灯、燃料，或尸体被提炼利用。' },
    { id: 'b_return_favor', group: '能力', label: '报恩馈赠', desc: '受人类恩惠而报恩，赠珠、赠绡或相助。' },
    { id: 'b_love_human', group: '能力', label: '跨类婚恋', desc: '与人类恋爱、婚配、生育后代。' },
    { id: 'b_soul_quest', group: '能力', label: '求取灵魂', desc: '追求不灭灵魂、救赎或进入人类伦理秩序。' },
    { id: 'b_sacrifice_foam', group: '能力', label: '牺牲化沫', desc: '为爱牺牲，化为泡沫、海沫或消散。' },
    { id: 'b_voice_trade', group: '能力', label: '以声换形', desc: '以声音、舌头或歌喉交换双腿/人形，随即失声。' },
    { id: 'b_captured', group: '能力', label: '被捕展演', desc: '被捕获、买卖、展览、猎杀或作为原料采集。' },
    { id: 'b_omen', group: '能力', label: '灾异预兆', desc: '出现即预示灾异，或具有预言能力。' },
    { id: 'b_ecology', group: '能力', label: '生态受难', desc: '作为环境破坏、污染、开发的受害者出现。' },
    { id: 'b_sacred', group: '能力', label: '神性祭祀', desc: '具神格、受祭祀，或与海神、水神体系相关。' },

    /* ---- 叙事功能 ---- */
    { id: 'f_temptation', group: '叙事', label: '诱惑与危险', desc: '美丽与危险并存，引诱人走向毁灭或偏离航路。' },
    { id: 'f_gratitude', group: '叙事', label: '报恩与馈赠', desc: '受恩报恩、赠珠赠绡，构成人与异类的交换伦理。' },
    { id: 'f_love_sacrifice', group: '叙事', label: '爱情与牺牲', desc: '跨类之爱以牺牲、失声、化沫或死亡告终。' },
    { id: 'f_marriage', group: '叙事', label: '异类婚恋', desc: '异类通婚、成家、生育，涉及族群边界与后代问题。' },
    { id: 'f_immortality', group: '叙事', label: '长生与禁忌', desc: '长生、不死、食肉禁忌及其代价。' },
    { id: 'f_commodity', group: '叙事', label: '商品化与展演', desc: '被商品化、猎奇展演、商业利用或品牌化。' },
    { id: 'f_encounter', group: '叙事', label: '异类接触', desc: '人与异类相遇、认知冲突与相互凝视。' },
    { id: 'f_omen', group: '叙事', label: '灾异与预言', desc: '作为征兆、预言或政治灾异叙事的一部分。' },
    { id: 'f_ecology', group: '叙事', label: '生态批判', desc: '环境破坏、物种存续与生态伦理。' },
    { id: 'f_identity', group: '叙事', label: '身份认同', desc: '跨类身份、自我认同、归属与边界。' },
    { id: 'f_voice', group: '叙事', label: '声音政治', desc: '声音、沉默、表达权与倾听关系的争夺。' },
    { id: 'f_salvation', group: '叙事', label: '救赎与灵魂', desc: '灵魂得救、宗教救赎、不朽与死亡观。' },
    { id: 'f_colonial', group: '叙事', label: '殖民与他者化', desc: '异域想象、殖民观看、他者化与展示政治。' }
  ];

  var NARRATIVES = TRAITS.filter(function (t) { return t.group === '叙事'; });
  var ABILITIES = TRAITS.filter(function (t) { return t.group === '能力'; });

  window.JR_SCHEMA = {
    title: '从鲛人到美人鱼',
    subtitle: '关于神话形象的跨文化重构的可视化研究',
    projectTitle: '从鲛人到美人鱼——关于神话形象的跨文化重构的可视化研究',
    version: '1.0',
    questions: [
      { n: '名称', q: '名称如何滑动：从「鲛人」到「人鱼」「美人鱼」，再到「塞壬」「Siren」「mermaid」，译名与类属如何互相覆盖？' },
      { n: '外形', q: '外形如何趋同：人首鱼身、鸟身塞壬、双尾、鱼尾人形，哪些特征在跨媒介传播中被保留、合并或删除？' },
      { n: '功能', q: '叙事功能如何重组：泣珠、织绡、报恩、诱惑、牺牲、生态批判，功能如何随媒介与意识形态迁移？' },
      { n: '机制', q: '变化机制：翻译、宗教、印刷、影视与游戏工业、旅游与品牌，各自如何参与形象的再编码？' }
    ],
    kinds: [
      { id: 'ancient', label: '古籍与古典图像' },
      { id: 'translation', label: '译名与译本' },
      { id: 'modern', label: '当代作品与论评' }
    ],
    subtypes: [
      '志怪', '地理志', '类书', '笔记杂史', '诗文', '辞书译名', '译本', '童话',
      '长篇小说', '影视', '动画', '游戏', '舞台', '图像器物', '品牌商业', '学术评论', '民间传说', '医书'
    ],
    mediums: [
      { id: '典籍', label: '典籍' }, { id: '图像', label: '图像' }, { id: '诗歌', label: '诗歌' },
      { id: '影视', label: '影视' }, { id: '动画', label: '动画' }, { id: '游戏', label: '游戏' },
      { id: '舞台', label: '舞台' }, { id: '商业', label: '商业' }, { id: '译名', label: '译名' }, { id: '学术', label: '学术' }
    ],
    cultures: [
      { id: '中国', label: '中国' }, { id: '西方', label: '西方' },
      { id: '东亚', label: '东亚' }, { id: '跨文化', label: '跨文化' }
    ],
    regions: [
      '中国', '古希腊', '古罗马', '地中海', '西欧', '北欧', '日本', '朝鲜半岛', '韩国',
      '美国', '全球', '跨区域'
    ],
    confidences: [
      { id: '确证', label: '确证', desc: '可直接核对原文/官方信息。' },
      { id: '版本存异', label: '版本存异', desc: '存在版本、异文或归属争议，已在条目中注明。' },
      { id: '待核', label: '待核', desc: '线索可靠但尚未逐字核对，引用前须复核。' }
    ],
    traitGroups: [
      { id: '形态', label: '形态' },
      { id: '能力', label: '能力' },
      { id: '叙事', label: '叙事' }
    ],
    traits: TRAITS,
    abilities: ABILITIES,
    narratives: NARRATIVES,
    traitById: TRAITS.reduce(function (m, t) { m[t.id] = t; return m; }, {}),
    kindById: { ancient: '古籍与古典图像', translation: '译名与译本', modern: '当代作品与论评' },
    mediaById: { 典籍: '典籍', 图像: '图像', 诗歌: '诗歌', 影视: '影视', 动画: '动画', 游戏: '游戏', 舞台: '舞台', 商业: '商业', 译名: '译名', 学术: '学术' },
    /* 比较/筛选界面上按主题分组的推荐特征组合，供页面复用 */
    traitPresets: [
      { label: '泣珠与织绡', ids: ['b_tears_pearl', 'b_weave_silk'] },
      { label: '半人半鱼', ids: ['m_human_upper', 'm_fish_tail'] },
      { label: '鸟身塞壬', ids: ['m_bird_body'] },
      { label: '诱惑危险', ids: ['b_siren_song', 'b_predator', 'f_temptation'] },
      { label: '爱情牺牲', ids: ['b_love_human', 'b_sacrifice_foam', 'f_love_sacrifice'] },
      { label: '长生禁忌', ids: ['b_flesh_immortal', 'f_immortality'] },
      { label: '商品展演', ids: ['b_captured', 'f_commodity'] },
      { label: '生态受难', ids: ['b_ecology', 'f_ecology'] }
    ]
  };
})();
