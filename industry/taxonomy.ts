// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * tagColor 是飞书推送卡片里跟在标题后面的这一类小标签的颜色（飞书 text_tag 的颜色名）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  {
    "key": "chips-products",
    "tagColor": "indigo",
    "label": "芯片与产品",
    "feedLabel": "芯片与产品",
    "section": "芯片与产品",
    "guide": "GPU/NPU/ASIC/SoC、模块、加速卡新品与实质迭代；工具链归技术与生态。"
  },
  {
    "key": "market-business",
    "tagColor": "orange",
    "label": "市场与商业",
    "feedLabel": "市场与商业",
    "section": "市场与商业",
    "guide": "定点、出货、订单、融资、并购、合作及供给变化；定点不等交付。"
  },
  {
    "key": "technology-ecosystem",
    "tagColor": "violet",
    "label": "技术与生态",
    "feedLabel": "技术与生态",
    "section": "技术与生态",
    "guide": "计算架构、推理框架、量化、编译与模型部署研究；模型需关联计算部署价值。"
  },
  {
    "key": "applications",
    "tagColor": "turquoise",
    "label": "应用与场景",
    "feedLabel": "应用与场景",
    "section": "应用与场景",
    "guide": "智驾、Robotaxi、RoboVan、机器人与具身智能中的计算需求；泛汽车资讯排除。"
  },
  {
    "key": "policy-industry",
    "tagColor": "blue",
    "label": "政策与产业",
    "feedLabel": "政策与产业",
    "section": "政策与产业",
    "guide": "直接影响计算芯片的政策、出口限制、标准、制程封装与存储供应链。"
  }
] as const satisfies ReadonlyArray<{ key: string; tagColor: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = { category: "chips-products", tag: "芯片发布", unit: "项芯片发布" };

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["ai", "api", "llm", "gpu", "agi", "ceo", "ipo"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["model_release", "product_launch", "tool_or_prompt", "research_paper", "industry_event", "opinion_analysis", "tutorial_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = ["芯片发布", "量产定点", "出货",
  "产品更新", "模型发布", "论文/研究", "开源/仓库", "教程/实践", "现象/趋势", "大佬观点", "评测/基准", "安全/对齐", "行业动态", "政策/监管",
  "非AI/通用工具", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = ["云端推理", "云端训练", "端侧推理", "智能驾驶", "RoboVan", "Robotaxi", "人形机器人", "VLA", "VLM", "E2E", "量化", "模型编译", "推理框架", "内存带宽", "功耗/能效", "Thor", "Orin", "Jetson", "EyeQ", "Snapdragon Ride", "征程", "A2000", "X7",
  "Agent", "编码", "推理", "多模态", "语音", "视频", "图像生成", "RAG", "端侧", "数据/训练", "搜索", "部署/工程", "开源生态", "具身智能", "MCP/工具调用",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["NVIDIA", "AMD", "Intel", "华为", "寒武纪", "昆仑芯", "阿里平头哥", "沐曦", "天数智芯", "壁仞", "摩尔线程", "海光", "地平线", "黑芝麻智能", "爱芯元智", "新芯航途", "Qualcomm", "Mobileye", "九识智能", "新石器", "宇树", "智元机器人", "Hailo", "Axelera", "OpenAI", "Anthropic", "DeepSeek", "DeepMind", "Google", "Meta", "Microsoft", "xAI", "Hugging Face", "GitHub", "arXiv"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  "教程/玩法": "教程/实践", "技巧/最佳实践": "教程/实践", "合作/生态": "行业动态", "融资/收购": "行业动态", "公司动态": "行业动态",
  合作: "行业动态", 生态: "行业动态", 融资: "行业动态", 收购: "行业动态", 投资: "行业动态", 并购: "行业动态",
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 安全: "安全/对齐", 对齐: "安全/对齐",
  论文: "论文/研究", 研究: "论文/研究", paper: "论文/研究", papers: "论文/研究",
  "open-source": "开源/仓库", 开源: "开源/仓库", 仓库: "开源/仓库", repo: "开源/仓库",
  教程: "教程/实践", 玩法: "教程/实践", 指南: "教程/实践", 技巧: "教程/实践", 最佳实践: "教程/实践", 实践: "教程/实践",
  产品: "产品更新", 更新: "产品更新", 发布: "模型发布", 模型: "模型发布", 趋势: "现象/趋势", 现象: "现象/趋势", 观点: "大佬观点",
  视频生成: "视频", 非ai: "非AI/通用工具", "non-ai": "非AI/通用工具", 通用工具: "非AI/通用工具", 工程工具: "非AI/通用工具",
  安全扫描: "非AI/通用工具", devops: "非AI/通用工具", 行业: "行业动态", 动态: "行业动态",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；orgNames 是这家公司发消息时开头用的组织名（公司、实验室、团队），
 * 在它自己的主题页上读者知道说的是谁，可以省去；otherNames 是公司的其他称呼（官方账号名、子品牌）。
 * 所有这些名字都用来认出说的是哪家公司，比如把事实的主体对到发布方。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; orgNames?: string[]; otherNames?: string[] }> = {
"intel": {"name": "Intel", "displayTag": null, "aliases": ["Intel", "英特尔"], "orgNames": ["Intel", "英特尔"]},
"huawei": {"name": "华为", "displayTag": null, "aliases": ["华为", "Huawei", "昇腾", "Ascend"], "orgNames": ["华为", "Huawei", "昇腾", "Ascend"]},
"cambricon": {"name": "寒武纪", "displayTag": null, "aliases": ["寒武纪", "Cambricon"], "orgNames": ["寒武纪", "Cambricon"]},
"kunlun": {"name": "昆仑芯", "displayTag": null, "aliases": ["昆仑芯", "Kunlunxin"], "orgNames": ["昆仑芯", "Kunlunxin"]},
"t-head": {"name": "阿里平头哥", "displayTag": null, "aliases": ["平头哥", "T-Head"], "orgNames": ["平头哥", "T-Head"]},
"metax": {"name": "沐曦", "displayTag": null, "aliases": ["沐曦", "MetaX"], "orgNames": ["沐曦", "MetaX"]},
"iluvatar": {"name": "天数智芯", "displayTag": null, "aliases": ["天数智芯", "Iluvatar"], "orgNames": ["天数智芯", "Iluvatar"]},
"biren": {"name": "壁仞", "displayTag": null, "aliases": ["壁仞", "Biren"], "orgNames": ["壁仞", "Biren"]},
"moore": {"name": "摩尔线程", "displayTag": null, "aliases": ["摩尔线程", "Moore Threads"], "orgNames": ["摩尔线程", "Moore Threads"]},
"hygon": {"name": "海光", "displayTag": null, "aliases": ["海光", "Hygon"], "orgNames": ["海光", "Hygon"]},
"horizon": {"name": "地平线", "displayTag": null, "aliases": ["地平线", "Horizon Robotics"], "orgNames": ["地平线", "Horizon Robotics"]},
"black-sesame": {"name": "黑芝麻智能", "displayTag": null, "aliases": ["黑芝麻智能", "Black Sesame"], "orgNames": ["黑芝麻智能", "Black Sesame"]},
"axera": {"name": "爱芯元智", "displayTag": null, "aliases": ["爱芯元智", "Axera"], "orgNames": ["爱芯元智", "Axera"]},
"xheart": {"name": "新芯航途", "displayTag": null, "aliases": ["新芯航途", "XHEART"], "orgNames": ["新芯航途", "XHEART"]},
"qualcomm": {"name": "Qualcomm", "displayTag": null, "aliases": ["Qualcomm", "高通"], "orgNames": ["Qualcomm", "高通"]},
"mobileye": {"name": "Mobileye", "displayTag": null, "aliases": ["Mobileye"], "orgNames": ["Mobileye"]},
"zelos": {"name": "九识智能", "displayTag": null, "aliases": ["九识智能", "Zelos"], "orgNames": ["九识智能", "Zelos"]},
"neolix": {"name": "新石器", "displayTag": null, "aliases": ["新石器", "Neolix"], "orgNames": ["新石器", "Neolix"]},
"unitree": {"name": "宇树", "displayTag": null, "aliases": ["宇树", "Unitree"], "orgNames": ["宇树", "Unitree"]},
"agibot": {"name": "智元机器人", "displayTag": null, "aliases": ["智元机器人", "Agibot"], "orgNames": ["智元机器人", "Agibot"]},
"hailo": {"name": "Hailo", "displayTag": null, "aliases": ["Hailo"], "orgNames": ["Hailo"]},
"axelera": {"name": "Axelera", "displayTag": null, "aliases": ["Axelera"], "orgNames": ["Axelera"]},

  "world-labs": { name: "World Labs", displayTag: null, aliases: ["World Labs"] },
  "thinking-machines": { name: "Thinking Machines Lab", displayTag: null, aliases: ["Thinking Machines"] },
  amd: { name: "AMD", displayTag: null, aliases: ["AMD", "Advanced Micro Devices"] },
  openai: { name: "OpenAI", displayTag: "OpenAI", aliases: ["OpenAI", "ChatGPT", "Sora", "Codex", "GPT"], orgNames: ["OpenAI"], otherNames: ["OpenAI Developers"] },
  anthropic: { name: "Anthropic", displayTag: "Anthropic", aliases: ["Anthropic", "Claude"], orgNames: ["Anthropic"], otherNames: ["Claude Code"] },
  google: { name: "Google", displayTag: "Google", aliases: ["Google", "DeepMind", "Gemini", "谷歌"], orgNames: ["Google DeepMind", "Google Research", "Google", "DeepMind", "谷歌"], otherNames: ["Google AI", "Google Labs", "Google Cloud"] },
  deepseek: { name: "DeepSeek", displayTag: "DeepSeek", aliases: ["DeepSeek", "深度求索"], orgNames: ["DeepSeek", "深度求索"] },
  qwen: { name: "千问 Qwen", displayTag: null, aliases: ["Qwen", "通义", "阿里"], orgNames: ["通义千问", "通义实验室", "阿里巴巴", "阿里云", "阿里", "Qwen Team", "Qwen", "Alibaba"], otherNames: ["千问", "千问APP", "Alibaba Cloud"] },
  kimi: { name: "月之暗面 / Kimi", displayTag: null, aliases: ["Kimi", "月之暗面", "Moonshot", "Kimi / 月之暗面"], orgNames: ["Moonshot AI", "月之暗面", "Kimi"] },
  minimax: { name: "MiniMax", displayTag: null, aliases: ["MiniMax", "海螺"], orgNames: ["MiniMax", "稀宇科技"] },
  zhipu: { name: "智谱 GLM", displayTag: null, aliases: ["智谱", "GLM", "Z.ai"], orgNames: ["智谱AI", "智谱", "Zhipu AI", "Z.ai"], otherNames: ["Zhipu"] },
  xai: { name: "xAI", displayTag: "xAI", aliases: ["xAI", "Grok"], orgNames: ["SpaceX Super Intelligence", "SpaceXAI", "SpaceXSI", "xAI"], otherNames: ["Grok Bot"] },
  meta: { name: "Meta", displayTag: "Meta", aliases: ["Meta", "Llama"], orgNames: ["Meta Superintelligence Labs", "Meta AI", "Meta"], otherNames: ["AI at Meta", "Muse"] },
  microsoft: { name: "Microsoft", displayTag: "Microsoft", aliases: ["Microsoft", "微软", "Copilot"], orgNames: ["Microsoft Research", "Microsoft AI", "Microsoft", "微软"] },
  nvidia: { name: "NVIDIA", displayTag: null, aliases: ["NVIDIA", "英伟达"], orgNames: ["NVIDIA", "英伟达"] },
  "hugging-face": { name: "Hugging Face", displayTag: "Hugging Face", aliases: ["Hugging Face"], orgNames: ["Hugging Face", "HuggingFace"] },
  cursor: { name: "Cursor", displayTag: null, aliases: ["Cursor", "Anysphere"], orgNames: ["Cursor"] },
  openrouter: { name: "OpenRouter", displayTag: null, aliases: ["OpenRouter"], orgNames: ["OpenRouter"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "amd", name: "AMD", patterns: [/\bAMD\b|Advanced Micro Devices/i] },
{ id: "intel", name: "Intel", patterns: [/Intel|英特尔/i] },
{ id: "huawei", name: "华为", patterns: [/华为|Huawei|昇腾|Ascend/i] },
{ id: "cambricon", name: "寒武纪", patterns: [/寒武纪|Cambricon/i] },
{ id: "kunlun", name: "昆仑芯", patterns: [/昆仑芯|Kunlunxin/i] },
{ id: "t-head", name: "阿里平头哥", patterns: [/平头哥|T\-Head/i] },
{ id: "metax", name: "沐曦", patterns: [/沐曦|MetaX/i] },
{ id: "iluvatar", name: "天数智芯", patterns: [/天数智芯|Iluvatar/i] },
{ id: "biren", name: "壁仞", patterns: [/壁仞|Biren/i] },
{ id: "moore", name: "摩尔线程", patterns: [/摩尔线程|Moore\ Threads/i] },
{ id: "hygon", name: "海光", patterns: [/海光|Hygon/i] },
{ id: "horizon", name: "地平线", patterns: [/地平线|Horizon\ Robotics/i] },
{ id: "black-sesame", name: "黑芝麻智能", patterns: [/黑芝麻智能|Black\ Sesame/i] },
{ id: "axera", name: "爱芯元智", patterns: [/爱芯元智|Axera/i] },
{ id: "xheart", name: "新芯航途", patterns: [/新芯航途|XHEART/i] },
{ id: "qualcomm", name: "Qualcomm", patterns: [/Qualcomm|高通/i] },
{ id: "mobileye", name: "Mobileye", patterns: [/Mobileye/i] },
{ id: "zelos", name: "九识智能", patterns: [/九识智能|Zelos/i] },
{ id: "neolix", name: "新石器", patterns: [/新石器|Neolix/i] },
{ id: "unitree", name: "宇树", patterns: [/宇树|Unitree/i] },
{ id: "agibot", name: "智元机器人", patterns: [/智元机器人|Agibot/i] },
{ id: "hailo", name: "Hailo", patterns: [/Hailo/i] },
{ id: "axelera", name: "Axelera", patterns: [/Axelera/i] },
  { id: "openai", name: "OpenAI", patterns: [/openai|chatgpt|\bgpt-?[o\d]|\bsora\b|\bcodex\b/i] },
  { id: "anthropic", name: "Anthropic", patterns: [/anthropic|\bclaude\b/i, /\b(?:opus|sonnet|haiku)\s*\d+(?:[.\-]\d+)*\b/i, /\bfable\s*\d+(?:[.\-]\d+)*\b|\bmythos\b/i] },
  { id: "google", name: "Google / Gemini", patterns: [/google|deepmind|\bgemini\b|notebooklm|\bveo\s?\d|\bAlphaFold\b|\bAMIE\b/i] },
  { id: "deepseek", name: "DeepSeek", patterns: [/deepseek|深度求索/i] },
  { id: "xai", name: "xAI / Grok", patterns: [/\bxai\b|\bgrok\b/i] },
  { id: "meta", name: "Meta / Llama", patterns: [/\bMeta\b/, /\bmeta\s?ai\b|\bllama\b/i] },
  { id: "microsoft", name: "Microsoft / Copilot", patterns: [/microsoft|copilot|微软/i] },
  { id: "nvidia", name: "NVIDIA", patterns: [/nvidia|英伟达|\bnemotron\b|\bnemo\b|\bblackwell\b|\brubin(?:\s+ultra)?\b|\bcuda\b/i] },
  { id: "qwen", name: "千问 Qwen", patterns: [/\bqwen|通义|千问/i] },
  { id: "hugging-face", name: "Hugging Face", patterns: [/hugging\s?face/i] },
  { id: "cursor", name: "Cursor", patterns: [/\bCursor\b/] },
  { id: "kimi", name: "月之暗面 / Kimi", patterns: [/\bkimi\b|月之暗面|\bmoonshot\s?ai\b/i] },
  { id: "openrouter", name: "OpenRouter", patterns: [/openrouter/i] },
  { id: "minimax", name: "MiniMax", patterns: [/minimax/i] },
  { id: "zhipu", name: "智谱 GLM", patterns: [/智谱|\bglm-?[4-9]/i] },
  { id: "hunyuan", name: "腾讯混元", patterns: [/混元|hunyuan/i] },
  { id: "doubao", name: "字节豆包", patterns: [/豆包|doubao|字节跳动|bytedance/i] },
  { id: "mistral", name: "Mistral", patterns: [/mistral/i] },
  { id: "perplexity", name: "Perplexity", patterns: [/\bPerplexity\b/] },
  { id: "runway", name: "Runway", patterns: [/\brunway\b/i] },
  { id: "suno", name: "Suno", patterns: [/\bsuno\b/i] },
  { id: "midjourney", name: "Midjourney", patterns: [/midjourney/i] },
  { id: "stability-ai", name: "Stability AI", patterns: [/stability\s?ai/i] },
  { id: "elevenlabs", name: "ElevenLabs", patterns: [/eleven\s?labs/i] },
  { id: "vllm", name: "vLLM", patterns: [/\bvllm\b/i] },
  { id: "ollama", name: "Ollama", patterns: [/\bollama\b/i] },
  { id: "windsurf", name: "Windsurf", patterns: [/windsurf/i] },
  { id: "devin", name: "Devin", patterns: [/\bdevin\b/i] },
  { id: "manus", name: "Manus", patterns: [/\bmanus\b/i] },
  { id: "apple", name: "Apple AI", patterns: [/\bapple\s?(intelligence|silicon|ai)\b|苹果(智能|\s?AI)/i] },
  { id: "amazon", name: "Amazon / AWS", patterns: [/amazon|\baws\b|亚马逊/i] },
  { id: "baidu", name: "百度文心", patterns: [/百度|baidu|文心|\bernie\s?bot\b/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "openai", domains: ["openai.com"] },
  { entityId: "anthropic", domains: ["anthropic.com", "claude.com"] },
  { entityId: "google", domains: ["deepmind.google", "ai.google", "blog.google"] },
  { entityId: "deepseek", domains: ["deepseek.com"] },
  { entityId: "xai", domains: ["x.ai"] },
  { entityId: "meta", domains: ["ai.meta.com"] },
  { entityId: "microsoft", domains: ["microsoft.com"] },
  { entityId: "nvidia", domains: ["nvidia.com"] },
  { entityId: "qwen", domains: ["qwen.ai"] },
  { entityId: "cursor", domains: ["cursor.com"] },
  { entityId: "openrouter", domains: ["openrouter.ai"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "meta", pattern: /@AIatMeta\b/i },
  { entityId: "zhipu", pattern: /\bZhipu(?:\s+AI\b|['’]s\b)/i },
];
