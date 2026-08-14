---
name: novel-reading-window
description: 安装 DSH-Novel 的「小说阅览窗口」动态插件（Host + Client 合并版）：浮动窗口浏览/编辑/保存工作区章节文件，右上角开关按钮。仅当用户要装阅览窗口、或提到 novel-assistant 动态插件时使用。
---

# 安装小说阅览窗口

本 skill 指导你在当前会话安装 DSH-Novel 的「小说阅览窗口」动态插件（Host + Client 合并版），
一次 `cordis_define` + 一次 `cordis_run` 完成。

## 前置条件

- 当前会话必须带 `cordis_define` / `cordis_run` 工具——这些工具只在随部署自带的
  **`cordis` 预设**里提供（`standard` 等预设没有）。若本会话没有这些工具，告诉用户换到
  `cordis` 预设的会话再装。
- 阅览窗口是**进程级、会话级**插件：进程重启后需重装一次（本 skill 就是为「一句话重装」准备的）。

## 安装步骤

1. **读取插件源码**（随「小说助手」预设一起安装，路径固定）：
   - Host 半部：`$HOME/.dsh/.agent-presets/novelist/plugins/novel-assistant.host.js`
   - Client 半部：`$HOME/.dsh/.agent-presets/novelist/plugins/novel-assistant.client.js`
   - Windows 下即 `C:\Users\<用户名>\.dsh\.agent-presets\novelist\plugins\`；可用 `$env:DSH_HOME` 确认根目录（默认 `$HOME/.dsh`）。
   - 若这两个文件不存在，说明「小说助手」预设还没装——先按 `INSTALL.md` 第 2 步装预设。

2. **调用 `cordis_define`**：
   - `plugin`: `{ "kind": "new", "idPrefix": "nrdr" }`
     （`idPrefix` 是任意 3–6 位小写字母的语义前缀，Host 会追加唯一数字后缀）
   - `name`: `novel-assistant`
   - `purpose`: `小说阅览窗口 + 23 个网文写作工具（动态插件）`
   - `code.host`: 填入第 1 步 Host 文件的**完整内容**（文件本身即 `return {…}` 函数体）
   - `code.client`: 填入第 1 步 Client 文件的**完整内容**
   - 记下返回的 `pluginId` 与 `packageId`

3. **调用 `cordis_run`**：
   - `pluginId` / `packageId`: 用上一步返回的精确值
   - `mode`: `run`

4. **浏览器授权**：Client 半部需授权。若 `cordis_run` 返回 `awaiting-approval`，
   请用户在该 Run 卡片上点「允许」；授权后 Client 异步激活。不要重试或宣称已在运行。

## 验证

- `cordis_inspect_self` 里该插件 `state: running`、client `status: running`；
- 页面右上角出现「📖 阅览」按钮，浮动窗口列出当前会话工作区文件。

## 故障排查

- **按钮没出现**：确认 Client 已授权激活（`cordis_inspect_self` 看 client status）；必要时刷新页面。
- **窗口显示的是运行目录而非工作区**：确认已打开一个会话（窗口根目录取「当前会话工作区」）。
- **保存失败**：检查会话文件策略为允许写工作区（默认 workspace-write）；窗口只允许写工作区内路径。
- **工具报「没有可用模型」**：在设置里配置模型提供方，或调用工具时显式传 `provider` / `model`。
