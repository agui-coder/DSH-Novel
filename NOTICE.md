# 版权与许可声明（NOTICE）

本项目（DSH-Novel）整体以 **GNU General Public License v3.0（GPLv3）** 分发，见同目录
[`LICENSE`](LICENSE)。

本项目是整合产物，含两处来源，特此声明：

## 1. 原 DSH-Novel（MIT，GPL 兼容）

- **版权：** © 2026 KurohaneKaoruko
- **许可：** MIT License（MIT 与 GPLv3 兼容；在 GPLv3 整体许可下，MIT 部分的版权与许可声明须保留）
- **覆盖：** 整合前的 DSH-Novel 代码，主要包括
  - `plugins/novel-assistant.host.js`、`plugins/novel-assistant.client.js`
  - `agent-presets/novelist/agent.cordis.yml`、`preset.yml`
  - `agent-presets/novelist/plugins/novel-tools.mjs`（整合前部分）

MIT 许可原文：

```
MIT License

Copyright (c) 2026 KurohaneKaoruko

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 2. 整合自 awesome-novel-agent / awesome-novel-skill（GPLv3）

- **版权：** © modoojunko（<https://github.com/modoojunko/awesome-novel-skill>）
- **许可：** GPLv3
- **覆盖：** 从 awesome-novel-agent 移植的写作方法论、知识库、9 个 agent 定义与环节 SOP、项目骨架模板，主要包括
  - `agent-presets/novelist/knowledge/`（反 AI 规则、题材画像、场景/剧情/角色/书名方法论、格式规范、风格蒸馏）
  - `agent-presets/novelist/agents/`（9 个写作 agent 定义）
  - `agent-presets/novelist/skills/`（各环节 SOP）
  - `agent-presets/novelist/templates/project/`（项目骨架模板，经 DSH 适配修改）

> 上述 GPLv3 内容在整合时做了面向 DeepSeek Harness 的适配（合并去 frontmatter、改目录路径、
> 改写平台指引等），但创意与规则文本源自 awesome-novel-agent，保留其 GPLv3 归属。
