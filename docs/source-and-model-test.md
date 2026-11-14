# 信源与模型实测

测试日期：2026-11-15（北京时间）。本次是有界测试，持续采集和消息发送保持关闭。

## 真实信源预览

通过真实管理员接口逐一预览数据库中的36个源，3并发；11个返回近期条目，10个在当前发布时间窗口内无条目，15个抓取失败。原9个启用源全部返回条目。没有改变源开关或将预览内容入库。

本轮新增S02与S36预览返回条目；它们仍停用，不能据此宣布自动接入完成。列表数量、近期内容、正文完整性、日期准确性与稳定采集是不同验收项：本次只证明此时原生预览结果；未对每篇正文和日期人工核对。零条目不自动等于失效源，也可能当前窗口没有更新。HTTP403保留错误，不绕过访问限制。

| ID | 信源 | 数据库启用 | 本轮结果 | 条目数 | 错误 |
|---|---|---|---|---:|---|
| S01 | NVIDIA开发者博客 | 是 | 近期条目预览成功 | 24 | — |
| S02 | NVIDIA DRIVE（官方博客汽车栏目候选） | 否 | 近期条目预览成功 | 1 | — |
| S03 | AMD新闻 | 是 | 近期条目预览成功 | 3 | — |
| S04 | Intel | 否 | 抓取失败 | 0 | no items matched (html) |
| S05 | Qualcomm | 否 | 抓取失败 | 0 | no items matched (html) |
| S06 | Mobileye | 否 | 当前窗口无条目 | 0 | — |
| S07 | 地平线 | 否 | 当前窗口无条目 | 0 | — |
| S08 | 黑芝麻智能 | 否 | 抓取失败 | 0 | no items matched (html) |
| S09 | 爱芯元智 | 是 | 近期条目预览成功 | 1 | — |
| S10 | 新芯航途 | 否 | 抓取失败 | 0 | no items matched (html) |
| S11 | 昇腾 | 否 | 抓取失败 | 0 | no items matched (html) |
| S12 | 寒武纪 | 否 | 抓取失败 | 0 | no items matched (html) |
| S13 | 阿里云技术 | 否 | 抓取失败 | 0 | no items matched (html) |
| S14 | PyTorch | 否 | 当前窗口无条目 | 0 | — |
| S15 | TensorRT-LLM | 是 | 近期条目预览成功 | 1 | — |
| S16 | ONNX | 否 | 当前窗口无条目 | 0 | — |
| S17 | LeRobot | 是 | 近期条目预览成功 | 1 | — |
| S18 | arXiv Robotics | 否 | 当前窗口无条目 | 0 | — |
| S19 | 九识智能 | 否 | 抓取失败 | 0 | no items matched (html) |
| S20 | 新石器 | 否 | 抓取失败 | 0 | no items matched (html) |
| S21 | 宇树 | 否 | 当前窗口无条目 | 0 | — |
| S22 | 智元机器人 | 否 | 抓取失败 | 0 | no items matched (html) |
| S23 | 工信部 | 否 | 当前窗口无条目 | 0 | — |
| S24 | 盖世汽车 | 否 | 抓取失败 | 0 | fetch failed |
| S25 | 机器之心 | 否 | 抓取失败 | 0 | no items matched (html) |
| S26 | TrendForce | 否 | 抓取失败 | 0 | no items matched (html) |
| S27 | SEMI | 否 | 抓取失败 | 0 | HTTP 403 |
| S28 | Tesla投资者关系 | 否 | 抓取失败 | 0 | HTTP 403 |
| S29 | Intel OpenVINO | 否 | 当前窗口无条目 | 0 | — |
| S30 | ONNX Runtime | 是 | 近期条目预览成功 | 2 | — |
| S31 | vLLM | 是 | 近期条目预览成功 | 1 | — |
| S32 | SGLang | 是 | 近期条目预览成功 | 1 | — |
| S33 | NVIDIA TensorRT | 否 | 当前窗口无条目 | 0 | — |
| S34 | AMD ROCm | 否 | 当前窗口无条目 | 0 | — |
| S35 | Hugging Face Transformers | 是 | 近期条目预览成功 | 2 | — |
| S36 | NVIDIA官方新闻 | 否 | 近期条目预览成功 | 20 | — |

本机原始证据：evidence/source-preview-2026-11-14T22-11-09.972Z.json；运行脚本：evidence/run-source-preview-batch.mjs。历史信源CSV保留初次采集的数量和状态，当前后台预览结果以本文件为准。

## GPT模型测试

用户明确要求优先使用Codex额度。本机Codex CLI已通过ChatGPT登录，测试通过已有automation-model-runtime/run-model.py执行其支持的gpt-6.1-sol；不提取或复制登录令牌，不需要给本次测试新建API Key。

测试设计：本机临时loopback适配层接收原生chatJson请求，将原始行业提示词交给真实Codex模型；原生analyzeArticle连接独立chip_insight_test库。最多8次推理、1篇AMD真实新闻及1条明确标为合成的无关负例。持续网站进程的.env与阀门不变。测试适配层只用于本机单次验证，不安装为常驻后端。

实际结果：原生处理集成测试通过，真实Codex请求6次，六条回执均completed。

- 真实AMD官方新闻：预筛通过；独立双评分84/84；主频道chips-products；主体amd；生成中文标题和摘要。使用实际获取的21444字符正文，未用模型编造原始新闻。
- 合成无关负例：预筛BLOCK，仅1次请求，后续评分、摘要均未调用。
- 原生JSON解析与字段校验通过，完成分析写入隔离测试库；没有改动业务网站数据库、.env或常驻任务。测试后临时适配层退出、测试库停止。
- 模型文本只做企业与产品名称的有限抽检，原始输出保留，未进行逐句业务审查。两条样本不足以计算精选精确率、召回率或归组质量，也未测试真实热点和成刊。

Codex订阅余量单位、精确token及人民币成本不从API价格推算。准确的剩余额度仍以Codex账户显示为准。

本机原始证据：evidence/codex-processing-2026-11-14T22-17-27.427Z.json；运行脚本：evidence/run-codex-processing-test.mjs。该脚本依赖本机既有automation-model-runtime和隔离测试环境，不是已经安装到网站的通用模型后端。

官方依据：[Codex认证](https://learn.chatgpt.com/docs/auth)、[非交互执行与已保存登录复用](https://learn.chatgpt.com/docs/non-interactive-mode)。此前关于API Key缺失的结论针对网站现有API接法；本次Codex测试走独立本机路径。
