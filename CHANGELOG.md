# Changelog

本文件记录 DSH-Novel 的重要变更。版本号遵循语义化版本（SemVer）。

## [Unreleased]

### 新增（整合 awesome-novel-agent）

- **深度知识库**：移植 awesome-novel-agent 的 `knowledge/`（反 AI 规则、24 套题材画像、场景/剧情/角色/书名方法论、格式规范、风格蒸馏）到预设目录，由 `novel-knowledge.mjs` 在预设挂载时注册为 **11 个运行时 skill**（`novel-knowledge` 索引 + 8 个分区 + `novel-agents` + `novel-project-init`）。
- **9-Agent 长篇流水线**：移植 awesome-novel-agent 的 9 个写作 agent（总指挥 + volume-planner / chapter-planner / prompt-crafter / writer / anti-ai / reader / updater / style-distiller）与 18 个环节 SOP，映射到 DSH 原生 `subagent` + order 文件 + `.agent/status.md#phase` 路由。
- **4 个新写作工具**（`novel-tools.mjs` 23→27，`novel-assistant.host.js` 同步）：`novel_style_distill`（风格蒸馏）、`novel_foreshadowing`（伏笔台账）、`novel_character_state`（角色状态）、`novel_pacing_check`（节奏检查）。
- **项目骨架初始化**：`templates/project/`（story / settings / volumes / chapters / prompts / archives / memory / .agent），经 `novel-project-init` skill 在任意工作区创建；记忆系统 DSH 化为 `memory/`（动态 + 永久同目录）。
- **阅览窗口安装 skill**：`skills/novel-reading-window/`，在 `cordis` 预设会话里一句话装好动态插件（Host + Client）。

### 变更

- **许可证**：MIT → GPLv3（整体），新增 `NOTICE.md` 记录双来源版权（原 DSH-Novel MIT + 移植的 awesome-novel-agent GPLv3）。
- **目录结构**：阅览窗口源码从仓库根 `plugins/` 移入 `agent-presets/novelist/plugins/`（预设目录 = 一切可安装内容）；预设目录新增 `knowledge/`、`agents/`、`skills/`、`templates/`。
- **DSH 化**：9 个 agent 定义与 18 个 SOP 全文从 Claude Code 术语改写为 DSH 原生（`.claude/memory/`→`memory/`、`.claude/knowledge/*`→`skill('novel-knowledge-*')`、`Bash`→`pwsh`、`Agent 工具`→`subagent`、`init.py`→`novel-project-init`），移除路径映射表。

### 修复

- 运行时 skill 注册补 `source: 'preset'` 字段，修复 `skill()` 加载时报 `loaded skill "novel-agents" source must be a string` 的问题。

## [1.0.0 之前]

- `6504ea2` 基本功能实现（23 个写作工具 + 阅览窗口 + 「小说助手」预设）
- `282628c` 添加 MIT 许可
- `9dec0a1` 修正 LICENSE 版权年份
- `5e211f7` 明确持久化架构（工具随预设持久，阅览窗口为会话级动态插件）
- `9ad63b5` 写作工具加入去 AI 味写作红线
