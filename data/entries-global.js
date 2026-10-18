/* ==========================================================================
   鲛人研究数据库 · 西方与日韩谱系条目（curator-global）
   只向 window.JR_DATA.entries 追加数据，不定义函数、不创建其他全局变量。
   加载顺序：data/schema.js → data/entries-cn.js → 本文件。
   ========================================================================== */
window.JR_DATA = window.JR_DATA || { entries: [] };
window.JR_DATA.entries.push(

{
  id: "gl-homer-odyssey-sirens",
  kind: "ancient",
  subtype: "诗文",
  title: "《奥德赛》卷十二：塞壬与奥德修斯",
  work: "Ὀδύσσεια (Odyssey)《奥德赛》",
  creator: "荷马（传）",
  eraLabel: "古希腊",
  year: -725,
  yearNote: "约，史诗成书年代通说为公元前 8 世纪后期",
  dateDisplay: "约前 8 世纪后期",
  culture: "西方",
  region: "古希腊",
  medium: "典籍",
  term: {
    primary: "塞壬",
    variants: ["塞伦", "海妖"],
    original: "Σειρῆνες (Seirēnes)",
    note: "荷马文本只写其歌唱与草地、骨骸，未描写形体；鸟身人首形象出自古风时期图像传统。"
  },
  traits: ["b_siren_song", "b_predator"],
  narratives: ["f_temptation", "f_encounter"],
  tags: ["荷马史诗", "航海", "歌声", "海难"],
  excerpt: "Σειρῆνας μὲν πρῶτον ἀφίξεαι, αἵ ῥά τε πάντας / ἀνθρώπους θέλγουσιν, ὅτις σφεας εἰσαφίκηται. …… ἀλλά τε Σειρῆνες λιγυρῇ θέλγουσιν ἀοιδῇ / ἥμεναι ἐν λειμῶνι, πολὺς δ᾽ ἀμφ᾽ ὀστεόφιν θὶς / ἀνδρῶν πυθομένων, περὶ δὲ ῥινοὶ μινύθουσι.",
  excerptSource: "《奥德赛》卷十二第 39 至 46 行（希腊文，Perseus 数字图书馆）",
  translation: "今译（本项目自译）：你首先要驶过塞壬的居地，她们迷惑所有靠近的人。……塞壬坐在草地上，以清亮的歌声迷惑来者，四周堆满腐化人骨的骨堆，皮囊正在消缩。",
  summary: "《奥德赛》第十二卷中，喀耳刻预先告诫奥德修斯：塞壬坐在海岛草地上歌唱，凡听见歌声者皆被迷惑，四周是腐朽人骨与正在消缩的皮囊。奥德修斯用蜡封住同伴耳朵，命人把自己绑在桅杆上，从而听见歌声又不致覆舟。荷马文本并未描写塞壬的具体形体，只突出歌声、知识与致命后果；人首鸟身的形象来自同时期的瓶画传统。",
  significance: "荷马确立了塞壬叙事的核心要素：歌声的诱惑、航海者的死亡风险，以及「听而不从」的理性装置。后世把塞壬与美人鱼混同，多以这段文本为源头，但荷马笔下的塞壬并无鱼尾。",
  sources: [
    { label: "Homer, Odyssey, Book 12", detail: "Perseus Digital Library，希腊文校勘本；引文见卷十二第 39 至 46 行", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0135:book=12" }
  ],
  confidence: "确证",
  related: ["gl-odysseus-siren-vase", "gl-ovid-metamorphoses-sirens"]
},

{
  id: "gl-odysseus-siren-vase",
  kind: "ancient",
  subtype: "图像器物",
  title: "「塞壬画家」陶罐：奥德修斯与塞壬",
  work: "Attic red-figure stamnos《阿提卡红绘双耳罐》",
  creator: "「塞壬画家」（佚名陶工／画师）",
  eraLabel: "古希腊古典时期",
  year: -475,
  yearNote: "约，通说定年为公元前 480 至前 470 年间",
  dateDisplay: "约前 480 至前 470 年",
  culture: "西方",
  region: "古希腊",
  medium: "图像",
  term: {
    primary: "塞壬",
    variants: ["鸟身塞壬", "塞伦"],
    original: "Σειρῆνες (Seirēnes)",
    note: "瓶画中塞壬为人首、鸟身、有翅，常持乐器；与后世鱼尾美人鱼形态不同。"
  },
  traits: ["m_bird_body", "m_human_upper", "b_siren_song", "b_predator"],
  narratives: ["f_temptation", "f_encounter"],
  tags: ["瓶画", "大英博物馆", "鸟身", "奥德修斯"],
  excerpt: "Attic red-figure stamnos, attributed to the Siren Painter, c. 480-470 BC; British Museum 1842,0728.787",
  excerptSource: "大英博物馆藏品著录（图版信息）",
  translation: "",
  summary: "这件阿提卡红绘双耳罐旧属「塞壬画家」名下，约作于公元前 480 至前 470 年，现藏伦敦大英博物馆（藏品编号 1842,0728.787）。画面表现奥德修斯被绑在桅杆上、船只驶过塞壬海域的场景，塞壬作人首鸟身、振翅而歌，其中一只正跃入海中。该图像与荷马卷十二的叙事互相印证，是研究塞壬视觉形态从鸟身向鱼尾过渡前的重要实物。",
  significance: "瓶画把荷马口传的「歌声杀人」转译为可传播的视觉程式，鸟身人首成为古典塞壬的标准像。它与后来中世纪鱼尾塞壬的对比，正是本项目考察「形态如何被替换」的关键环节。",
  sources: [
    { label: "British Museum, object 1842,0728.787", detail: "大英博物馆藏品数据库著录（Siren Painter，阿提卡红绘双耳罐，约前 480 至前 470）", url: "https://www.britishmuseum.org/collection/object/G_1842-0728-787" },
    { label: "British Museum, The Siren Painter", detail: "大英博物馆艺术家／工坊权威档", url: "https://www.britishmuseum.org/collection/term/BIOG60534" }
  ],
  confidence: "确证",
  related: ["gl-homer-odyssey-sirens", "gl-ovid-metamorphoses-sirens"]
},

{
  id: "gl-ovid-metamorphoses-sirens",
  kind: "ancient",
  subtype: "诗文",
  title: "《变形记》卷五：塞壬的变形",
  work: "Metamorphoses《变形记》",
  creator: "奥维德（Publius Ovidius Naso）",
  eraLabel: "古罗马",
  year: 8,
  yearNote: "约，通常定稿于公元 8 年前后",
  dateDisplay: "约公元 8 年",
  culture: "西方",
  region: "古罗马",
  medium: "典籍",
  term: {
    primary: "塞壬",
    variants: ["阿刻罗俄斯之女", "塞伦"],
    original: "Sirenes",
    note: "奥维德称塞壬为河神阿刻罗俄斯之女、普洛塞庇娜的同伴，变形后保留少女面容与人声。"
  },
  traits: ["m_bird_body", "m_human_upper", "b_siren_song"],
  narratives: ["f_temptation", "f_encounter"],
  tags: ["奥维德", "变形", "普洛塞庇娜", "鸟身"],
  excerpt: "vobis, Acheloides, unde / pluma pedesque avium, cum virginis ora geratis? / an quia, cum legeret vernos Proserpina flores, / in comitum numero, doctae Sirenes, eratis? …… virginei vultus et vox humana remansit.",
  excerptSource: "《变形记》卷五第 551 至 563 行（拉丁文，The Latin Library）",
  translation: "今译（本项目自译）：阿刻罗俄斯之女啊，你们为何有羽毛与鸟足，却生着少女的面容？……少女的面容与人的声音留了下来。",
  summary: "《变形记》第五卷借缪斯之口讲述塞壬的来历：她们本是河神阿刻罗俄斯之女、普洛塞庇娜的同伴；普洛塞庇娜被劫后，她们四处寻找未果，遂求得翅膀以便掠过海面寻人，身体化为鸟形，但少女面容与人的声音保留下来。奥维德由此为塞壬的鸟身人面提供了一个起源故事，也解释了其歌声何以仍具人声魅力。",
  significance: "奥维德把塞壬的混合形体纳入「变形」的解释框架，使「鸟身人面人声」成为可叙述的固定组合。这一形态经中世纪抄本传承，最终在图像传统中被鱼尾取代，是形态重构的重要中间环节。",
  sources: [
    { label: "Ovid, Metamorphoses V", detail: "The Latin Library 拉丁文全文；卷五第 551 至 563 行", url: "https://www.thelatinlibrary.com/ovid/ovid.met5.shtml" }
  ],
  confidence: "确证",
  related: ["gl-homer-odyssey-sirens", "gl-odysseus-siren-vase"]
},

{
  id: "gl-pliny-hn9-tritons-nereids",
  kind: "ancient",
  subtype: "地理志",
  title: "《自然史》卷九：特里同与涅瑞伊得斯",
  work: "Naturalis Historia《自然史》",
  creator: "老普林尼（Gaius Plinius Secundus）",
  eraLabel: "古罗马",
  year: 77,
  yearNote: "约，成书于公元 77 年前后",
  dateDisplay: "约公元 77 年",
  culture: "西方",
  region: "古罗马",
  medium: "典籍",
  term: {
    primary: "涅瑞伊得斯（海女）",
    variants: ["特里同", "海人"],
    original: "Nereides / Tritones",
    note: "涅瑞伊得斯原为海神涅柔斯之女，普林尼在博物志中将其作为海中生物记录，与塞壬并非同源。"
  },
  traits: ["m_human_upper", "m_fish_tail"],
  narratives: ["f_encounter"],
  tags: ["普林尼", "博物志", "海女", "特里同"],
  excerpt: "Naturalis Historia, Book IX, cap. 4: The Forms of the Tritons and Nereids",
  excerptSource: "Bostock & Riley 英译本章题（章次对照）",
  translation: "",
  summary: "《自然史》第九卷专论海洋动物，其中第四章题为「特里同与涅瑞伊得斯的外形」，把特里同、涅瑞伊得斯与海象等海中生物并列记述，多以目击传闻为据。普林尼并未把她们写成塞壬，但在后世编纂与动物志传统中，涅瑞伊得斯、塞壬与「海女」逐渐被归并，成为中世纪人鱼知识的重要古典来源。",
  significance: "普林尼把神话中的海中人形存在纳入自然史分类，为「海女」提供了博物学式而非诗学式的文献身份。这一书写方式使中世纪作者可以把塞壬、涅瑞伊得斯与人鱼视为同一类生物。",
  sources: [
    { label: "Pliny, Natural History, Book IX, Chap. 4", detail: "Bostock & Riley 英译本（1855），章题「The Forms of the Tritons and Nereids」", url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0137:book=9:chapter=4" },
    { label: "Pliny, Naturalis Historia IX", detail: "LacusCurtius 拉丁文校本（据 Mayhoff 校勘本）", url: "https://penelope.uchicago.edu/Thayer/L/Roman/Texts/Pliny_the_Elder/9*.html" }
  ],
  confidence: "版本存异",
  related: ["gl-physiologus-siren", "gl-liber-monstrorum-sirens"]
},

{
  id: "gl-physiologus-siren",
  kind: "ancient",
  subtype: "类书",
  title: "《Physiologus》中的塞壬",
  work: "Physiologus《博物志》（又译《动物志》）",
  creator: "佚名",
  eraLabel: "罗马帝国晚期至中世纪早期",
  year: 300,
  yearNote: "约，希腊语原本成书年代有争议，通说在 2 至 4 世纪之间",
  dateDisplay: "约 2 至 4 世纪",
  culture: "西方",
  region: "地中海",
  medium: "典籍",
  term: {
    primary: "塞壬",
    variants: ["海妖", "人首鸟身女妖"],
    original: "Σειρήν / Siren",
    note: "希腊语原本与拉丁语译本、各地方言译本之间章次与形体描写均有出入，需按具体抄本核对。"
  },
  traits: ["m_bird_body", "m_human_upper", "b_siren_song"],
  narratives: ["f_temptation"],
  tags: ["基督教动物志", "寓意解经", "中世纪", "塞壬"],
  excerpt: "Siren（Σειρήν）／塞壬：Physiologus「论塞壬」章",
  excerptSource: "章题与译名对照；章次随传本而异，原文引文据 Curley 英译本（转引，待核）",
  translation: "",
  summary: "《Physiologus》是早期基督教世界的动物寓言论著，以希腊语写成，后被译为拉丁语及多种东方语言。书中设有论塞壬的章节，把塞壬致命的歌声解释为世俗诱惑与异端邪说的隐喻，劝诫信徒掩耳拒听。各传本对塞壬形体的描写并不统一，鸟身人首与鱼尾人魚在不同抄本系统中并存，因而成为中世纪塞壬形象演变的关键文本。",
  significance: "该书把塞壬从博物志对象转化为道德寓言的符号，其「掩耳」母题与荷马的蜡封形成呼应。它也是塞壬知识进入西欧修道院抄本传统、并最终与鱼尾人鱼合流的主要渠道。",
  sources: [
    { label: "Physiologus, trans. Michael J. Curley", detail: "英译本，University of Chicago Press，1979 年（版本信息转引，待核）", url: "" }
  ],
  confidence: "待核",
  related: ["gl-liber-monstrorum-sirens", "gl-pliny-hn9-tritons-nereids"]
},

{
  id: "gl-liber-monstrorum-sirens",
  kind: "ancient",
  subtype: "笔记杂史",
  title: "《Liber Monstrorum》中的塞壬",
  work: "Liber Monstrorum《怪物之书》",
  creator: "佚名",
  eraLabel: "中世纪早期",
  year: 700,
  yearNote: "约，通说定于 7 世纪末至 8 世纪初，作者与成书地点有争议",
  dateDisplay: "约 7 至 8 世纪",
  culture: "西方",
  region: "西欧",
  medium: "典籍",
  term: {
    primary: "塞壬",
    variants: ["海少女", "海妖"],
    original: "Sirenae / Siren",
    note: "该文本以拉丁语「marinae puellae」（海中少女）一类表述描述塞壬，与传统鸟身形象已有距离。"
  },
  traits: ["m_human_upper", "b_siren_song"],
  narratives: ["f_temptation"],
  tags: ["盎格鲁拉丁", "怪物志", "海少女", "抄本"],
  excerpt: "Sirenae（Siren）／塞壬：《Liber Monstrorum》塞壬条",
  excerptSource: "条目标题与译名对照；据 Orchard 校译本（转引，待核）",
  translation: "",
  summary: "《Liber Monstrorum》是一部约成于 7 世纪末至 8 世纪初的拉丁语怪物志，与盎格鲁撒克逊学术圈及《贝奥武甫》抄本语境相关。书中列举海陆各地的奇异生物，塞壬被描述为以歌声引诱航海者的海中少女，与传统鸟身塞壬的图式已有出入。该文本把古典塞壬知识带入北方海域的怪物志书写，是塞壬「海洋化」的重要过渡文献。",
  significance: "它显示塞壬在进入北欧拉丁学术传统时，其形象开始脱离鸟身而向「海中少女」滑动。这一滑动为后来鱼尾人鱼的视觉定型准备了语义条件。",
  sources: [
    { label: "Andy Orchard, Pride and Prodigies", detail: "University of Toronto Press 版《Liber Monstrorum》校译本，具体页码待核（转引，待核）", url: "https://books.google.com.sg/books?id=hU8DdkwXbDEC" }
  ],
  confidence: "待核",
  related: ["gl-physiologus-siren", "gl-pliny-hn9-tritons-nereids"]
},

{
  id: "gl-bern-physiologus-siren",
  kind: "ancient",
  subtype: "图像器物",
  title: "伯尔尼《Physiologus》抄本中的鱼尾塞壬",
  work: "Bern, Burgerbibliothek, Cod. 318（Bern Physiologus）",
  creator: "佚名抄工与绘工",
  eraLabel: "加洛林时期",
  year: 850,
  yearNote: "约，抄本年代通说定于 9 世纪中期",
  dateDisplay: "约 9 世纪中期",
  culture: "西方",
  region: "西欧",
  medium: "图像",
  term: {
    primary: "塞壬",
    variants: ["鱼尾塞壬", "人鱼"],
    original: "Siren / Sirena",
    note: "该抄本插图被用作塞壬图像「鱼尾化」的早期例证，具体页次与图版需核对原抄本。"
  },
  traits: ["m_human_upper", "m_fish_tail", "b_siren_song"],
  narratives: ["f_temptation"],
  tags: ["抄本插图", "加洛林", "鱼尾", "动物志"],
  excerpt: "Bern, Burgerbibliothek, Cod. 318（9 世纪中期拉丁文 Physiologus 插图抄本）",
  excerptSource: "e-codices 著录（图版信息；塞壬页次待核）",
  translation: "",
  summary: "伯尔尼公民图书馆藏 Cod. 318 是 9 世纪中期的拉丁文《Physiologus》插图抄本。学界常以其中塞壬图像说明一个重要的图像转折：原本人首鸟身的塞壬，在此被画成人首鱼尾的女性，与鸟身图式并存于同一动物志传统中。鱼尾化并非一次完成，而是在抄本插图、纹章与后世印刷中逐步固定下来。",
  significance: "该抄本为「鸟身塞壬如何变成鱼尾人鱼」提供了可核查的图像节点。把这一节点与古典瓶画、晚期中世纪动物志并置，可以直观呈现形态替换的时序与地域差异。",
  sources: [
    { label: "e-codices, Bern Burgerbibliothek Cod. 318", detail: "瑞士 e-codices 数字手稿库著录（塞壬鱼尾图像的具体页次转引，待核）", url: "https://www.e-codices.unifr.ch/en/bbb/0318" }
  ],
  confidence: "待核",
  related: ["gl-physiologus-siren", "gl-liber-monstrorum-sirens"]
},

{
  id: "gl-columbus-sirens-1493",
  kind: "ancient",
  subtype: "地理志",
  title: "哥伦布航海日记中的「美人鱼」",
  work: "Diario de a bordo《航海日记》（经拉斯·卡萨斯摘录）",
  creator: "克里斯托弗·哥伦布（著）；巴托洛梅·德·拉斯·卡萨斯（摘录）",
  eraLabel: "大航海时代",
  year: 1493,
  yearNote: "可确证，1493 年 1 月 9 日条",
  dateDisplay: "1493 年 1 月 9 日",
  culture: "跨文化",
  region: "跨区域",
  medium: "典籍",
  term: {
    primary: "塞壬（美人鱼）",
    variants: ["sirenas", "海女"],
    original: "sirenas (西语)",
    note: "西班牙语沿用古典 sirenas 之名；15 世纪欧洲的塞壬图像多已鱼尾化，评语「不如画中美丽」即以此图式为参照。现代研究多认为其所见为海牛目动物，而非鱼尾人鱼。"
  },
  traits: ["m_human_upper", "m_fish_tail"],
  narratives: ["f_encounter", "f_colonial"],
  tags: ["哥伦布", "海牛", "误认", "航海日记"],
  excerpt: "sirenas（塞壬）",
  excerptSource: "《航海日记》1493 年 1 月 9 日条所用西语词；转写与拼写待核",
  translation: "",
  summary: "1493 年 1 月 9 日，哥伦布在加勒比海域航行时记下看见三条「sirenas」（塞壬）跃出海面，并写下她们并不如画中那样美丽的评语。这段记录经拉斯·卡萨斯的摘录本传世，是现代读者最常引用的「美人鱼误认」文献之一。研究者普遍认为，哥伦布所见应为加勒比海的海牛（manatee）；古典语汇被直接套用到陌生动物身上，构成命名的错位：欧洲航海者以古典语汇命名异域自然，同时以审美失望确认其非人。",
  significance: "该条把「美人鱼」从文本形象变成观测范畴：航海者以古典名称命名新见动物，又以审美失望确认其非人。这一命名与误认的链条，直接导向 19 世纪海牛目以塞壬命名的分类学后果。",
  sources: [
    { label: "《航海日记》1493 年 1 月 9 日条", detail: "拉斯·卡萨斯摘录本；英译通行本有 Cecil Jane 译本（版本与页码待核，转引）", url: "" },
    { label: "Miami New Times: Christopher Columbus Mistook Manatees for Mermaids", detail: "二手报道，用于说明海牛误认的通行解释", url: "https://www.miaminewtimes.com/news/christopher-columbus-mistook-manatees-for-mermaids-13110688/" }
  ],
  confidence: "版本存异",
  related: ["gl-sirenia-illiger-1811"]
},

{
  id: "gl-sirenia-illiger-1811",
  kind: "translation",
  subtype: "辞书译名",
  title: "海牛目 Sirenia 的命名",
  work: "Prodromus systematis mammalium et avium《哺乳动物与鸟类系统初编》",
  creator: "约翰·卡尔·威廉·伊利格（Johann Karl Wilhelm Illiger）",
  eraLabel: "19 世纪初",
  year: 1811,
  yearNote: "可确证，学名权威记为 Illiger, 1811",
  dateDisplay: "1811 年",
  culture: "跨文化",
  region: "全球",
  medium: "学术",
  term: {
    primary: "海牛目（塞壬目）",
    variants: ["Sirenia", "sirens", "海牛类"],
    original: "Sirenia",
    note: "分类学名直接取自希腊塞壬；英语俗称 sirens 亦保留此义，但该目动物并无鱼尾。本条 traits 描述被借名的塞壬形象，不指海牛目动物的实际形态。"
  },
  traits: ["m_human_upper", "b_siren_song"],
  narratives: ["f_encounter"],
  tags: ["分类学", "命名", "海牛", "儒艮"],
  excerpt: "Sirenia Illiger, 1811（海牛目／塞壬目）",
  excerptSource: "ITIS 分类记录（学名与命名者对照）",
  translation: "",
  summary: "1811 年，德国博物学家伊利格在《哺乳动物与鸟类系统初编》中建立海牛目 Sirenia，以希腊神话中的塞壬命名。该目现今包括美洲海牛、亚马逊海牛、非洲海牛与儒艮四种，另有已灭绝的大海牛；它们都是完全水生的哺乳动物，尾鳍呈桨状而非鱼尾。以塞壬命名，直接承袭了古代水手把海牛误认为人鱼的观察传统。",
  significance: "命名把神话语汇固定进现代分类学：塞壬从此既是叙事形象，也是可测量、可保护的动物类别。这一「误认的体制化」是跨文化形象重构中最具体、也最可追踪的案例之一。",
  sources: [
    { label: "ITIS, Sirenia Illiger, 1811", detail: "整合分类学信息系统，分类单元 TSN 180676，含两科四属现生类群", url: "https://itis.gov/servlet/SingleRpt/SingleRpt?categories=All&search_credRating=all&search_kingdom=every&search_span=containing&search_topic=Scientific_Name&search_value=Sirenia&source=html" }
  ],
  confidence: "确证",
  related: ["gl-columbus-sirens-1493"]
},

{
  id: "gl-andersen-little-mermaid-1837",
  kind: "modern",
  subtype: "童话",
  title: "《海的女儿》（Den lille Havfrue）",
  work: "Eventyr, fortalte for Børn. Første Samling. Tredie Hefte《写给孩子们的童话·第一集第三册》",
  creator: "安徒生（Hans Christian Andersen）",
  eraLabel: "丹麦黄金时代",
  year: 1837,
  yearNote: "可确证，1837 年 4 月 7 日首次发表",
  dateDisplay: "1837 年 4 月 7 日",
  culture: "西方",
  region: "北欧",
  medium: "典籍",
  term: {
    primary: "海的女儿",
    variants: ["小美人鱼", "人鱼公主"],
    original: "Den lille Havfrue",
    note: "丹麦语 havfrue 意为「海女」；中译名有《海的女儿》《人鱼公主》《小美人鱼》等多种，差异反映译入语的类属选择。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_shapeshift", "m_beauty", "b_voice_trade", "b_soul_quest", "b_sacrifice_foam"],
  narratives: ["f_love_sacrifice", "f_salvation", "f_voice"],
  tags: ["丹麦", "童话", "灵魂", "化沫", "失声"],
  excerpt: "Den lille Havfrue / The Little Mermaid / 海的女儿",
  excerptSource: "题名对照（H.C. Andersen Centret 作品登记）",
  translation: "",
  summary: "1837 年 4 月 7 日，安徒生的《海的女儿》随《写给孩子们的童话》第一集第三册出版。人鱼公主以声音换取双腿，希望获得王子的爱和一个不灭的灵魂；当婚姻无望时，她拒绝以杀死王子换取回到海中的机会，最终化为海沫，并因善行获得升入天界的机会。故事把民间人鱼传说改写为关于灵魂、牺牲与救赎的基督教伦理叙事。",
  significance: "安徒生把塞壬式的危险异类改写为可同情、可救赎的主体，确立现代美人鱼叙事的「爱情与牺牲」范式。「失声」「化沫」「求灵魂」三要素，成为此后几乎所有改编的核心结构。",
  sources: [
    { label: "H.C. Andersen Centret, \"Den lille Havfrue\"", detail: "南丹麦大学安徒生中心作品登记：首次发表 1837 年 4 月 7 日，收入《Eventyr, fortalte for Børn. Første Samling. Tredie Hefte. 1837》", url: "https://andersen.sdu.dk/vaerk/register/info.html?vid=16" }
  ],
  confidence: "确证",
  related: ["gl-copenhagen-little-mermaid-1913"]
},

{
  id: "gl-copenhagen-little-mermaid-1913",
  kind: "modern",
  subtype: "图像器物",
  title: "哥本哈根小美人鱼铜像",
  work: "Den lille Havfrue (The Little Mermaid)《小美人鱼》铜像",
  creator: "爱德华·埃里克森（Edvard Eriksen）",
  eraLabel: "20 世纪初",
  year: 1913,
  yearNote: "可确证，1913 年 8 月 23 日安放",
  dateDisplay: "1913 年 8 月 23 日",
  culture: "西方",
  region: "西欧",
  medium: "图像",
  term: {
    primary: "小美人鱼",
    variants: ["美人鱼铜像", "海女"],
    original: "Den lille Havfrue",
    note: "丹麦语题名与安徒生童话同名；雕像由嘉士伯创办人之子卡尔·雅各布森出资赠予哥本哈根市。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_beauty"],
  narratives: ["f_love_sacrifice"],
  tags: ["哥本哈根", "铜像", "安徒生", "公共艺术"],
  excerpt: "Den lille Havfrue, bronze and granite, Langelinie, Copenhagen, unveiled 23 August 1913",
  excerptSource: "VisitDenmark 官方页面（图版信息）",
  translation: "",
  summary: "1913 年 8 月 23 日，丹麦雕塑家爱德华·埃里克森的青铜与花岗岩雕像「小美人鱼」安放在哥本哈根长堤公园港口，由嘉士伯创办人之子卡尔·雅各布森出资赠予市政府。灵感来自 1909 年丹麦皇家剧院据安徒生童话改编的芭蕾舞剧，主演埃伦·普莱斯不愿裸体作模特，最终由雕塑家妻子埃琳·埃里克森出任模特。雕像多次遭破坏，现为丹麦最著名的公共纪念物之一。",
  significance: "雕像把文学形象固化为可拍摄、可复制的公共地标，使「海的女儿」脱离文本进入旅游与摄影的全球流通；其被毁与修复的历史本身也是形象再编码的一部分。",
  sources: [
    { label: "VisitDenmark, Den Lille Havfrue", detail: "丹麦国家旅游局官方页面：1913 年 8 月 23 日安放、卡尔·雅各布森出资、埃伦·普莱斯与埃琳·埃里克森作模特等", url: "https://www.visitdenmark.dk/danmark/explore/den-lille-havfrue-gdk586951" }
  ],
  confidence: "确证",
  related: ["gl-andersen-little-mermaid-1837"]
},

{
  id: "gl-wilde-fisherman-soul-1891",
  kind: "modern",
  subtype: "童话",
  title: "《渔夫和他的灵魂》",
  work: "A House of Pomegranates《石榴之家》",
  creator: "奥斯卡·王尔德（Oscar Wilde）",
  eraLabel: "维多利亚时代后期",
  year: 1891,
  yearNote: "可确证，1891 年收入《石榴之家》出版",
  dateDisplay: "1891 年",
  culture: "西方",
  region: "西欧",
  medium: "典籍",
  term: {
    primary: "美人鱼",
    variants: ["海女", "人鱼"],
    original: "mermaid",
    note: "王尔德写人鱼与人类之爱，以灵魂为交易物，与安徒生「求灵魂」的方向相反。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_beauty", "b_love_human"],
  narratives: ["f_love_sacrifice", "f_salvation"],
  tags: ["王尔德", "唯美主义", "灵魂", "人鱼之恋"],
  excerpt: "The Fisherman and His Soul / 渔夫和他的灵魂",
  excerptSource: "篇目题名对照（《石榴之家》，1891）",
  translation: "",
  summary: "王尔德短篇，收入 1891 年出版的《石榴之家》。年轻渔夫爱上美人鱼，为与她同住海底，请神父割去自己的灵魂；被抛弃的灵魂此后每年以财富、智慧与美色引诱他回到陆地，渔夫始终拒绝，最终在海岸边死去，美人鱼亦随之而逝。故事以唯美主义笔法重写人鱼恋，把安徒生「为爱求取灵魂」反转为「为爱舍弃灵魂」。",
  significance: "王尔德将灵魂与爱欲对立，使美人鱼叙事从救赎伦理转向审美伦理；这一反转成为 20 世纪唯美与颓废主义人鱼书写的重要源头之一。",
  sources: [
    { label: "Oscar Wilde, A House of Pomegranates (1891)", detail: "初版扫描本，伦敦 James R. Osgood, McIlvaine & Co. 出版（具体版次信息待核）", url: "https://archive.org/details/houseofpomegrana00wild" }
  ],
  confidence: "确证",
  related: ["gl-andersen-little-mermaid-1837"]
},

{
  id: "gl-starbucks-siren-logo",
  kind: "modern",
  subtype: "品牌商业",
  title: "星巴克塞壬标志",
  work: "Starbucks logo《星巴克品牌标志》",
  creator: "星巴克咖啡公司（1971 年初版标志设计者待核）",
  eraLabel: "20 世纪后期至今",
  year: 1971,
  yearNote: "自 1971 年启用，历经 1987、1992、2011 年改版",
  dateDisplay: "1971 年至今",
  culture: "跨文化",
  region: "全球",
  medium: "商业",
  term: {
    primary: "塞壬",
    variants: ["双尾美人鱼", "星巴克海妖"],
    original: "Starbucks siren",
    note: "双尾塞壬图像据品牌叙述源自 15 世纪北欧木刻；这一来源说法尚待艺术史核实。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_twin_tail", "m_human_upper", "m_beauty"],
  narratives: ["f_commodity"],
  tags: ["品牌", "双尾", "西雅图", "标志设计"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "星巴克 1971 年在西雅图创立时采用双尾塞壬图像，初版标志为棕褐色木刻风格，塞壬裸胸、双尾外展；1987 年改为绿色并遮蔽胸部，1992 年放大局部、隐去肚脐，2011 年再去除外圈文字与「Starbucks Coffee」，仅保留塞壬头像。品牌方称原型为 15 世纪北欧双尾塞壬木刻，具体来源与图像谱系尚待艺术史核实。本条目以作品信息为主，无原文引文。",
  significance: "商业标志把中世纪双尾塞壬从纹章与木刻带入全球消费场景，是神话形象商品化的典型个案，也显示图像在商标化过程中的遮蔽与简化机制。",
  sources: [
    { label: "Starbucks, The Evolution of Our Logo", detail: "星巴克官方品牌史页面（以官方叙述为准；访问时受网站防护限制）", url: "https://about.starbucks.com/history/the-evolution-of-our-logo/" },
    { label: "CBC News, Starbucks unveils logo change (2011)", detail: "2011 年去文字改版报道", url: "https://www.cbc.ca/news/business/starbucks-unveils-logo-change-1.1077475" }
  ],
  confidence: "版本存异",
  related: ["gl-mermaid-siren-etymology"]
},

{
  id: "gl-disney-little-mermaid-1989",
  kind: "modern",
  subtype: "动画",
  title: "《小美人鱼》（迪士尼动画）",
  work: "The Little Mermaid《小美人鱼》",
  creator: "华特迪士尼动画工作室；导演约翰·马斯克、罗恩·克莱门茨",
  eraLabel: "迪士尼文艺复兴",
  year: 1989,
  yearNote: "可确证，1989 年 11 月 17 日美国上映",
  dateDisplay: "1989 年 11 月 17 日",
  culture: "西方",
  region: "美国",
  medium: "动画",
  term: {
    primary: "小美人鱼",
    variants: ["爱丽儿", "人鱼公主"],
    original: "The Little Mermaid / Ariel",
    note: "主角名 Ariel 在中文多译「爱丽儿」；片名沿用安徒生童话的中译习惯。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_shapeshift", "m_beauty", "b_voice_trade", "b_love_human"],
  narratives: ["f_identity", "f_voice", "f_marriage"],
  tags: ["迪士尼", "爱丽儿", "音乐剧动画", "改编"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "迪士尼第 28 部动画长片，1989 年 11 月 17 日上映，由约翰·马斯克与罗恩·克莱门茨执导，乔迪·本森为爱丽儿配音，艾伦·曼肯与霍华德·阿什曼负责音乐。影片大幅改写安徒生结局：爱丽儿以声音向海巫换取双腿，必须在三日之内得到王子的真爱之吻，最终与埃里克成婚并留在陆地。〈Part of Your World〉成为全片核心唱段。本条目以作品信息为主，无原文引文。",
  significance: "迪士尼把悲剧性的牺牲叙事改为成长与婚姻喜剧，使美人鱼成为全球儿童文化的正面主人公；这一改编确立了此后三十年英语世界人鱼影视的基本语法。",
  sources: [
    { label: "Disney Movies, The Little Mermaid", detail: "迪士尼官方影片页", url: "https://movies.disney.com/the-little-mermaid" },
    { label: "IMDb, The Little Mermaid (1989)", detail: "tt0097757，演职员与上映信息", url: "https://www.imdb.com/title/tt0097757/" }
  ],
  confidence: "确证",
  related: ["gl-andersen-little-mermaid-1837", "gl-disney-little-mermaid-2023"]
},

{
  id: "gl-disney-little-mermaid-2023",
  kind: "modern",
  subtype: "影视",
  title: "《小美人鱼》（迪士尼真人版）",
  work: "The Little Mermaid《小美人鱼》",
  creator: "华特迪士尼影业；导演罗伯·马歇尔；哈莉·贝利饰爱丽儿",
  eraLabel: "21 世纪",
  year: 2023,
  yearNote: "可确证，2023 年 5 月 26 日美国上映",
  dateDisplay: "2023 年 5 月 26 日",
  culture: "西方",
  region: "美国",
  medium: "影视",
  term: {
    primary: "小美人鱼",
    variants: ["爱丽儿", "真人改编"],
    original: "The Little Mermaid (2023)",
    note: "2019 年公布由哈莉·贝利出演爱丽儿，引发关于种族与「还原原作」的公开争论。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_shapeshift", "m_beauty", "b_voice_trade", "b_love_human"],
  narratives: ["f_identity", "f_voice", "f_marriage"],
  tags: ["真人改编", "选角论争", "哈莉·贝利", "迪士尼"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "迪士尼 1989 年动画的真人改编，罗伯·马歇尔执导，哈莉·贝利饰爱丽儿，2023 年 5 月 26 日上映。影片保留原作的音乐与主线，并扩充爱丽儿与埃里克的动机。2019 年选角公布后，围绕黑人演员出演爱丽儿出现持续的网络争论：支持者强调再现与多元化，反对者以「还原原作」为由批评，争论涉及种族、童年记忆与改编伦理。本条目以作品信息为主，无原文引文。",
  significance: "该片把美人鱼形象的肤色与族裔问题推到公共讨论中心，说明人鱼作为可塑符号，其形态政治已从尾巴与声音扩展到种族、身体与再现权。",
  sources: [
    { label: "IMDb, The Little Mermaid (2023)", detail: "tt5971474，演职员与上映信息", url: "https://www.imdb.com/title/tt5971474/" },
    { label: "豆瓣电影《小美人鱼》(2023)", detail: "中文片名、上映日期与演职员条目", url: "https://movie.douban.com/subject/27601044/" }
  ],
  confidence: "确证",
  related: ["gl-disney-little-mermaid-1989", "gl-andersen-little-mermaid-1837"]
},

{
  id: "gl-splash-1984",
  kind: "modern",
  subtype: "影视",
  title: "《美人鱼》Splash",
  work: "Splash《美人鱼》",
  creator: "导演罗恩·霍华德；达丽尔·汉纳、汤姆·汉克斯主演",
  eraLabel: "20 世纪 80 年代",
  year: 1984,
  yearNote: "可确证，1984 年上映",
  dateDisplay: "1984 年",
  culture: "西方",
  region: "美国",
  medium: "影视",
  term: {
    primary: "美人鱼",
    variants: ["麦迪逊", "mermaid"],
    original: "mermaid / Madison",
    note: "片中美人鱼以「Madison」为名；该片常被引为影视影响英语命名的例子。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_shapeshift", "m_beauty", "b_love_human"],
  narratives: ["f_marriage", "f_encounter"],
  tags: ["好莱坞", "浪漫喜剧", "纽约", "麦迪逊"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "罗恩·霍华德执导的浪漫喜剧，1984 年上映。汤姆·汉克斯饰纽约商人艾伦，达丽尔·汉纳饰在科德角海滩被冲上岸、能在陆地与海中自由转换的美人鱼麦迪逊。影片把安徒生式的跨类之爱改写为都市爱情喜剧：麦迪逊为寻找当年救过她的男孩来到纽约，最终艾伦随她入海生活，以团圆结局回避了原故事的死亡与泡沫。本条目以作品信息为主，无原文引文。",
  significance: "该片把美人鱼从童话与恐怖传统移入成人浪漫喜剧，使「上岸寻爱」成为 80 年代以后大众影视的通用情节，也为后续人鱼恋类型奠定基调。",
  sources: [
    { label: "豆瓣电影《美人鱼》Splash (1984)", detail: "中文条目，演职员与上映信息", url: "https://movie.douban.com/subject/1292906/" },
    { label: "IMDb, Splash (1984)", detail: "tt0088161", url: "https://www.imdb.com/title/tt0088161/" }
  ],
  confidence: "确证",
  related: ["gl-shape-of-water-2017"]
},

{
  id: "gl-pirates4-mermaids-2011",
  kind: "modern",
  subtype: "影视",
  title: "《加勒比海盗4：惊涛怪浪》中的人鱼",
  work: "Pirates of the Caribbean: On Stranger Tides《加勒比海盗4：惊涛怪浪》",
  creator: "导演罗伯·马歇尔；华特迪士尼影业",
  eraLabel: "21 世纪",
  year: 2011,
  yearNote: "可确证，2011 年上映",
  dateDisplay: "2011 年",
  culture: "西方",
  region: "美国",
  medium: "影视",
  term: {
    primary: "人鱼",
    variants: ["美人鱼", "人鱼之泪"],
    original: "mermaids / mermaid tears",
    note: "片中设定人鱼之泪是通往「青春之泉」的关键材料，人鱼因此成为被猎捕的原料来源。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_beauty", "b_predator", "b_captured"],
  narratives: ["f_temptation", "f_commodity", "f_encounter"],
  tags: ["迪士尼", "人鱼之泪", "猎捕", "青春之泉"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "2011 年上映的系列第四部，罗伯·马歇尔执导。影片把人鱼写成兼具诱惑与捕食性的群体：她们以歌声引诱水手落水，又长有尖牙、具攻击性；黑胡子船长等人为取得「人鱼之泪」（通往青春之泉的关键材料）而设网猎捕人鱼。传教士菲利普与人鱼赛琳娜的互动构成片中的人鱼支线，也让人鱼第一次成为被采集的「原料」。本条目以作品信息为主，无原文引文。",
  significance: "该片把人鱼之泪从中国鲛人「泣珠」传统中的珍宝母题，转写为西方探险叙事里的可采集资源，显示同一母题在跨文化流通中的功能替换。",
  sources: [
    { label: "IMDb, Pirates of the Caribbean: On Stranger Tides (2011)", detail: "tt1298650，演职员与上映信息", url: "https://www.imdb.com/title/tt1298650/" }
  ],
  confidence: "确证",
  related: ["gl-sirenia-illiger-1811"]
},

{
  id: "gl-shape-of-water-2017",
  kind: "modern",
  subtype: "影视",
  title: "《水形物语》",
  work: "The Shape of Water《水形物语》",
  creator: "导演吉尔莫·德尔·托罗；莎莉·霍金斯、道格·琼斯主演",
  eraLabel: "21 世纪",
  year: 2017,
  yearNote: "可确证，2017 年上映；获第 90 届奥斯卡最佳影片",
  dateDisplay: "2017 年",
  culture: "西方",
  region: "美国",
  medium: "影视",
  term: {
    primary: "两栖人",
    variants: ["人鱼", "水神"],
    original: "the Asset / amphibian man",
    note: "影片主角为南美河流中的两栖人形生物，与鱼尾人鱼并非同一形态，此处作为邻近谱系收录。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_scaled", "b_sacred", "b_captured"],
  narratives: ["f_love_sacrifice", "f_encounter"],
  tags: ["德尔·托罗", "冷战", "两栖人", "奥斯卡"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "德尔·托罗执导的冷战背景奇幻片，2017 年上映。哑女清洁工艾丽莎在军方实验室与被捕获的南美两栖人建立情感，最终协助其逃脱，并在水中复活。影片以人鱼恋的结构重述跨类之爱，但对象是两栖人而非鱼尾人鱼，属于人鱼叙事的邻近谱系；军方与科学机构的观看、实验与占有构成另一条冲突线。本条目以作品信息为主，无原文引文。",
  significance: "该片把跨类之爱与被捕获的他者并置，延续美人鱼叙事中的凝视与伦理问题；其奥斯卡最佳影片身份也使「人鱼恋」进入主流艺术电影话语。",
  sources: [
    { label: "IMDb, The Shape of Water (2017)", detail: "tt5580390，演职员与获奖信息", url: "https://www.imdb.com/title/tt5580390/" }
  ],
  confidence: "确证",
  related: ["gl-splash-1984", "gl-pirates4-mermaids-2011"]
},

{
  id: "gl-weeki-wachee-mermaids",
  kind: "modern",
  subtype: "品牌商业",
  title: "Weeki Wachee 美人鱼剧场",
  work: "Weeki Wachee Springs State Park《威基沃奇泉州立公园》",
  creator: "牛顿·佩里（Newton Perry）等开发者",
  eraLabel: "20 世纪中期至今",
  year: 1947,
  yearNote: "约，1947 年开放美人鱼表演；2008 年并入佛罗里达州州立公园系统",
  dateDisplay: "1947 年至今",
  culture: "西方",
  region: "美国",
  medium: "商业",
  term: {
    primary: "职业美人鱼",
    variants: ["美人鱼表演", "水下剧场"],
    original: "Weeki Wachee mermaids",
    note: "演员戴鱼尾、在水下以呼吸管换气，表演芭蕾与戏剧；该模式被视为现代职业美人鱼的制度源头。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_beauty"],
  narratives: ["f_commodity"],
  tags: ["佛罗里达", "水下表演", "主题公园", "职业美人鱼"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "1947 年，前海军游泳教练牛顿·佩里在佛罗里达 Weeki Wachee 泉开发水下剧场，演员戴鱼尾、以呼吸管换气，在水下表演芭蕾与戏剧。该地成为美国最早且持续最久的美人鱼主题旅游表演之一，2008 年并入佛罗里达州州立公园系统。它催生了「职业美人鱼」这一现代演艺门类，也为后来的 merfolk 亚文化提供技术与表演范式。本条目以作品信息为主，无原文引文。",
  significance: "该案例说明美人鱼形象如何从叙事角色转化为可售票的表演劳动与旅游景观，是观察神话形象进入商业与身体技艺层面的关键样本之一。",
  sources: [
    { label: "Florida State Parks, Weeki Wachee Springs", detail: "佛罗里达州州立公园官方页面（访问时受网站防护限制，史实细节据二手研究）", url: "https://www.floridastateparks.org/WeekiWachee" },
    { label: "Weeki Wachee, City of Mermaids", detail: "Lu Vickers 著地方史研究，University Press of Florida（版本信息转引，待核）", url: "https://catalog.lib.uchicago.edu/vufind/Record/6378562" }
  ],
  confidence: "版本存异",
  related: ["gl-copenhagen-little-mermaid-1913"]
},

{
  id: "gl-penguin-book-of-mermaids-2019",
  kind: "modern",
  subtype: "学术评论",
  title: "《企鹅美人鱼之书》",
  work: "The Penguin Book of Mermaids《企鹅美人鱼之书》",
  creator: "克里斯蒂娜·巴奇莱加、玛丽·阿洛哈拉尼·布朗（编）",
  eraLabel: "21 世纪",
  year: 2019,
  yearNote: "约，版本信息待核（通行著录为 Penguin Classics，2019 年）",
  dateDisplay: "2019 年",
  culture: "跨文化",
  region: "全球",
  medium: "学术",
  term: {
    primary: "美人鱼",
    variants: ["mermaid", "人鱼"],
    original: "mermaid",
    note: "选集以 mermaid 为总题，收录欧、亚、非、美等多地人鱼文本，体现该词作为类属名的跨语言扩张。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "b_siren_song"],
  narratives: ["f_encounter", "f_identity"],
  tags: ["文选", "比较文学", "企鹅经典", "人鱼研究"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "由巴奇莱加与阿洛哈拉尼·布朗编选的企鹅经典文选，收录从古代近东、希腊、欧洲到亚洲、非洲、美洲的人鱼与塞壬文本，附导读与作者小传。选集把「mermaid」作为跨文化的分析范畴，同时提醒各地人鱼形象在形态、性别与叙事功能上的差异，是近年英语世界人鱼研究的重要教学读本。本条目以作品信息为主，无原文引文。",
  significance: "该选集把分散的跨文化材料编入同一阅读框架，为本项目的趋同与差异比较提供文献范式；其编纂原则也暴露「mermaid」一词的翻译与类属风险。",
  sources: [
    { label: "The Penguin Book of Mermaids", detail: "Google Books 书目页（编者、出版社与年份据该页，转引待核）", url: "https://books.google.com.sg/books?id=x8iuDwAAQBAJ" }
  ],
  confidence: "待核",
  related: ["gl-benwell-waugh-sea-enchantress-1961"]
},

{
  id: "gl-ningyo-yaobikuni",
  kind: "ancient",
  subtype: "民间传说",
  title: "人鱼之肉与八百比丘尼",
  work: "《康富记》等中世记录与若狭地方传说",
  creator: "佚名（民间传承）",
  eraLabel: "中世日本",
  year: 1449,
  yearNote: "文献记录年；传说流传更早，分布遍及日本多地；1449 年条据转引，见 sources",
  dateDisplay: "记录于 1449 年",
  culture: "东亚",
  region: "日本",
  medium: "典籍",
  term: {
    primary: "人魚（にんぎょ）",
    variants: ["八百比丘尼", "白比丘尼", "人魚の肉"],
    original: "人魚 / 八百比丘尼",
    note: "日本中世传说中人鱼多为鱼形怪物，食其肉可获不老长寿，与西洋美艳人鱼形成对照。"
  },
  traits: ["b_flesh_immortal", "m_fish_tail"],
  narratives: ["f_immortality", "f_encounter"],
  tags: ["若狭", "小浜", "不老长寿", "人鱼之肉"],
  excerpt: "人魚の肉（人鱼肉）／八百比丘尼",
  excerptSource: "主题词对照；《康富记》条原文待核",
  translation: "",
  summary: "日本中世以来流传的八百比丘尼传说：有人捕得「人鱼」之肉，少女不知而食之，由此不老不死，活至八百岁，遍历诸国后入若狭小浜空印寺的山洞入定。据后世研究转引，1449 年《康富记》已有「白比丘尼」上洛示人的记载。传说分布遍及日本各地，常与庚申讲、龙宫等母题结合，是「食人鱼肉得长生」这一类型的核心文本。",
  significance: "该传说把人鱼定义为可食用的长生资源，与中国鲛人「食肉长生」母题高度同构，也解释了日本后世对人鱼标本与人鱼木乃伊的持续兴趣。",
  sources: [
    { label: "JAPAN 47 GO「八百比丘尼入定洞」", detail: "日本观光振兴协会全国观光信息数据库：福井县小浜市男山空印寺旁、食人鱼肉活至八百岁的传说洞窟", url: "https://www.japan47go.travel/ja/detail/bbf07860-aecb-4260-bd33-e60638607cd9" },
    { label: "Weblio 辞书「八百比丘尼」", detail: "《世界宗教用语大事典》释义及日文维基百科条目；其中《康富记》文安六年（1449）五月条据胜浦令子《古代・中世の女性と仏教》（山川出版社，2003）第 83 页转引，原书待核", url: "https://www.weblio.jp/content/%E5%85%AB%E7%99%BE%E6%AF%94%E4%B8%98%E5%B0%BC" }
  ],
  confidence: "版本存异",
  related: ["gl-ningyo-mummy-2022", "gl-takahashi-mermaid-saga"]
},

{
  id: "gl-ningyo-mummy-2022",
  kind: "modern",
  subtype: "学术评论",
  title: "冈山「人鱼木乃伊」的科学分析",
  work: "円珠院藏「人魚のミイラ」",
  creator: "仓敷艺术科学大学研究团队",
  eraLabel: "21 世纪",
  year: 2023,
  yearNote: "可确证，2023 年 2 月 7 日公布最终报告",
  dateDisplay: "2023 年 2 月 7 日",
  culture: "东亚",
  region: "日本",
  medium: "学术",
  term: {
    primary: "人鱼木乃伊",
    variants: ["人魚のミイラ"],
    original: "人魚のミイラ",
    note: "日本多地寺院与私人收藏有「人鱼」标本；本件经 CT 与材质分析确认为人工制作。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_scaled"],
  narratives: ["f_commodity"],
  tags: ["冈山", "浅口市", "圆珠院", "CT 分析"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "冈山县浅口市圆珠院藏「人鱼木乃伊」长约 30 厘米，手指有扁平指甲，体表可见鳞状物。2022 年 2 月起，仓敷艺术科学大学团队以 X 射线 CT 扫描等方法展开分析，2023 年 2 月 7 日公布最终结果：上半身为棉布等材料加河豚皮与动物毛发，下半身为纸等材料外包鱼皮，制作年代可能在 19 世纪后期。该物长期作为寺院藏品与地方信仰对象保存。本条目以作品信息为主，无原文引文。",
  significance: "分析揭示「人鱼标本」是人工制作的展示物，为理解近代日本人鱼的观看、买卖与信仰提供实证，也说明跨文化人鱼形象如何被物化为可陈列的证据。",
  sources: [
    { label: "KSB 瀬戸内海放送新闻（2023-02-07）", detail: "「人鱼木乃伊」研究最终报告：材质构成与制作年代推测", url: "https://news.ksb.co.jp/article/14833910" }
  ],
  confidence: "确证",
  related: ["gl-ningyo-yaobikuni"]
},

{
  id: "gl-takahashi-mermaid-saga",
  kind: "modern",
  subtype: "动画",
  title: "《人鱼之森》系列",
  work: "人魚シリーズ《人鱼系列》",
  creator: "高桥留美子",
  eraLabel: "昭和末期至平成初期",
  year: 1984,
  yearNote: "可确证，自 1984 年 8、9 月号起至 1994 年 7、8 月号连载",
  dateDisplay: "1984 至 1994 年",
  culture: "东亚",
  region: "日本",
  medium: "动画",
  term: {
    primary: "人鱼",
    variants: ["人魚シリーズ", "人鱼之森"],
    original: "人魚シリーズ",
    note: "作品把日本传说的人鱼写成丑陋、具攻击性的怪物，食其肉可得不死，与西洋美艳人鱼形象相反。本条目以作品信息为主，无原文引文。"
  },
  traits: ["b_flesh_immortal", "m_fish_tail", "b_predator"],
  narratives: ["f_immortality", "f_encounter", "f_identity"],
  tags: ["高桥留美子", "不老不死", "少年Sunday", "OVA"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "高桥留美子的读切漫画系列，1984 至 1994 年在《周刊少年 Sunday》增刊与本体不定期连载，1989 年以「人鱼之森」获第 20 回星云赏漫画部门奖；1991 与 1993 年改编为 OVA《人鱼之森》《人鱼之伤》，2003 年改编为电视动画。故事以误食人鱼肉而获得不死之身的涌太与少女真鱼为中心，人鱼被写成丑陋怪物，食肉长生伴随剧毒与变形代价。本条目以作品信息为主，无原文引文。",
  significance: "该系列把日本「人鱼肉长生」传说系统化，并以不死者的孤独反思长生母题，与西洋美艳人鱼叙事形成强烈对照，是东亚人鱼现代改写的重要参照。",
  sources: [
    { label: "Weblio 百科事典「人魚シリーズ」条", detail: "引自日文维基百科：连载起止、受赏、OVA 与电视动画改编信息", url: "https://www.weblio.jp/content/%E4%BA%BA%E9%AD%9A%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA" }
  ],
  confidence: "确证",
  related: ["gl-ningyo-yaobikuni", "gl-ningyo-mummy-2022"]
},

{
  id: "gl-miyazaki-ponyo-2008",
  kind: "modern",
  subtype: "动画",
  title: "《悬崖上的金鱼姬》",
  work: "崖の上のポニョ《悬崖上的金鱼姬》",
  creator: "宫崎骏（原作、脚本、导演）；吉卜力工作室",
  eraLabel: "21 世纪",
  year: 2008,
  yearNote: "可确证，2008 年 7 月 19 日日本上映",
  dateDisplay: "2008 年 7 月 19 日",
  culture: "东亚",
  region: "日本",
  medium: "动画",
  term: {
    primary: "金鱼姬",
    variants: ["人鱼", "ポニョ"],
    original: "ポニョ",
    note: "波妞原为金鱼模样的海之少女；影片借「人鱼公主」框架，但主角是鱼形海之少女。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_shapeshift", "b_underwater_realm", "b_ecology"],
  narratives: ["f_encounter", "f_ecology", "f_identity"],
  tags: ["吉卜力", "宫崎骏", "海洋", "人鱼公主"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "宫崎骏执导的吉卜力动画，2008 年 7 月 19 日上映。金鱼模样的海之少女波妞执意变成人类，与海边少年宗介相遇；其父藤本厌恶人类对海洋的污染，试图恢复远古海况，波妞的出走引发海面上升与生态失衡，最终以其母的考验收束。影片借「人鱼公主」框架，却把重心放在童稚之爱与海洋秩序。本条目以作品信息为主，无原文引文。",
  significance: "该片把美人鱼「求人形」的动机改写为对人间的好奇与依恋，并纳入海平面上升、海洋污染等生态意象，是东亚动画对人鱼母题最具影响力的当代改写之一。",
  sources: [
    { label: "Studio Ghibli「崖の上のポニョ」作品页", detail: "吉卜力官方作品页：2008 年 7 月 19 日公开、原作·脚本·监督宫崎骏、约 101 分钟", url: "https://www.ghibli.jp/works/ponyo/" }
  ],
  confidence: "确证",
  related: ["gl-andersen-little-mermaid-1837", "gl-onepiece-shirahoshi"]
},

{
  id: "gl-onepiece-shirahoshi",
  kind: "modern",
  subtype: "动画",
  title: "《海贼王》白星公主",
  work: "ONE PIECE《海贼王》",
  creator: "尾田荣一郎",
  eraLabel: "21 世纪初",
  year: 2011,
  yearNote: "约，鱼人岛篇连载于 2010 至 2012 年，初登场话数待核",
  dateDisplay: "约 2011 年",
  culture: "东亚",
  region: "日本",
  medium: "动画",
  term: {
    primary: "白星",
    variants: ["しらほし", "人鱼公主"],
    original: "しらほし / Shirahoshi",
    note: "鱼人岛龙宫王国的人鱼公主，体型巨大；据作品设定，她为古代兵器「波塞冬」的当代持有者。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_beauty", "m_giant"],
  narratives: ["f_identity", "f_encounter"],
  tags: ["少年漫画", "鱼人岛", "人鱼公主", "古代兵器"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "尾田荣一郎漫画《海贼王》鱼人岛篇的人物，龙宫王国的人鱼公主白星，体型远大于常人，性格柔弱，长期被囚于硬壳塔中。她是「古代兵器·波塞冬」的当代持有者，能与海王类沟通；草帽一伙进入鱼人岛后卷入其家族与人类海贼的冲突，白星的成长构成该篇的情感核心。本条目以作品信息为主，无原文引文。",
  significance: "白星把人鱼公主从「被拯救者」扩展为拥有古代兵器身份的政治主体，显示少年漫画如何把人鱼形象纳入宏大叙事，也是巨大化人鱼在东亚的当代代表。",
  sources: [
    { label: "ONE PIECE 官方网站", detail: "作品与角色信息（具体初登场话数与设定细节转引，待核）", url: "https://one-piece.com/" }
  ],
  confidence: "待核",
  related: ["gl-miyazaki-ponyo-2008"]
},

{
  id: "gl-japanese-ningyohime-title",
  kind: "translation",
  subtype: "译本",
  title: "「人魚姫」：安徒生童话的日译名",
  work: "Den lille Havfrue《海的女儿》",
  creator: "安徒生（原著）；初译者待核",
  eraLabel: "近代日本以降",
  year: 2003,
  yearNote: "版本依据年：福音馆书店『人魚姫―アンデルセンの童話 2』2003 年 11 月；初译年代与译者待核",
  dateDisplay: "2003 年版（初译年代待核）",
  culture: "东亚",
  region: "日本",
  medium: "译名",
  term: {
    primary: "人魚姫",
    variants: ["人魚の姫", "マーメイド"],
    original: "Den lille Havfrue → 人魚姫",
    note: "日语通行译题以「人魚」对应 havfrue、以「姫」标示公主身份，与中文「海的女儿」「小美人鱼」语义侧重不同；日译名在 20 世纪已通行，2003 年仅为本条目的版本依据。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_beauty"],
  narratives: ["f_love_sacrifice"],
  tags: ["译名", "安徒生", "明治", "人魚姫"],
  excerpt: "Den lille Havfrue → 人魚姫",
  excerptSource: "デジタル大辞泉「人魚姫」条（原题对照）",
  translation: "",
  summary: "安徒生《Den lille Havfrue》在日语中以「人魚姫」为通行译题。デジタル大辞泉即以「人魚姫」立目，注明原题与 1837 年发表；福音馆书店、岩波书店等出版社的安徒生童话集沿用此名，本文以福音馆书店 2003 年版《人魚姫》为版本依据。该译名以「人魚」对应 havfrue、以「姫」标示公主身份，与中文「海的女儿」「小美人鱼」形成不同的语义侧重。初译者与初版年份待核。",
  significance: "日译名「人魚姫」把西洋人鱼固定为「公主」身份，影响日本对安徒生的接受与后续创作；与中文译名并置，可见译入语如何以既有词汇重写人物身份。",
  sources: [
    { label: "Weblio 辞书「人魚姫」", detail: "デジタル大辞泉条目（原题 Den lille Havfrue、1837 年发表）及短篇小説作品名辞典所收日译本信息（含福音馆书店 2003 年版《人魚姫》）", url: "https://www.weblio.jp/content/%E4%BA%BA%E9%AD%9A%E5%A7%AB" }
  ],
  confidence: "待核",
  related: ["gl-andersen-little-mermaid-1837", "gl-japanese-mermaid-usage"]
},

{
  id: "gl-japanese-mermaid-usage",
  kind: "translation",
  subtype: "辞书译名",
  title: "「人魚」与「マーメイド」的语用分工",
  work: "《デジタル大辞泉》等辞书与影视译名",
  creator: "辞书编纂者与译名使用者",
  eraLabel: "现代日本",
  year: 2023,
  yearNote: "以现行辞书条目与 2023 年迪士尼真人版日文片名为观察点；辞书版次待核",
  dateDisplay: "当代",
  culture: "东亚",
  region: "日本",
  medium: "译名",
  term: {
    primary: "人魚",
    variants: ["マーメイド", "海女"],
    original: "にんぎょ / マーメイド",
    note: "大辞泉释「人魚」为上半身女身、下半身鱼形的想象动物，并以「マーメイド」为同义说明；实际使用中「人魚」偏传说、生物与民俗，「マーメイド」偏影视片名、时尚与商业。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_beauty"],
  narratives: ["f_encounter"],
  tags: ["译名", "语用", "外来语", "辞书"],
  excerpt: "上半身が女身で、下半身が魚の形をしているという想像上の動物。マーメイド。",
  excerptSource: "デジタル大辞泉「人魚」条（Weblio 辞书）",
  translation: "",
  summary: "日语中「人魚（にんぎょ）」与借词「マーメイド」并存。デジタル大辞泉释「人魚」为上半身女身、下半身鱼形的想象动物，并直接以「マーメイド」为同义说明；但在实际语用中，「人魚」更多用于民间传说、生物俗称（如儒艮的别称）与严肃叙述，「マーメイド」则集中于影视片名（如「リトル・マーメイド」）、时尚与商业语境。",
  significance: "这一分工显示同一形象在本土词与外来词之间的语体分层：本土词承担民俗与知识功能，外来词承担消费与媒介功能，是译名研究的典型个案。",
  sources: [
    { label: "Weblio 辞书「人魚」", detail: "デジタル大辞泉释义（人魚＝上半身女身、下半身鱼形，マーメイド）及《世界宗教用语大事典》释义", url: "https://www.weblio.jp/content/%E4%BA%BA%E9%AD%9A" },
    { label: "Weblio 辞书「人魚姫」", detail: "デジタル大辞泉条目，可证「人魚姫」为安徒生童话的日语通行题名", url: "https://www.weblio.jp/content/%E4%BA%BA%E9%AD%9A%E5%A7%AB" }
  ],
  confidence: "版本存异",
  related: ["gl-japanese-ningyohime-title", "gl-mermaid-siren-etymology"]
},

{
  id: "gl-korean-blue-sea-2016",
  kind: "modern",
  subtype: "影视",
  title: "《蓝色大海的传说》",
  work: "푸른 바다의 전설《蓝色大海的传说》",
  creator: "编剧朴智恩；导演陈赫；全智贤、李敏镐主演；SBS",
  eraLabel: "21 世纪",
  year: 2016,
  yearNote: "可确证，2016 年 11 月 16 日首播",
  dateDisplay: "2016 年 11 月至 2017 年 1 月",
  culture: "东亚",
  region: "韩国",
  medium: "影视",
  term: {
    primary: "人鱼",
    variants: ["인어", "沈清"],
    original: "인어 (人魚)",
    note: "剧中人鱼名「沈清」（심청），取自韩国《沈清歌》中的孝女；人鱼之泪凝结为珍珠。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "m_shapeshift", "m_beauty", "b_tears_pearl", "b_love_human"],
  narratives: ["f_love_sacrifice", "f_identity"],
  tags: ["SBS", "全智贤", "人鱼之泪", "沈清"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "韩国 SBS 电视台 2016 年 11 月至 2017 年 1 月播出的奇幻爱情剧，朴智恩编剧、陈赫执导，全智贤饰朝鲜时代人鱼沈清，李敏镐饰天才骗子许俊宰。剧集以人鱼传说与《沈清歌》为引，设定人鱼上岸后双腿可现、眼泪凝结为珍珠，并立下「若所爱之人不爱她，心脏便会停止」的规则，使跨世情缘带有悲剧倒计时。本条目以作品信息为主，无原文引文。",
  significance: "该剧把「泣珠」母题以「人鱼之泪化为珍珠」的形式移植到韩剧爱情叙事，是东亚人鱼形象跨国流动与类型化的重要样本；「沈清」命名亦显示本土民间故事被重新征用。",
  sources: [
    { label: "Yonhap News, 2016-05-30", detail: "SBS 选角报道：李敏镐、全智贤主演，朴智恩编剧，取材韩国人鱼传说", url: "https://en.yna.co.kr/view/AEN20160530010051315" },
    { label: "Yonhap News, 2016-11-17", detail: "首播报道：2016 年 11 月 16 日首播、全智贤饰朝鲜时代人鱼、李敏镐饰骗子许俊宰", url: "https://en.yna.co.kr/view/AEN20161117004200315" },
    { label: "Sports Chosun 剧评（2016-12-09，经 Mojiza 转载）", detail: "人鱼设定：眼泪化为珍珠、心脏随爱停止等", url: "https://news.moyiza.kr/502766/" }
  ],
  confidence: "确证",
  related: ["gl-korean-ineo", "gl-japanese-mermaid-usage"]
},

{
  id: "gl-korean-ineo",
  kind: "translation",
  subtype: "辞书译名",
  title: "韩语「인어」的词形与词义",
  work: "《标准国语大辞典》",
  creator: "韩国国立国语院",
  eraLabel: "现代韩国",
  year: 2016,
  yearNote: "以《标准国语大辞典》释义与 2016 年电视剧用例为观察点",
  dateDisplay: "当代",
  culture: "东亚",
  region: "韩国",
  medium: "译名",
  term: {
    primary: "인어（人魚）",
    variants: ["인어", "人魚"],
    original: "인어",
    note: "汉字词「人魚」的朝鲜语读法；《标准国语大辞典》释为上半身如人、下半身如鱼的想象海兽，并注明亦为儒艮的别称。"
  },
  traits: ["m_human_upper", "m_fish_tail"],
  narratives: ["f_encounter"],
  tags: ["译名", "汉字词", "国语辞典", "儒艮"],
  excerpt: "상반신은 사람과 같고 하반신은 물고기와 같다는 상상의 바다 동물.",
  excerptSource: "국립국어원 표준국어대사전「인어」条",
  translation: "",
  summary: "韩语「인어」是汉字词「人魚」的朝鲜语读法。《标准国语大辞典》释为「上半身如人、下半身如鱼的想象海兽」，并以「교인」为近义词；该词在某些语境中亦指儒艮（듀공）。在当代影视与大众文化中，인어 同时承接西洋美人鱼与本土人鱼传说，2016 年 SBS 剧《蓝色大海的传说》即以人鱼为主角。",
  significance: "该词形显示汉字文化圈共享的「人魚」命名如何在韩语中延续，并兼指真实海兽；与中文「鲛人／人鱼」、日语「人魚」并置，可见汉字词跨语流通的稳定性。",
  sources: [
    { label: "국립국어원 표준국어대사전「인어」", detail: "释义：상반신은 사람과 같고 하반신은 물고기와 같다는 상상의 바다 동물（≒교인）", url: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9D%B8%EC%96%B4" }
  ],
  confidence: "确证",
  related: ["gl-korean-blue-sea-2016"]
},

{
  id: "gl-mermaid-siren-etymology",
  kind: "translation",
  subtype: "辞书译名",
  title: "mermaid 与 siren：英语词源与语义分层",
  work: "英语词源辞书与古典语文学工具书",
  creator: "辞书编纂者",
  eraLabel: "中古英语至现代英语",
  year: 1400,
  yearNote: "mermaid 见于中古英语，约 14 世纪；siren 经拉丁语借自希腊语，年代更早",
  dateDisplay: "约 14 世纪以来",
  culture: "跨文化",
  region: "全球",
  medium: "译名",
  term: {
    primary: "美人鱼",
    variants: ["mermaid", "siren", "塞壬"],
    original: "mermaid (< mere + maid); siren (< Σειρήν)",
    note: "mermaid 为日耳曼语「海／湖」加「少女」的复合词；siren 借自希腊塞壬，原为鸟身女妖，中世纪后与鱼尾人鱼混同。"
  },
  traits: ["m_human_upper", "m_fish_tail", "b_siren_song"],
  narratives: ["f_temptation", "f_encounter"],
  tags: ["词源", "语义", "mermaid", "siren"],
  excerpt: "mermaid < 中古英语 mermayde < mere（海、湖）+ maid（少女）；siren < 拉丁 Siren < 希腊 Σειρήν",
  excerptSource: "词源对照（非逐字引文），据 Online Etymology Dictionary，转引待核",
  translation: "",
  summary: "英语 mermaid 由中古英语 mermayde 演变而来，一般分析为 mere（海、湖，源自日耳曼语）加 maid（少女）的复合词；siren 则经拉丁语 Siren 借自希腊语 Σειρήν，原指以歌声诱杀水手的鸟身女妖。中世纪图像传统把塞壬改为鱼尾后，siren 与 mermaid 在英语中逐渐近义，但仍分别保留「危险歌声」与「半人半鱼」的语义侧重。",
  significance: "两个词的并置揭示美人鱼形象的双重来源：日耳曼民间的水中少女与希腊的致命歌者。英语用词的分层，正是本项目所说名称滑动的语言证据。",
  sources: [
    { label: "Online Etymology Dictionary, mermaid", detail: "中古英语 mermayde，mere（海）+ maide（少女）（转引，待核）", url: "https://www.etymonline.com/word/mermaid" },
    { label: "Online Etymology Dictionary, siren", detail: "经拉丁语 Siren 借自希腊语 Seiren（转引，待核）", url: "https://www.etymonline.com/word/siren" },
    { label: "Liddell-Scott-Jones, σειρήν", detail: "Perseus 古典希腊语词典条目", url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0057:entry=seirh/n" }
  ],
  confidence: "版本存异",
  related: ["gl-homer-odyssey-sirens", "gl-ovid-metamorphoses-sirens"]
},

{
  id: "gl-benwell-waugh-sea-enchantress-1961",
  kind: "modern",
  subtype: "学术评论",
  title: "《海之魅惑：美人鱼及其亲族的故事》",
  work: "Sea Enchantress: The Tale of the Mermaid and Her Kin",
  creator: "格温·本韦尔、阿瑟·沃（Gwen Benwell & Arthur Waugh）",
  eraLabel: "20 世纪中期",
  year: 1961,
  yearNote: "版本信息据澳大利亚国家图书馆著录（1961 年）；出版者与版次待核",
  dateDisplay: "1961 年",
  culture: "西方",
  region: "西欧",
  medium: "学术",
  term: {
    primary: "美人鱼",
    variants: ["海妖", "mermaid"],
    original: "mermaid",
    note: "英语世界早期美人鱼通史之一，将塞壬、海女与民间人鱼纳入同一叙述线索。本条目以作品信息为主，无原文引文。"
  },
  traits: ["m_human_upper", "m_fish_tail", "b_siren_song"],
  narratives: ["f_encounter", "f_identity"],
  tags: ["学术史", "美人鱼研究", "英国", "通史"],
  excerpt: "",
  excerptSource: "",
  translation: "",
  summary: "本韦尔与沃合著的美人鱼文化史，1961 年出版，系统梳理从古代塞壬、中世纪动物志到近代航海目击与民间传说中的美人鱼材料，兼及人鱼形象在文学与图像中的流变。该书长期被作为英语世界人鱼研究的入门通史引用，但部分材料转引二手文献，使用时应核对原始出处。本条目以作品信息为主，无原文引文。",
  significance: "该书奠定英语世界「美人鱼通史」的写作范式，把塞壬、海女与人鱼纳入同一叙述线索；其材料的二手性也提醒研究者注意早期人鱼研究的知识来源。",
  sources: [
    { label: "National Library of Australia catalogue, Sea Enchantress", detail: "格温·本韦尔与阿瑟·沃合著书目记录（1961 年；出版者与版次待核）", url: "https://catalogue.nla.gov.au/catalog/843117" }
  ],
  confidence: "版本存异",
  related: ["gl-penguin-book-of-mermaids-2019"]
},

{
  id: "gl-merlion-singapore",
  kind: "modern",
  subtype: "图像器物",
  title: "新加坡鱼尾狮",
  work: "Merlion《鱼尾狮》",
  creator: "设计弗雷泽·布伦纳（Fraser Brunner）；新加坡旅游局",
  eraLabel: "20 世纪后期",
  year: 1972,
  yearNote: "可确证，1972 年 9 月 15 日揭幕；1964 年完成设计",
  dateDisplay: "1972 年 9 月 15 日",
  culture: "跨文化",
  region: "跨区域",
  medium: "图像",
  term: {
    primary: "鱼尾狮",
    variants: ["Merlion", "新加坡鱼尾狮"],
    original: "Merlion",
    note: "狮头鱼身；狮头指向「狮城」传说，鱼身指向渔村起源，属于半人半鱼结构的邻近谱系。"
  },
  traits: ["m_fish_tail", "m_scaled"],
  narratives: ["f_identity", "f_commodity"],
  tags: ["新加坡", "城市标志", "旅游", "混合体"],
  excerpt: "Merlion, Merlion Park, Singapore, unveiled 15 September 1972",
  excerptSource: "新加坡旅游局景点页（图版信息）",
  translation: "",
  summary: "鱼尾狮是新加坡的城市象征，狮头鱼身，1964 年由弗雷泽·布伦纳为新加坡旅游局设计，1972 年 9 月 15 日由时任总理李光耀在鱼尾狮公园揭幕，高约 8.6 米。狮头取自「狮城」（Singapura）传说，鱼身则指向新加坡作为渔村的起源。它并非人鱼，但保留了半人半鱼式的混合结构，属于邻近谱系。",
  significance: "该案例显示人鱼式混合体如何被改造为国家品牌与旅游地标；狮头替换人首、鱼身保留，说明半人半鱼结构可承载完全不同的族群叙事。",
  sources: [
    { label: "Visit Singapore, Merlion Park", detail: "新加坡旅游局官方景点页", url: "https://www.visitsingapore.com/see-do-singapore/architecture/landmarks/merlion-park/" },
    { label: "NLB Singapore Infopedia, Merlion", detail: "新加坡国家图书馆百科条目（访问时受网站防护限制）", url: "https://www.nlb.gov.sg/main/article-detail?cmsuuid=f9c0fd6c-acfa-4eb0-8585-2aa155c1d74d" }
  ],
  confidence: "版本存异",
  related: ["gl-starbucks-siren-logo"]
}

);
