# {project-name}

> 本项目是「小说助手」（DSH-Novel）生成的网文写作工程，由 9-Agent 流水线协作推进。

## 开始写作

1. 在新会话选择「小说助手」预设；
2. 用 `skill('novel-agents')` 加载流水线手册，用 `skill('novel-project-init')` 恢复/核对项目骨架；
3. 总指挥按 `.agent/status.md` 的 `phase` 字段路由，用 `subagent` 工具调度子 agent。

## 写作流程

设定 → 卷纲 → 章纲 → 提示词 → 正文 → 去AI味 → 审阅（可选）→ 归档 → 下一章

## 项目结构

- `story.md` — 项目索引 + 主线拆纲
- `settings/` — 世界观、角色、写作风格、题材、伏笔台账、时间线、风格卡
- `volumes/` — 卷纲（情绪走向/冲突阶梯/信息差/场景卡）
- `chapters/` — 章纲（vol-{N}-ch-{M}.md）
- `prompts/` — 6 元素提示词
- `sandbox/` — 剧情推演记录（可选）
- `novel-samples/` — 文风蒸馏样本
- `archives/` — 正文定稿（.draft.md=草稿 / .anti-ai.md=去AI味后 / .md=定稿）
- `memory/` — 动态记忆（volume/chapter/prompt/writing + permanent-memory 晋升）
- `.agent/` — 状态追踪（status.md 相位路由）+ 子 agent 通信（task/ order 文件）

## 关键规则

- 路由唯一依据是 `.agent/status.md#phase`；章节自身状态只表示章节生命周期。
- order 文件只写输入/输出路径 + `status: pending`；子 agent 完成后覆盖为 `status: DONE`（不删除）。
- 归档幂等：以 `.agent/archiving/{chapter}.done` 为断点标记，防重复追加。
- 设定写入 `settings/` 一律经 updater 子 agent，总指挥不直接写。
