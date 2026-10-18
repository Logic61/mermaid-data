# 数据审校报告

审校日期：2026-10-18。数据快照：当日 14:40 前后写入的两个条目文件。审校对象：`data/entries-cn.js`（31 条）、`data/entries-global.js`（32 条），合计 63 条；参考书目 `data/bibliography.js`（30 条）另见《参考书目》。若此后条目有增补，本文的统计数字按快照计，具体问题仍以条目 id 为准。本次审校只读数据文件，未改动任何条目；问题按「高、中、低」三级列出，交 Lead 与对应维护者处置。

## 一、审校方法

1. **全量结构扫描**：对 63 条逐条检查字段完整性、`id` 唯一性、`kind` 与 `subtype` 合法性、`traits` 与 `narratives` 取值、`related` 指向、`confidence` 取值、`year` 类型、`sources` 是否齐全、`summary` 与 `significance` 长度、`tags` 数量、URL 格式。
2. **重点抽查**：逐条核对 24 条，覆盖三种 `kind` 与四类 `culture`。中国谱系 12 条：`cn-shanhaijing-lingyu`、`cn-soushenji-jiaoren`、`cn-bowuzhi-jiaoren`、`cn-shuyiji-jiaoxiao`、`cn-taipingguangji-hairenyu`、`cn-taipingguangji-liuyi`、`cn-wudufu-liukui`、`cn-jinse`、`cn-bencaogangmu-jiaoyu`、`cn-guangdongxinyu-caizhu`、`cn-haicuotu-renyu`、`cn-zhifangwaiji-renyu`；西方与东亚谱系 12 条：`gl-homer-odyssey-sirens`、`gl-odysseus-siren-vase`、`gl-ovid-metamorphoses-sirens`、`gl-columbus-sirens-1493`、`gl-sirenia-illiger-1811`、`gl-copenhagen-little-mermaid-1913`、`gl-wilde-fisherman-soul-1891`、`gl-penguin-book-of-mermaids-2019`、`gl-ningyo-yaobikuni`、`gl-japanese-ningyohime-title`、`gl-disney-little-mermaid-1989`、`gl-shape-of-water-2017`。另补看 `cn-siren-yiming`、`cn-andersen-haide-nver`、`cn-disney-xiaomeiren`、`cn-bencaogangmu-jiaoyu`、`gl-starbucks-siren-logo`、`gl-ningyo-mummy-2022`、`cn-yumeiren-wuju` 等。
3. **外部核对**：古籍原文用识典古籍逐字对校（《山海经》《搜神记》《述异记》《太平广记》《本草纲目》《广东新语》《聊斋志异》等）；西方古典用 Perseus、The Latin Library、大英博物馆藏品库、ITIS 分类数据库、南丹麦大学安徒生中心作品登记等；近现代与影视条目核对官方页面、通讯社报道、国家图书馆与高校馆藏书目。仅核到二手转述的，在问题中注明。

## 二、数据概览

| 项目 | 数值 |
|---|---|
| 条目总数 | 63（`cn-` 31，`gl-` 32） |
| `kind` 分布 | 古籍与古典图像 25，译名与译本 10，当代作品与论评 28 |
| `culture` 分布 | 中国 24，西方 17，东亚 9，跨文化 13 |
| `confidence` 分布 | 确证 38，版本存异 13，待核 12 |
| 年代跨度 | 公元前 725 年至 2023 年 |
| `excerpt` 为空 | 36 条（译名 5、影视 9、动画 5、图像 4、典籍 7、学术 4、商业 2） |
| 字段与关系错误 | `id` 重复 0；`related` 悬空 0；取值非法 0；`sources` 缺失 0 |

结构层面质量总体良好。主要问题集中在三类：二手转述直接编码、编码与所据原文相悖、`confidence` 与核对程度不匹配。

## 三、高优先级问题

| 序号 | 条目 id | 问题 | 建议 |
|---|---|---|---|
| H1 | `cn-zhifangwaiji-renyu` | `excerpt` 与 `excerptSource` 均为空，`sources` 两条都是科普文转述，未见《职方外纪》原文卷次与文句；`traits`（`m_human_upper`、`m_fish_tail`）与 `narratives`（`f_encounter`、`f_colonial`）均无原文依据，属于以二手转述直接编码，有被读作无据立目的风险。 | 补《职方外纪》原文（四库全书本可检索「人鱼」条）后重立；短期无法核对则移除该条，或至少清空无据编码并保持「待核」。 |
| H2 | `cn-bencaogangmu-jiaoyu` | `traits` 含 `m_scaled`（覆鳞）。识典古籍《本草纲目》卷四十四「鱗之四・無鱗魚類」核对：鮫魚条列于「无鳞鱼类」，原文只言「皮皆有沙如真珠斑」「皮可饰刀靶」，未言鳞。勾选覆鳞与所据版本分类直接相悖。 | 删除 `m_scaled`；「皮有沙」可在 `summary` 描述，不设编码。该条卷次与引文经核对无误，可保留为「鲛」名实分离的关键条目。 |
| H3 | `gl-homer-odyssey-sirens` | `traits` 混入叙事组 id `f_temptation`，而 `narratives` 已含同一 id，形成维度混用与重复。`data/schema.js` 把 39 项全部放进 `traits` 数组，`tools/check.js` 因而未能捕获。 | 从 `traits` 删除 `f_temptation`；Lead 在 `tools/check.js` 增加组别校验：`traits` 只允许 `m_`/`b_`，`narratives` 只允许 `f_`。 |
| H4 | `cn-guangdongxinyu-caizhu` | `b_captured`、`b_trade` 与 `f_commodity`、`f_ecology` 的依据是采珠人（人类劳工）的采珠劳动与珠市交易，编码对象与「人鱼形象」错位；条目自述「本条未直接使用鲛人一词」。此类编码会污染比较矩阵中的形象特征统计。 | 建议移除该条，或改写为不进入特征比较的「背景资料」。若保留，须在研究说明中单列「物产背景」类别并明确不参与形象编码。 |

## 四、中优先级问题

| 序号 | 条目 id | 问题 | 建议 |
|---|---|---|---|
| M1 | `gl-sirenia-illiger-1811` | `m_fish_tail` 与 `summary`「尾鳍呈桨状而非鱼尾」自相矛盾；`b_ecology`、`f_ecology` 在该分类命名事件中无情节依据。 | 删除 `m_fish_tail`、`b_ecology`、`f_ecology`；改以命名错位与误认传统立论。 |
| M2 | `gl-columbus-sirens-1493` | `m_beauty` 与原叙述相反：日记明言所见「不如画中美丽」。以此编码所见对象，逻辑不成立。 | 删除 `m_beauty`；补拉斯·卡萨斯摘录本的具体版本与页码，`f_colonial` 须说明观看与命名结构。 |
| M3 | `cn-andersen-haide-nver` | 「1953 年人民文学出版社出版，为中国最早的中文版《安徒生童话》」与所引新华社《环球》报道一致，但「最早」系报道说法；安徒生童话单篇汉译早于 1953（如周作人 1910 年代的译介）。 | 明确「据该报道称」，并限定为「最早据丹麦文译出的童话集」；补译本研究文献，避免把媒体报道当作学界定论。 |
| M4 | `cn-jinse` | `traits` 含 `b_weave_silk`，但《锦瑟》引文只及「珠有泪」，全诗无织绡；织绡依据来自义山他诗，他诗又未收入 `sources`。 | 删除 `b_weave_silk`；若要以义山他诗为据，应另立条目。 |
| M5 | `cn-taipingguangji-liuyi` | `m_beauty` 无引文依据（引文为龙女自述身世，原传「蛾脸不舒」亦非美色描写）；且龙女属龙族，为邻近谱系，`b_love_human` 与本条关系需再说明。 | 删除 `m_beauty` 或补原文依据；在 `summary` 已有「邻近谱系」说明，可保留条目但须与研究说明的口径一致。 |
| M6 | `cn-siren-yiming` | `confidence` 为「确证」，但 `excerpt` 系「据于成文引王焕生译」，`sources[].detail` 自注「译本初版信息待核」；`traits` 含 `m_bird_body`，而引文与译名本身均不涉形体。 | 降为「待核」或「版本存异」；删除 `m_bird_body`；补王焕生译本版权页或直接引《奥德赛》译本卷十二。 |
| M7 | `gl-ningyo-yaobikuni` | 「1449 年《康富记》」未见原书依据，`sources` 为观光网站与辞书，`confidence` 却为「确证」。 | 补《康富记》条原文与卷次，或降为「版本存异/待核」。 |
| M8 | `gl-japanese-ningyohime-title` | 条目主题是「日译名」，`year` 却取原作发表年 1837，时间轴位置会与「日译名近代确立」错位。 | `year` 改取初译或通行译名确立年（待核），或在 `dateDisplay` 明确区分原作年与译名年；现 `yearNote` 已有说明，但 `year` 仍会误排。 |
| M9 | `gl-disney-little-mermaid-1989` | `narratives` 含 `f_love_sacrifice`，与本片团圆结局相悖，`summary` 亦自述「改写安徒生结局」「最终与埃里克成婚」。 | 删除 `f_love_sacrifice`；保留 `f_voice`、`f_identity`，可加 `f_marriage`。 |
| M10 | `cn-yumeiren-wuju` | 舞剧《鱼美人》属舞台作品，但 schema 的 `subtype` 与 `medium` 无「舞剧/舞台」类目，条目被迫取 `subtype: 民间传说`、`medium: 影视`，会污染按媒介筛选的结果。 | 属 schema 枚举不足，交 Lead 决策：增补 `subtype`「舞剧/舞台」与 `medium`「舞台」，或允许「其他」。 |
| M11 | 全库 36 条 | `excerpt` 为空，占 57%。文本类条目可补原文却未补，如 `gl-andersen-little-mermaid-1837`、`gl-wilde-fisherman-soul-1891`、`gl-physiologus-siren`、`gl-liber-monstrorum-sirens`、`gl-ningyo-yaobikuni`、`gl-pliny-hn9-tritons-nereids`；图像与影视条目可填题记或场景描述。详情页「原文」区因此长期为空，削弱可复核原则。 | 分两批处理：文本类补一句原文或题记，图像与影视类补图版著录或场景引文；暂不能补者，在 `summary` 说明「本条目以作品信息为主，无原文引文」。 |

## 五、低优先级问题

| 序号 | 条目 id | 问题 | 建议 |
|---|---|---|---|
| L1 | `cn-bowuzhi-jiaoren` | `summary` 中「明清楚辞类书始多见系于《博物志》者」，「楚辞类书」不成词，疑为「明清类书」之误。 | 改为「明清类书」，并核对类书书名。 |
| L2 | `cn-shanhaijing-lingyu` | 郝懿行《山海经笺疏》注文在 `sources` 自注「转引，待核原书」，但 `confidence` 为「确证」，正文以肯定语气引述注文。 | 补《山海经笺疏》通行版本，或将 `confidence` 降为「版本存异」；正文保留「据转引」限定。 |
| L3 | `gl-homer-odyssey-sirens` | `excerptSource` 标「第 39 至 46 行」，`sources[].detail` 标「第 36 至 54 行」，两处行号不一致。 | 统一为实际引文范围。 |
| L4 | `gl-merlion-singapore` | `m_giant` 的依据是雕塑高 8.6 米，属作品尺寸而非形象属性；`m_giant` 的定义要求体型对比与神性、海洋力量相关。 | 删除 `m_giant`，尺寸写入 `summary`。 |
| L5 | `cn-dianshizhai-lingyu` | `f_commodity` 的依据是画报的商业属性，而非人鱼形象被商品化或展演；该条已标「待核」，编码应更保守。 | 删除 `f_commodity`，或补图像作为商品与奇观流通的具体论证。 |
| L6 | `cn-bencaogangmu-jiaoyu` | `subtype` 取「类书」，与《本草纲目》的本草性质不符；schema 枚举无医书/本草类目。 | 与 M10 一并交 Lead 扩充枚举，暂标「类书」须在 `term.note` 说明折衷。 |
| L7 | `tools/check.js` | 文本卫生检查把 `chinanews.com.cn` 域名中的子串「nan」误判为「NaN」，导致 `cn-shanhaijing-lingyu`、`cn-soushenji-jiaoren`、`cn-bowuzhi-jiaoren` 三条 `sources[].url` 被标记。 | 工具误报，非数据问题。建议检测时排除 URL 域名字符串或加词边界；交 Lead 与 qa 处理。 |

## 六、已核对无误的代表性项

以下条目经原文或权威著录核对，引文、卷次、年代与出处基本吻合，可作为其余条目的质量参照：

1. `cn-bencaogangmu-jiaoyu`：《本草纲目》卷四十四「鱗之四・無鱗魚類」確有鮫魚条，釋名沙魚、鰙魚、鰒魚、溜魚，集解引寇宗奭、李時珍語，与条目引文一致（仅 `m_scaled` 编码有误，见 H2）。
2. `cn-taipingguangji-hairenyu`：《太平广记》卷四百六十四「海人鱼」出《洽闻记》，引文与形态描述（状如人、无鳞、有细毛、发如马尾、被捕获豢养）自洽。
3. `cn-soushenji-jiaoren`：卷十二鲛人条引文与通行本一致，「版本存异」标注恰当（类书转录有异文）。
4. `gl-homer-odyssey-sirens`：希腊文引文与《奥德赛》卷十二第 39 至 46 行内容吻合，`b_siren_song` 与 `f_temptation` 编码成立（仅 `traits` 混入叙事 id，见 H3）。
5. `gl-ovid-metamorphoses-sirens`：引文出《变形记》卷五第 551 至 563 行，阿刻罗俄斯之女、变形为鸟的叙述准确。
6. `gl-odysseus-siren-vase`：大英博物馆藏品 1842,0728.787 为「塞壬画家」阿提卡红绘陶罐，画面为奥德修斯与塞壬，年代约前 480 至前 470 年。
7. `gl-columbus-sirens-1493`：1493 年 1 月 9 日条、三条 sirenas、评语「不如画中美丽」及海牛误认的通行解释均成立（仅 `m_beauty` 编码不当，见 M2）。
8. `gl-sirenia-illiger-1811`：伊利格 1811 年建立海牛目 Sirenia，与 ITIS 分类记录一致（编码问题见 M1）。
9. `gl-andersen-little-mermaid-1837`：1837 年 4 月 7 日首次发表，收入《Eventyr, fortalte for Børn. Første Samling. Tredie Hefte》，与南丹麦大学安徒生中心作品登记一致。
10. `cn-andersen-haide-nver`：叶君健 1947 年起在剑桥据丹麦文翻译、1953 年出版的说法与新华社《环球》报道一致（「最早」表述需限定，见 M3）。
11. `cn-shanhaijing-lingyu`、`cn-shanhaijing-diren`：《海内北经》陵鱼「人面，手足，鱼身，在海中」与《海内南经》氐人国「人面而鱼身，无足」引文准确，两相对照的论述成立。
12. `gl-starbucks-siren-logo`：1971 年双尾塞壬标志、1987 年改绿遮胸、1992 年放大局部、2011 年去文字，品牌史叙述与官方页面一致；「15 世纪北欧木刻」来源存疑的标注恰当。
13. `gl-ningyo-mummy-2022`：冈山县圆珠院人鱼木乃伊经仓敷艺术科学大学团队分析、2023 年 2 月 7 日公布结果，材质构成与制作年代推测与报道一致。
14. `gl-weeki-wachee-mermaids`：1947 年开放、水下剧场表演模式、2008 年并入佛州州立公园系统，与官方页面及地方史研究一致。

## 七、系统性问题与处置建议

1. **空引文政策需要统一**（M11）。建议由 Lead 决定：文本类条目 `excerpt` 必填；图像、影视、商业、学术类允许空值，但须在 `summary` 首句说明「以作品信息为主」。这一政策应写入 `docs/CONVENTIONS.md` 与 `docs/编码手册.md`。
2. **「邻近谱系」缺明确规则**。数据库中已收录龙女、白秋练、两栖人、鱼尾狮、大鱼、白星等邻近材料，条目多以 `term.note` 自注，但研究说明与编码手册原先没有对应类别。本次审校已在 `docs/研究说明.md` 第四节补入「邻近谱系条目」一段，明确此类条目只用于功能比较、不并入任何一条形象的谱系计数。建议 Lead 复核该表述。
3. **schema 枚举不足**（M10、L6）。缺「舞剧/舞台」「本草/医书」等类目，导致条目被迫错配。建议 Lead 评估扩充 `subtypes` 与 `mediums`；若暂不扩充，应在 CONVENTIONS 中规定折衷写法的说明义务。
4. **`confidence` 与转引状态不匹配的倾向**。至少 `cn-siren-yiming`、`cn-shanhaijing-lingyu`、`gl-ningyo-yaobikuni` 三条的 `sources` 自注转引或待核，而 `confidence` 仍为「确证」。建议维护者按「转引最多标版本存异」的规则复查全部 38 条「确证」条目。
5. **译名类条目的编码口径**。译名条目（`kind: translation`）应只编码译入语文本所激活的形象特征，不宜把形象史主张直接写入 `traits`（参见 M6 的 `m_bird_body`）。
6. **工具校验的组别与误报**（H3、L7）。建议 `tools/check.js` 增加 `traits` 与 `narratives` 的组别校验，并修正 URL 字符串的「NaN」误报。

## 八、待补清单与交接

**待核条目（12 条）**：`cn-haicuotu-renyu`、`cn-dianshizhai-lingyu`、`cn-shizi-hejing`、`cn-disney-xiaomeiren`、`cn-zhifangwaiji-renyu`、`cn-renyuchuanshuo-1994`、`gl-physiologus-siren`、`gl-liber-monstrorum-sirens`、`gl-bern-physiologus-siren`、`gl-penguin-book-of-mermaids-2019`、`gl-onepiece-shirahoshi`、`gl-japanese-ningyohime-title`。建议按「补原文或题记、核原书卷次、核版本信息」三项分派。

**版本存异条目（13 条）**：`cn-soushenji-jiaoren`、`cn-bowuzhi-jiaoren`、`cn-shuyiji-quanxian`、`cn-shuyiji-jiaoxiao`、`cn-liaozhai-baiqiulian`、`gl-pliny-hn9-tritons-nereids`、`gl-columbus-sirens-1493`、`gl-starbucks-siren-logo`、`gl-weeki-wachee-mermaids`、`gl-japanese-mermaid-usage`、`gl-mermaid-siren-etymology`、`gl-benwell-waugh-sea-enchantress-1961`、`gl-merlion-singapore`。多数标注恰当，无需改动，仅需在页面上保留提醒。

**交接建议**：

- 交 Lead：H3、M10、L6、L7 涉及 schema 与工具；M11 的空引文政策；第七节第 2 条「邻近谱系」表述的复核。
- 交 curator-cn：H1、H2、H4、M3、M4、M5、M6、L1、L2、L5。
- 交 curator-global：M1、M2、M7、M8、M9、L3、L4。
- 留研究编辑：`docs/研究说明.md` 的「邻近谱系」段落（已完成）；`docs/编码手册.md` 可补一条「译名条目编码口径」的说明（本次已补入第六节译名条规则，可再对照本次问题复核）。

本次审校未发现整条虚构的条目，但存在若干「以二手转述代替原文」「编码与所据原文相悖」「confidence 高于核对程度」的情况。数据整体可用，建议按上述优先级分批修订后再次全量复扫。

## 九、修订复核记录（2026-10-18）

两位维护者已按本文意见修订两个条目文件，条目总数仍为 63（`cn-` 31、`gl-` 32）。复核方式：重跑 `node tools/check.js`（通过，0 提醒），并用脚本重扫字段、组别、`related` 与统计；对新增引文另作来源核实。本节为最新状态，正文第一至八节保留初次审校原貌。

**高优先级处置**

| 项 | 状态 | 复核说明 |
|---|---|---|
| H1 `cn-zhifangwaiji-renyu` | 已处置，仍待核 | 补《职方外纪》卷五「四海总说·海族」引文（海人、海女二种）。来源为邹振环《交流与互鉴：〈清宫海错图〉与中西海洋动物的知识及画艺》，《华东师范大学学报（哲社版）》2020 年第 3 期（经该刊官网核对确有此文）。`traits` 改为 `m_human_upper`、`m_fish_tail`、`b_captured`，`confidence` 维持待核。引文系论文转录，原书待核。 |
| H2 `cn-bencaogangmu-jiaoyu` | 已修复 | 删 `m_scaled`；补「大者尾长数尺，能伤人。皮皆有沙，如真珠斑」以立 `b_predator`，另立 `b_captured`，均与识典古籍原文相符。 |
| H3 `gl-homer-odyssey-sirens` | 已修复 | `traits` 仅存 `b_siren_song`、`b_predator`；两处行号统一为「卷十二第 39 至 46 行」。 |
| H4 `cn-guangdongxinyu-caizhu` | 已移除 | 整条删除，以新增 `cn-taipingyulan-jiaoren` 补位；采珠物产材料不再单独立目，已在研究说明补一句背景说明。 |

**中优先级处置。** M1 `gl-sirenia-illiger-1811` 改以「被借名的塞壬形象」编码，并在 `term.note` 说明不指海牛形态。M2 `gl-columbus-sirens-1493` 删 `m_beauty`，改以 15 世纪塞壬图像为参照的 `m_human_upper`、`m_fish_tail`，并补 `f_colonial` 论证。M3 安徒生条加「该报道称」与单篇译介说明。M4《锦瑟》删 `b_weave_silk`。M5 柳毅传删 `m_beauty`。M6 塞壬条降为待核、删 `m_bird_body`、补骨骸引文。M7 八百比丘尼降为版本存异，补胜浦令子《古代・中世の女性と仏教》（山川出版社，日本史リブレット 16，2003）第 83 页转引，原书待核。M8 日译名条 `year` 由 1837 改为 2003 版本依据年，`yearNote` 与 `dateDisplay` 已说明，译名确立年仍待核。M9 迪士尼 1989 与 2023 两版均删 `f_love_sacrifice`，改 `f_marriage`。M10（schema 枚举）与 M11（空引文政策）仍待 Lead 决策。

**低优先级处置。** L1「明清类书」已改。L2 陵鱼降为待核，并在正文注明郝注系转引。L3 行号已统一。L4 鱼尾狮删 `m_giant`，改 `m_scaled`。L5 点石斋删 `f_commodity`。L6 本草条已在 `term.note` 注明 subtype 折衷。L7 属 `tools/check.js` 误报，仍待 Lead 与 qa 处理。

**复核中新见问题（新增，低）**

| 序号 | 条目 id | 问题 | 建议 |
|---|---|---|---|
| N1 | `cn-taipingyulan-jiaoren` | `year` 取 984，但《太平御览》通行成书年为太平兴国八年（983）；`yearNote` 已标待核，仍差一年。 | 改为 983，或在 `yearNote` 写明所据著录；`dateDisplay` 相应调整。 |
| N2 | `cn-zhifangwaiji-renyu` | `b_captured` 的依据是 `summary` 所述「海人」被捕得献于国王，但 `excerpt` 只收「海女」一段，引文未覆盖该编码。 | `excerpt` 补「海人」句，或在 `term.note` 说明 `b_captured` 的依据为同段海人记载。 |
| N3 | `cn-jinse` | 删 `b_weave_silk` 后仅 1 个 trait，低于 CONVENTIONS「2 至 8 个」下限；`tools/check.js` 仅警告未报错。 | 不宜为凑数补无据特征。建议 Lead 修订 CONVENTIONS 为「1 至 8 个，诗文用典与译名类可仅 1 项并须说明」，或并入李商隐诗总体条目，由 Lead 裁定。 |

另见一处可议项：`cn-siren-yiming` 新增 `b_predator` 以「腐烂的尸体的／大堆骨骸」为据，按本文与编码手册「间接致死不自动计入捕食」的从严口径可议；该条已标待核且注明形体问题另见西方条目，可暂留观察。

**复核后统计**：确证 34、版本存异 15、待核 14；空 `excerpt` 35 条（影视 9、动画 5、图像 4、典籍 7、学术 4、商业 2、译名 4）；单特征条目 1 条（`cn-jinse`）。上述数字供 Lead 终审时对照。

**终审决定落实（2026-10-18）**：Lead 已裁定 CONVENTIONS：`traits` 为 1 至 8 项（诗文用典、译名/译本类可仅 1 项）；空引文政策为典籍、图像、诗歌、译名及所有 `ancient` 条目必填，影视、动画、游戏、舞台、商业、学术类可为空但须在 `summary` 末尾注明；`schema` 新增 `subtype`「舞台」「医书」与 `medium`「舞台」，`tools/check.js` 同步增加组别、空引文与枚举校验。按新校验复核 63 条：空引文政策违规 0、`traits` 计数违规 0、枚举违规 0，全库文本无 U+2014、U+2013 与中文双破折号（`gl-odysseus-siren-vase` 的年代连接号已改为普通连字符，`dateDisplay` 改用「至」）；`cn-yumeiren-wuju` 已改用「舞台/舞台」，`cn-bencaogangmu-jiaoyu` 已改用「医书/典籍」。14 条 gl 空引文条目已在 `summary` 末尾加注「本条目以作品信息为主，无原文引文」，`term.note` 原说明保留，两处并备。最终复核：63 条，`node tools/check.js` 通过、0 提醒；空引文 19 条均有注，`summary` 字数全部落在 120 至 220 字。
