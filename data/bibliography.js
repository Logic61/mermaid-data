/* ==========================================================================
   鲛人研究数据库 · 参考书目（JR_BIB）
   用途：docs/参考书目.md 的数据源，供网站「参考书目」页读取。
   规则：只收能确认版本信息的文献；作者、出版社、年份不得编造；
         不确定者在 note 中写明「版本待核」，宁缺毋滥。
   year 字段为数字：跨年出版物取起始年，实际年份范围写入 note。
   分类取以下六类之一：古籍整理本 / 西方原典与校注 / 译名与译本研究 /
                       神话学与民间文学理论 / 影视游戏与视觉文化研究 / 数字人文方法
   ========================================================================== */
window.JR_BIB = window.JR_BIB || [];
window.JR_BIB.push(
  /* ---- 古籍整理本 ---- */
  {
    id: 'bib-shanhaijing-yuanke',
    author: '袁珂 校注',
    title: '山海经校注',
    year: 1980,
    publisher: '上海古籍出版社',
    note: '《山海经》通行整理本。陵鱼、人鱼等条是古典形态编码的一手依据；注文可参，但不代为定论。',
    url: 'https://ctext.org/shan-hai-jing',
    category: '古籍整理本'
  },
  {
    id: 'bib-soushenji-wang',
    author: '干宝 撰，汪绍楹 校注',
    title: '搜神记',
    year: 1979,
    publisher: '中华书局',
    note: '卷十二鲛人条为「泣珠」「水居」「织绩」编码的直接依据。',
    url: 'https://ctext.org/sou-shen-ji',
    category: '古籍整理本'
  },
  {
    id: 'bib-bowuzhi-fanning',
    author: '张华 撰，范宁 校证',
    title: '博物志校证',
    year: 1980,
    publisher: '中华书局',
    note: '鲛人寄居、卖绡一类记载常被归入此书，实际归属与文字各本有异，须以本书校证与条目 sources 为准。',
    url: '',
    category: '古籍整理本'
  },
  {
    id: 'bib-taipingguangji',
    author: '李昉 等编',
    title: '太平广记',
    year: 1961,
    publisher: '中华书局',
    note: '宋前异闻汇编，检索人鱼、鲛人、海怪材料的类书入口。',
    url: '',
    category: '古籍整理本'
  },
  {
    id: 'bib-yuanke-cidian',
    author: '袁珂 编著',
    title: '中国神话传说词典',
    year: 1985,
    publisher: '上海辞书出版社',
    note: '神话条目工具书，用于定位线索与异说，不替代原文核对。',
    url: '',
    category: '古籍整理本'
  },
  {
    id: 'bib-lijianguo-tangqian',
    author: '李剑国 著',
    title: '唐前志怪小说史',
    year: 1984,
    publisher: '南开大学出版社',
    note: '唐前志怪源流与成书问题的基本参考，用于判断鲛人条的时代与归属。',
    url: '',
    category: '古籍整理本'
  },

  /* ---- 西方原典与校注 ---- */
  {
    id: 'bib-homer-odyssey-loeb',
    author: 'Homer',
    title: 'Odyssey',
    year: 1999,
    publisher: 'Harvard University Press（Loeb Classical Library，A. T. Murray 原译，William F. Wyatt 修订）',
    note: '卷十二塞壬情节的通行希英对照本，歌声、蜡封耳、缚桅杆等细节的核对依据。',
    url: '',
    category: '西方原典与校注'
  },
  {
    id: 'bib-ovid-metamorphoses',
    author: 'Ovid',
    title: 'Metamorphoses',
    year: 1986,
    publisher: 'Oxford University Press（A. D. Melville 英译）',
    note: '变形叙事的通行英译本，用于核对塞壬、水泽女仙等相关段落。',
    url: '',
    category: '西方原典与校注'
  },
  {
    id: 'bib-apollonius-argonautica',
    author: 'Apollonius Rhodius',
    title: 'Argonautica',
    year: 1912,
    publisher: 'Harvard University Press（Loeb Classical Library，R. C. Seaton 英译）',
    note: '卷四塞壬谱系与阿尔戈英雄经过塞壬海域的叙述，是塞壬神性编码的依据之一。',
    url: '',
    category: '西方原典与校注'
  },
  {
    id: 'bib-andersen-1837',
    author: 'Hans Christian Andersen',
    title: 'Eventyr, fortalte for Børn. Første Samling. Tredie Hefte',
    year: 1837,
    publisher: 'C. A. Reitzel（哥本哈根）',
    note: '《海的女儿》（Den lille Havfrue）初版所在册。区分原作与后世改编的依据。',
    url: '',
    category: '西方原典与校注'
  },
  {
    id: 'bib-andersen-nunnally',
    author: 'Hans Christian Andersen',
    title: 'Fairy Tales',
    year: 2005,
    publisher: 'Penguin Classics（Tiina Nunnally 英译，Jackie Wullschläger 编）',
    note: '据丹麦文新译的英文全集，用于核对《海的女儿》关键段落的英译表述。',
    url: '',
    category: '西方原典与校注'
  },

  /* ---- 译名与译本研究 ---- */
  {
    id: 'bib-xietianzhen-yijiexue',
    author: '谢天振 著',
    title: '译介学',
    year: 1999,
    publisher: '上海外语教育出版社',
    note: '译介学基本理论，用于分析译名、译本在译入语文化中的接受与变形。',
    url: '',
    category: '译名与译本研究'
  },
  {
    id: 'bib-venuti-invisibility',
    author: 'Lawrence Venuti',
    title: "The Translator's Invisibility: A History of Translation",
    year: 1995,
    publisher: 'Routledge',
    note: '归化与异化问题的基本论述，用于解释译名选择背后的可读性策略。',
    url: '',
    category: '译名与译本研究'
  },
  {
    id: 'bib-toury-dts',
    author: 'Gideon Toury',
    title: 'Descriptive Translation Studies and Beyond',
    year: 1995,
    publisher: 'John Benjamins',
    note: '描述性翻译研究方法，用于把译名变化当作可描述的规范现象处理。',
    url: '',
    category: '译名与译本研究'
  },
  {
    id: 'bib-luoniansheng-dict',
    author: '罗念生、水建馥 编',
    title: '古希腊语汉语词典',
    year: 2004,
    publisher: '商务印书馆',
    note: '希腊语词义与汉译的工具书，用于核对 Σειρήν 等词在汉语中的定名依据。',
    url: '',
    category: '译名与译本研究'
  },

  /* ---- 神话学与民间文学理论 ---- */
  {
    id: 'bib-yuanke-shenhuashi',
    author: '袁珂 著',
    title: '中国神话史',
    year: 1988,
    publisher: '上海文艺出版社',
    note: '中国神话研究的通史性著作，用于把握鲛人一类水族异人在神话体系中的位置。',
    url: '',
    category: '神话学与民间文学理论'
  },
  {
    id: 'bib-maodun-myth',
    author: '玄珠（茅盾）著',
    title: '中国神话研究ABC',
    year: 1929,
    publisher: '世界书局',
    note: '中国现代神话学的奠基之作，其分类框架影响后世对中国水族异人的处理。',
    url: '',
    category: '神话学与民间文学理论'
  },
  {
    id: 'bib-zhongjingwen-gailun',
    author: '钟敬文 主编',
    title: '民间文学概论',
    year: 1980,
    publisher: '上海文艺出版社',
    note: '民间文学学科的基础教材，提供传说、故事类型与流传变异的分析框架。',
    url: '',
    category: '神话学与民间文学理论'
  },
  {
    id: 'bib-liushouhua-gushishi',
    author: '刘守华 著',
    title: '中国民间故事史',
    year: 1999,
    publisher: '湖北教育出版社',
    note: '中国民间故事的历时梳理，用于判断跨类婚恋、报恩等母题的流传层次。',
    url: '',
    category: '神话学与民间文学理论'
  },
  {
    id: 'bib-luxun-xiaoshuoshilue',
    author: '鲁迅 著',
    title: '中国小说史略',
    year: 1923,
    publisher: '新潮社（上卷 1923 年，下卷 1924 年）',
    note: '志怪小说研究的开山之作，用于把握六朝志怪的文体与材料性质。',
    url: '',
    category: '神话学与民间文学理论'
  },
  {
    id: 'bib-propp-morphology',
    author: 'Vladimir Propp',
    title: 'Morphology of the Folktale',
    year: 1968,
    publisher: 'University of Texas Press（第二版，Laurence Scott 英译，Louis A. Wagner 修订）',
    note: '故事形态学，功能分析方法直接支撑本项目的叙事功能编码。',
    url: '',
    category: '神话学与民间文学理论'
  },
  {
    id: 'bib-thompson-motif',
    author: 'Stith Thompson',
    title: 'Motif-Index of Folk-Literature',
    year: 1955,
    publisher: 'Indiana University Press（六卷，1955 至 1958 年）',
    note: '民间文学母题索引，用于比对美人鱼、水妖类母题的国际类型编号。',
    url: '',
    category: '神话学与民间文学理论'
  },

  /* ---- 影视游戏与视觉文化研究 ---- */
  {
    id: 'bib-bell-mouse-mermaid',
    author: 'Elizabeth Bell, Lynda Haas, Laura Sells 编',
    title: 'From Mouse to Mermaid: The Politics of Film, Gender, and Culture',
    year: 1995,
    publisher: 'Indiana University Press',
    note: '迪士尼研究论文集，含对《小美人鱼》的性别与改编分析，是当代改编编码的主要参考。',
    url: '',
    category: '影视游戏与视觉文化研究'
  },
  {
    id: 'bib-benwell-sea-enchantress',
    author: 'Gwen Benwell, Arthur Waugh',
    title: 'Sea Enchantress: The Tale of the Mermaid and Her Kin',
    year: 1961,
    publisher: 'Hutchinson',
    note: '人鱼形象的跨文化通览，材料虽旧而线索密集，引用前须回到其所列原始文献。',
    url: '',
    category: '影视游戏与视觉文化研究'
  },
  {
    id: 'bib-leavy-swan-maiden',
    author: 'Barbara Fass Leavy',
    title: 'In Search of the Swan Maiden: A Narrative on Folklore and Gender',
    year: 1994,
    publisher: 'New York University Press',
    note: '以天鹅少女母题为中心讨论异类婚恋与性别结构，与美人鱼婚恋叙事可对读。',
    url: '',
    category: '影视游戏与视觉文化研究'
  },
  {
    id: 'bib-zipes-happily',
    author: 'Jack Zipes',
    title: 'Happily Ever After: Fairy Tales, Children, and the Culture Industry',
    year: 1997,
    publisher: 'Routledge',
    note: '童话与文化工业的批判研究，用于分析安徒生文本在影视、出版中的再编码。',
    url: '',
    category: '影视游戏与视觉文化研究'
  },
  {
    id: 'bib-wuhung-wuliang',
    author: '巫鸿 著，柳扬、岑河 译',
    title: '武梁祠：中国古代画像艺术的思想性',
    year: 2006,
    publisher: '生活·读书·新知三联书店',
    note: '汉画像研究的方法参考，示范如何把图像母题放回礼仪与观念结构中解读。',
    url: '',
    category: '影视游戏与视觉文化研究'
  },

  /* ---- 数字人文方法 ---- */
  {
    id: 'bib-moretti-graphs',
    author: 'Franco Moretti',
    title: 'Graphs, Maps, Trees: Abstract Models for a Literary History',
    year: 2005,
    publisher: 'Verso',
    note: '远读方法的代表著作，本书的可视化与分析设计与之对话。',
    url: '',
    category: '数字人文方法'
  },
  {
    id: 'bib-drucker-graphesis',
    author: 'Johanna Drucker',
    title: 'Graphesis: Visual Forms of Knowledge Production',
    year: 2014,
    publisher: 'Harvard University Press',
    note: '讨论知识可视化中的诠释问题，提醒图表并非中立呈现。',
    url: '',
    category: '数字人文方法'
  },
  {
    id: 'bib-burdick-dh',
    author: 'Anne Burdick, Johanna Drucker, Peter Lunenfeld, Todd Presner, Jeffrey Schnapp',
    title: 'Digital_Humanities',
    year: 2012,
    publisher: 'MIT Press',
    note: '数字人文的方法论纲领，用于说明数据库、比较与可视化在研究流程中的位置。',
    url: '',
    category: '数字人文方法'
  }
);
