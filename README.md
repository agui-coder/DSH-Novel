# DSH-Novel · AI 网文写作环境

> 把 DeepSeek Harness 一键变成「AI 写小说」工作台：**28 个网文写作工具 + 深度知识库（11 个 skill）+ 9-Agent 长篇小说流水线 + 小说阅览窗口**，全部集成在一个 Agent 预设「小说助手」里。
> 本项目整合自 [awesome-novel-agent](https://github.com/modoojunko/awesome-novel-skill)（写作方法论与多智能体流水线）与 DSH-Novel（DSH 原生载体），取长补短、面向 DeepSeek Harness 原生运行。
> 把本仓库（或 GitHub 链接）交给任意 DeepSeek Harness Agent，按 `INSTALL.md` 执行即可自动安装完成。

---

## 一、这是什么

| 组件 | 类型 | 作用 |
| --- | --- | --- |
| **novel-assistant** 插件（动态） | 动态 Cordis 插件（Host + Client） | 融合「写作工具」与「阅览窗口」：① **27 个 `novel_*` 写作工具**（Host）：润色、续写、大纲整理/优化/续写、小说分析、拆书学习、灵感生成、世界观构建、角色设计、章节规划、场景写作、黄金三章、书名/标题、简介与梗概、作品评阅、改写、对话优化、文学翻译、剧情漏洞排查、起名、文风设定、情节推演、风格蒸馏、伏笔台账、角色状态、节奏检查——每个工具都调用当前会话模型做**真正的文本生成**；② **小说阅览窗口**（Host 文件读写 RPC + Client 浮动窗口 UI）：浏览 / 查看 / 编辑 / 复制工作区文本文件，中文排版优化、保存写回。 |
| **小说助手（novelist）** Agent 预设（持久） | 用户 Agent 预设 | 以写小说为核心的人设 + 《网文创作方法论》提示段 + **28 个写作工具**（比动态插件多 1 个：一致性体检）+ **11 个运行时 skill**（深度知识库 + 9-Agent 流水线手册 + 项目骨架初始化）。任何会话选择该预设即自带全部写作能力，不依赖动态插件。 |

## 二、能力总览

### 28 个写作工具（随预设持久）

- **创作**：续写、场景写作（四步转化法）、黄金三章、改写、对话优化、文学翻译
- **规划**：大纲整理/优化/续写、章节规划、情节推演、灵感、世界观、角色设计、起名
- **研究**：作品分析、拆书学习、剧情漏洞排查、作品评阅、文风设定、书名与简介
- **工程**（整合自 awesome-novel-agent，动态插件不含一致性体检）：风格蒸馏、伏笔台账、角色状态、节奏检查、一致性体检

### 11 个运行时 skill（随预设持久，按需加载）

| skill | 内容 |
| --- | --- |
| `novel-knowledge` | 知识库索引：按任务路由到下面 8 个分区 |
| `novel-knowledge-anti-ai` | 反 AI 味写作库：通用规则、边界豁免、分题材高频 AI 病句正反例 |
| `novel-knowledge-genre` | 24 套题材画像（仙侠/都市/悬疑/历史/科幻末世/西方奇幻等） |
| `novel-knowledge-scene` | 场景写作方法论（对话/打斗/群像/环境/内心独白/视角/转场 + 四步转化法） |
| `novel-knowledge-plot` | 剧情设计方法论（冲突/情绪/钩子/反转/悲剧） |
| `novel-knowledge-character` | 角色设定方法论（反派模板） |
| `novel-knowledge-title` | 取书名方法论 |
| `novel-knowledge-format` | 格式规范（章纲/卷纲/提示词/设定/记忆/正文基底） |
| `novel-knowledge-style` | 风格蒸馏（特征提取/渲染/验收提示词模板） |
| `novel-agents` | 9-Agent 流水线手册（总指挥协议 + 8 个子 agent 定义与 SOP） |
| `novel-project-init` | 项目骨架初始化（story.md / settings / volumes / chapters / archives / memory / .agent） |

### 9-Agent 长篇小说流水线

继承 awesome-novel-agent 的成熟多智能体协作，映射到 DSH 原生原语（`subagent` + 文件协议）：

```
总指挥（小说助手主 Agent）
  ├─ setup    → updater（写设定）/ style-distiller（蒸馏文风）
  ├─ outline  → volume-planner（卷纲）→ chapter-planner（章纲）
  ├─ draft    → prompt-crafter（提示词）→ writer（正文）
  ├─ anti-ai  → anti-ai（去 AI 味管线）
  ├─ review   → reader（深度评审，可选）
  └─ archive  → updater（归档 + 记忆维护）
```

- 路由依据 `.agent/status.md#phase`；子 agent 用 order 文件（`.agent/task/`）通信，完成后标 `status: DONE`。
- 归档幂等、伏笔台账、角色状态、节奏检查、两级记忆（动态 → 永久晋升）完整保留。

## 三、目录结构

```
DSH-Novel/
├── README.md                      # 本说明
├── LICENSE                        # GPLv3
├── NOTICE.md                      # 版权与许可声明（MIT 原版 + GPLv3 移植内容）
├── INSTALL.md                     # 安装指引（交给 Agent 执行，或手动参考）
├── skills/novel-reading-window/   # 「装阅览窗口」skill（复制到 ~/.dsh/skills/）
│   └── SKILL.md                   # 一句话安装动态插件的完整步骤
└── agent-presets/novelist/        # 「小说助手」预设（复制到 ~/.dsh/.agent-presets/novelist）
    ├── preset.yml                 # 预设元数据
    ├── agent.cordis.yml           # 组合文件（人设 + 标准工作台 + 两个本地插件）
    ├── plugins/
    │   ├── novel-tools.mjs        # 28 个写作工具 + 《网文创作方法论》
    │   ├── novel-knowledge.mjs    # 读入 knowledge/agents/skills/templates → 注册 11 个运行时 skill
    │   ├── novel-assistant.host.js    # 阅览窗口动态插件 Host 半部（随预设分发，供安装 skill 读取）
    │   └── novel-assistant.client.js  # 阅览窗口动态插件 Client 半部（随预设分发，供安装 skill 读取）
    ├── knowledge/                 # 深度知识库（反AI/题材/场景/剧情/角色/书名/格式/风格蒸馏）
    ├── agents/                    # 9 个写作 agent 定义（流水线手册用）
    ├── skills/                    # 各环节 SOP（流水线手册用）
    └── templates/project/         # 项目骨架模板（novel-project-init 用）
```

## 四、安装

### 方式一：交给 DSH 自动安装（推荐）

1. 把本仓库目录（或 GitHub 链接）交给任意 DeepSeek Harness Agent，例如：
   > “请把 DSH-Novel 项目安装到当前环境，按 INSTALL.md 执行。”
2. Agent 会按 `INSTALL.md` 依次完成：
   - 用 `cordis_define` + `cordis_run` 安装 **novel-assistant** 插件（阅览窗口）；
   - 插件含浏览器界面，需要你在 **Run 卡片上点一次「允许」**；
   - 把 `agent-presets/novelist/` 复制到 `~/.dsh/.agent-presets/novelist`（知识库/流水线/模板随目录自动带上，无需额外步骤）；
   - 用 `agentPresets.standingKeyFor('novelist')` 做挂载校验；
   - 完成后新建会话选择「小说助手」即可开始写作。

### 方式二：手动安装

见 `INSTALL.md` 中的逐条步骤。

## 五、使用

- **日常写作**：新建会话 → 预设选择「**小说助手**」→ 直接对话：
  - “把这些素材整理成大纲，再规划第一卷 10 章”
  - “接着这篇正文续写 2000 字，结尾留钩子”
  - “帮我润色这段 / 拆解这段开篇学它的钩子写法”
- **长篇小说流水线**：说“帮我开本新书”或“用 9-Agent 流水线推进”：
  1. `skill('novel-project-init')` 建项目骨架；
  2. `skill('novel-agents')` 加载流水线手册；
  3. 总指挥按 `.agent/status.md` 路由，用 `subagent` 调度子 agent 逐阶段推进。
- **深度规则按需查**：`skill('novel-knowledge')` 查索引 → `skill('novel-knowledge-anti-ai')` 等加载具体规则。
- **查看与微调成稿**：网页右上角「📖 阅览」打开小说阅览窗口 → 查看章节 → 手动微调 → 保存 → 继续让 Agent 接着写。

## 六、说明

- **持久性**：
  - **28 个写作工具 + 11 个 skill：持久**。「小说助手」预设内置（`novel-tools.mjs` + `novel-knowledge.mjs`），任何选择该预设的会话都自带全部能力，无需每次安装。
  - **小说阅览窗口：会话级**。浏览器 UI 依赖 DSH 的动态插件机制（进程级、会话级），进程重启后重装一次即可——在 `cordis` 预设会话里加载 skill `novel-reading-window` 照做，一句话搞定。
- **模型路由**：所有工具默认调用当前会话默认模型，每个工具都支持 `provider` / `model` 覆盖。
- **文件安全**：阅览窗口读写严格限制在当前会话工作区内（`fs.contains` 边界校验 + 会话沙箱策略）。
- **与动态插件的关系**：动态插件（`agent-presets/novelist/plugins/novel-assistant.{host,client}.js`）提供 27 个工具 + 阅览窗口；预设内置 28 个工具（多出的 1 个为「一致性体检」）。日常写作以预设为准，阅览窗口按需装动态插件。

## 七、维护

- 修改工具/方法论：编辑 `agent-presets/novelist/plugins/novel-tools.mjs`；如涉及阅览窗口侧的基础工具，同步 `agent-presets/novelist/plugins/novel-assistant.host.js`。
- 修改知识库/流水线/模板：直接编辑 `agent-presets/novelist/knowledge|agents|skills|templates/project/` 下文件，复制覆盖到 `~/.dsh/.agent-presets/novelist/` 后重新挂载校验（`novel-knowledge.mjs` 在挂载时重读）。
- 修改「装阅览窗口」skill：编辑 `skills/novel-reading-window/SKILL.md`，复制覆盖到 `~/.dsh/skills/novel-reading-window/`。
- 卸载：动态插件 `cordis_stop` / `cordis_undefine`；预设删除 `~/.dsh/.agent-presets/novelist` 目录；skill 删除 `~/.dsh/skills/novel-reading-window` 目录。

## 八、许可证与致谢

本项目以 [GPLv3](LICENSE) 分发，详见 [NOTICE.md](NOTICE.md)。

- 原 DSH-Novel（© 2026 KurohaneKaoruko，MIT）提供 DSH 原生插件/预设/阅览窗口载体。
- 整合自 [awesome-novel-agent / awesome-novel-skill](https://github.com/modoojunko/awesome-novel-skill)（© modoojunko，GPLv3）的写作方法论、知识库、9-agent 流水线与项目骨架。
- awesome-novel-agent 部分设计受 [InkOS](https://github.com/Narcooo/inkos) 启发。
