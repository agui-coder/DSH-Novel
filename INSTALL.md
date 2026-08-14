# DSH-Novel 安装指引（给 DSH Agent 执行）

本文件描述如何把 DSH-Novel 安装到 DeepSeek Harness 中，快速构建 AI 写小说环境。
Agent 请按顺序执行；涉及浏览器授权的步骤需用户确认。**手动安装**也可按同样步骤操作。

---

## 0. 环境确认

- DSH 用户预设根目录：`$HOME/.dsh/.agent-presets/`（Windows 下即 `C:\Users\<用户名>\.dsh\.agent-presets\`；
  可用 `echo $env:DSH_HOME` 确认，默认 `$HOME/.dsh`；`agentPresets.list()` 可查真实路径）。
- 动态插件通过 `cordis_define` + `cordis_run` 安装（会话级、进程级）；Agent 预设是文件复制（持久）。
- **重要：`cordis_define` / `cordis_run` 属于 DSH 的「自我修改」工具集（`@deepseek-ai/dsh-tool-cordis`），只在随部署自带的 `cordis` 预设里提供。**
  - 第 1 步（安装阅览窗口动态插件）**必须**在 `cordis` 预设的会话里执行；`standard` 等预设没有这些工具。
  - 第 2 步（安装「小说助手」预设）只是文件复制，任何会话都能做，且一旦装好即为持久、无需 cordis 工具。

## 1. 安装动态插件 novel-assistant（唯一插件：23 个写作工具 + 小说阅览窗口）

本插件是 Host + Client 合并版，一次安装即可同时获得写作工具与阅览窗口。

> **一句话安装（推荐）：** 在 `cordis` 预设的会话里加载 skill `novel-reading-window`
> （`skill('novel-reading-window')`）并照做即可，它已包含下面的完整步骤与故障排查。
> 该 skill 随仓库分发在 `skills/novel-reading-window/`，需复制到 `$HOME/.dsh/skills/novel-reading-window/`。

手动安装步骤：

1. 读取 `agent-presets/novelist/plugins/novel-assistant.host.js`（Host 代码）与
   `agent-presets/novelist/plugins/novel-assistant.client.js`（Client 代码）。
   这两个文件随第 2 步预设一起复制到 `$HOME/.dsh/.agent-presets/novelist/plugins/`。
2. 调用 `cordis_define`：
   - `plugin`: `{ "kind": "new", "idPrefix": "nrdr" }`（`idPrefix` 为任意 3–6 位小写字母语义前缀）；
   - `name`: `novel-assistant`；
   - `purpose`: `小说阅览窗口 + 23 个网文写作工具（动态插件）`；
   - `code.host` 填入 Host 文件内容，`code.client` 填入 Client 文件内容（文件本身即 `return {…}` 函数体）。
3. 调用 `cordis_run`（`pluginId`/`packageId` 用上一步返回，`mode: 'run'`）。Client 半部需要浏览器授权：
   若返回 `awaiting-approval`，请用户在该 Run 卡片上点击「允许」；授权后 Client 异步激活。
4. 验证：
   - `cordis_inspect_query(host, Tool, listTools)` 应能看到 `novel_polish`、`novel_continue` 等共 23 个 `novel_*` 工具；
   - `cordis_inspect_self` 中该插件 `state: running`、client `status: running`，Host handlers 含 `nreader:list` / `nreader:read` / `nreader:write`；
   - 页面右上角出现「📖 阅览」按钮，浮动窗口列出工作区文件。

## 2. 安装 Agent 预设「小说助手」（持久）

1. 把整个 `agent-presets/novelist/` 目录复制到 `$HOME/.dsh/.agent-presets/novelist/`（包含 `preset.yml`、`agent.cordis.yml`、`plugins/`（`novel-tools.mjs` + `novel-knowledge.mjs`）、`knowledge/`（深度知识库）、`agents/`（9 个写作 agent 定义）、`skills/`（环节 SOP）、`templates/project/`（项目骨架模板））。
   - 该目录在会话工作区之外：若文件写入被沙箱拒绝（`[sandbox: file access denied ...]`），用 `sandbox_permissions: danger-full-access` 重试一次（需用户批准），一次性完成全部文件复制。
   - `novel-knowledge.mjs` 插件会在预设挂载时把 `knowledge/`、`agents/`、`skills/`、`templates/project/` 读入并注册为运行时 skill，因此**无需为知识库做额外复制或配置**。
2. 挂载校验：通过临时插件注入 `agentPresets` 服务并调用 `agentPresets.standingKeyFor('novelist')`；正常返回即校验通过
   （组合可挂载：所有行能解析、配置合法、无服务越界、无未激活行——包括本地 `./plugins/novel-tools.mjs`、`./plugins/novel-knowledge.mjs` 行）。
   校验不通过时，把错误信息原样反馈给作者排查。
3. 新建会话，在预设选择器中选择「**小说助手**」，确认：
   - 工具列表包含 27 个 `novel_*` 工具（含 `novel_style_distill` / `novel_foreshadowing` / `novel_character_state` / `novel_pacing_check`）；
   - 系统提示包含《网文创作方法论》；
   - 可调用 `skill('novel-knowledge')` 查知识库索引、`skill('novel-agents')` 加载 9-Agent 流水线手册、`skill('novel-project-init')` 初始化项目骨架。

## 3. 收尾与使用

- 完成标志：新会话选择「小说助手」后，能调用 27 个 novel_* 工具、能加载 11 个 novel-* skill、能打开阅览窗口、能直接开始写小说。
- 动态插件只在当前会话生效；预设持久可用（27 个工具 + 11 个 skill 内置其中）。新会话想用阅览窗口时，加载 skill `novel-reading-window` 照做即可（一句话重装）。
- **持久性小结**：写作工具与知识库/流水线 skill 随「小说助手」预设持久存在（无需重装）；阅览窗口是动态插件（进程级、会话级，重启后重装一次——`cordis` 预设会话里说「加载 novel-reading-window skill 装阅览窗口」即自动完成）。浏览器 UI 无法随预设持久，原因是它依赖动态插件机制（`harness`/`host.call`），详见 README「六、说明」。
- 卸载：动态插件用 `cordis_stop` / `cordis_undefine`；预设删除 `$HOME/.dsh/.agent-presets/novelist` 目录。

---

## 常见问题

- **Q：阅览窗口按钮没出现？** 确认 novel-assistant 的 Client 已授权激活（`cordis_inspect_self` 查看 client status）；必要时刷新页面。
- **Q：窗口显示的是运行目录而不是工作区？** 确认当前已打开一个会话（窗口根目录取“当前会话工作区”）；无会话时回退到最近工作区。
- **Q：保存文件失败？** 检查会话文件策略是否为允许写工作区（默认 workspace-write）；窗口只允许写当前工作区内路径。
- **Q：工具调用报“没有可用模型”？** 在设置里配置模型提供方；或调用工具时显式传 `provider` / `model`。
