// 小说助手 · 知识库与流水线运行时 skill 注册插件
// -----------------------------------------------------------------------------
// 由 agent.cordis.yml 中的相对路径行 './plugins/novel-knowledge.mjs' 加载，
// 因此本文件是预设目录的一部分，随预设一起复制与分发。
//
// 职责：把预设目录内的深度知识库（knowledge/）、9 个写作 agent 定义
// （agents/）与环节 SOP（skills/）在 apply 时读取并注册为 DSH「运行时
// skill」，使「小说助手」预设的任何会话都能通过标准 skill 工具按需加载，
// 无需额外的文件复制或路径假设。
//
// 只 import Node 内置模块（node:fs / node:path / node:url），不依赖任何
// 第三方包；预设目录位于用户主目录下，node_modules 向上查找无法到达 DSH
// 安装目录，因此本插件与 novel-tools.mjs 一样保持「自包含」。
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// 去掉 Markdown 文件开头的 YAML frontmatter（--- ... ---），只保留正文。
function stripFrontmatter(text) {
  if (text.startsWith('---')) {
    const end = text.indexOf('\n---', 3);
    if (end !== -1) return text.slice(end + 4).trimStart();
  }
  return text;
}

// 递归收集目录下所有 .md 文件（按相对路径排序，保证稳定输出）。
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (entry.endsWith('.md')) acc.push(full);
  }
  return acc.sort();
}

export default {
  name: 'novel-knowledge',
  inject: ['skills'],
  apply(ctx) {
    const disposers = [];
    const pluginsDir = dirname(fileURLToPath(import.meta.url)); // <preset>/plugins
    const presetDir = dirname(pluginsDir);                       // <preset>/novelist

    // 读取目录下所有 .md 文件，返回 [{ rel, body }]（按相对路径排序）。
    function readFiles(relDir) {
      const dir = join(presetDir, relDir);
      return walk(dir).map((f) => {
        const rel = relative(dir, f).replace(/\\/g, '/');
        const body = stripFrontmatter(readFileSync(f, 'utf8')).trim();
        return { rel, body };
      });
    }

    // 把一个目录下所有 .md 文件拼成带「## 相对路径」标题的单一正文。
    function readArea(relDir) {
      return readFiles(relDir)
        .map(({ rel, body }) => `## ${rel}\n\n${body}`)
        .join('\n\n');
    }

    function registerSkill(spec) {
      disposers.push(ctx.skills.register({
        name: spec.name,
        description: spec.description,
        whenToUse: spec.whenToUse,
        content: spec.content,
      }));
    }

    // ── 知识库（8 个分区 skill，按需加载，避免污染目录） ──────────────
    const AREAS = [
      {
        name: 'novel-knowledge-anti-ai',
        rel: 'knowledge/anti-ai',
        description: '反 AI 味写作库：通用规则、边界豁免、分题材高频 AI 病句正反例。改文、润色、正文落笔或去 AI 味自查时按需加载。',
        whenToUse: '写作/润色/去 AI 味/改写正文时，需要反 AI 规则或某题材的 AI 病句正反例。',
      },
      {
        name: 'novel-knowledge-genre',
        rel: 'knowledge/genre-example',
        description: '24 套题材画像：角色人设倾向、叙事语气、章节提示词模板（仙侠/都市/悬疑/历史/科幻末世/西方奇幻等）。',
        whenToUse: '新开一本书、定题材、或按题材配置写作风格与节奏模板时。',
      },
      {
        name: 'novel-knowledge-scene',
        rel: 'knowledge/scene-craft',
        description: '场景写作方法论（四步转化法）：对话/打斗/群像/环境/内心独白/视角/散文/转场等场景类型的写法与题材特化。',
        whenToUse: '写具体场景（打斗/对话/环境等）、需要场景级写法指引或四步转化法时。',
      },
      {
        name: 'novel-knowledge-plot',
        rel: 'knowledge/plot-craft',
        description: '剧情设计方法论：冲突与动机、情绪拉扯、钩子技法、开篇钩子、反转、悲剧技法。',
        whenToUse: '设计主线、冲突阶梯、情绪走向、钩子/反转/伏笔时。',
      },
      {
        name: 'novel-knowledge-character',
        rel: 'knowledge/character-craft',
        description: '角色设定方法论：反派类型模板、认知层模型。',
        whenToUse: '设计角色、反派、人物弧光与动机时。',
      },
      {
        name: 'novel-knowledge-title',
        rel: 'knowledge/title-craft',
        description: '取书名/标题方法论与案例。',
        whenToUse: '起书名、章节标题或文案标题时。',
      },
      {
        name: 'novel-knowledge-format',
        rel: 'knowledge/format-specs',
        description: '格式规范：章纲/卷纲/提示词/设定/记忆/正文基底等各环节的规范文档。',
        whenToUse: '生成或校验章纲、卷纲、提示词、设定文件、正文基底时。',
      },
      {
        name: 'novel-knowledge-style',
        rel: 'knowledge/style-distill',
        description: '风格蒸馏：特征提取/渲染规则/验收清单（量化文风参数的提示词模板）。',
        whenToUse: '蒸馏文风、生成风格主卡与场景卡、或校验蒸馏产出时。',
      },
    ];

    // 索引 skill：告诉模型「遇到什么任务该加载哪个分区」。
    const indexContent = `# 小说助手深度知识库索引

本 skill 是知识库的入口索引，正文不含具体规则——按下面的路由加载对应分区 skill。

## 路由表

| 任务 | 加载 skill |
| --- | --- |
| 润色 / 改写 / 去 AI 味 / 写正文自查 | novel-knowledge-anti-ai |
| 定题材 / 按题材配风格与节奏 | novel-knowledge-genre |
| 写打斗 / 对话 / 环境等具体场景 | novel-knowledge-scene |
| 设计主线 / 冲突 / 钩子 / 反转 / 伏笔 | novel-knowledge-plot |
| 设计角色 / 反派 / 人物弧光 | novel-knowledge-character |
| 起书名 / 标题 | novel-knowledge-title |
| 生成或校验章纲/卷纲/提示词/设定/正文基底 | novel-knowledge-format |
| 蒸馏文风 / 生成风格卡 / 校验蒸馏 | novel-knowledge-style |

## 使用方式

1. 先用 \`skill('novel-knowledge')\`（本索引）确认要加载哪个分区。
2. 再 \`skill('<对应分区名>')\` 加载完整规则正文。
3. 规则正文里每个文件以 \`## 相对路径\` 分隔，按需取用对应小节，不要把整份规则塞进输出。

## 多智能体流水线

完整的 9-agent 写作流水线（总指挥 + 8 个子 agent 的调度协议与 SOP）不在本知识库，
而是一个独立 skill：\`novel-agents\`。需要按阶段推进长篇小说（设定→卷纲→章纲→正文→
去 AI 味→审阅→归档）时加载它。`;
    registerSkill({
      name: 'novel-knowledge',
      description: '小说助手深度知识库索引：按任务路由到反 AI 规则、题材画像、场景/剧情/角色/书名方法论、格式规范、风格蒸馏等分区。',
      whenToUse: '不确定该加载哪个知识分区，或需要创作方法论/反 AI 规则/格式规范时。',
      content: indexContent,
    });

    for (const area of AREAS) {
      registerSkill({
        name: area.name,
        description: area.description,
        whenToUse: area.whenToUse,
        content: readArea(area.rel),
      });
    }

    // ── 9-agent 流水线手册 ──────────────────────────────────────────────
    // 总指挥协议（novel-agent 定义 + 调度 SOP）+ 8 个子 agent 定义与 SOP。
    // 主 Agent 加载后按协议调度 subagent，把对应子 agent 定义+SOP 作为
    // subagent prompt。
    const agentFiles = readFiles('agents');
    const novelAgent = agentFiles.find(({ rel }) => rel === 'novel-agent.md');
    const subAgents = agentFiles.filter(({ rel }) => rel !== 'novel-agent.md');
    const agentSops = readArea('skills');
    const agentsContent = `# 小说助手 9-Agent 写作流水线手册

本 skill 是完整的多智能体协作流水线。主 Agent（「小说助手」总指挥）加载本手册后：

- 按「总指挥协议」读取项目状态（\`.agent/status.md\` 的 phase 字段）路由阶段；
- 一次只调度一个子 agent：写 order 文件 → 用 subagent 工具起子 agent → 等它把
  order 标记 \`status: DONE\` → 推进下一阶段；
- 调度子 agent 时，把下方「子 agent 定义」中对应角色 + 「环节 SOP」中对应环节
  拼进 subagent prompt；子 agent 不写的内容（正文/设定等）由子 agent 完成，总指挥
  不代劳。

## 一、总指挥协议（novel-agent）

${novelAgent ? novelAgent.body : '（缺失：agents/novel-agent.md）'}

## 二、环节 SOP（skills/）

${agentSops}

## 三、子 agent 定义（agents/，不含 novel-agent）

${subAgents.map(({ rel, body }) => `### ${rel}\n\n${body}`).join('\n\n')}

## 调度速查

| phase | 调度子 agent | 说明 |
| --- | --- | --- |
| setup | updater（setting-update）/ style-distiller（有风格样本时） | 写设定、蒸馏文风 |
| outline | volume-planner → chapter-planner | 卷纲 → 章纲 |
| draft | prompt-crafter → writer | 提示词 → 正文 |
| anti-ai | anti-ai | 去 AI 味管线 |
| review | reader（可选） | 深度评审 |
| archive | updater（archive / memory-sweep） | 归档 + 记忆维护 |

> 注意：本手册源自 awesome-novel-agent 的 agents/ 与 skills/ 内容（已合并去 frontmatter）。
> agent 定义中引用的 \`skills/*.md\` 已内联在「环节 SOP」一节；引用的 \`knowledge/*\`
> 通过 \`skill('novel-knowledge-*')\` 系列按需加载。`;
    registerSkill({
      name: 'novel-agents',
      description: '9-Agent 写作流水线手册：总指挥调度协议 + 8 个子 agent（卷纲/章纲/提示词/写手/反AI/评审/归档/风格蒸馏）定义与 SOP，用于长篇小说按阶段推进。',
      whenToUse: '长篇小说按阶段推进、需要多 agent 协作流水线（设定→卷纲→章纲→正文→去AI味→审阅→归档）时。',
      content: agentsContent,
    });

    // ── 项目骨架初始化 skill ──────────────────────────────────────────
    // 把 templates/project/ 读成运行时 skill，让总指挥用文件工具在工作区创建
    // 写作工程骨架（settings/ volumes/ chapters/ archives/ memory/ .agent/ 等）。
    const SKELETON_DIRS = [
      'settings/character-setting',
      'settings/style-profiles',
      'volumes',
      'chapters',
      'prompts',
      'sandbox',
      'novel-samples',
      'archives',
      'memory',
      '.agent/task',
      '.agent/archiving',
    ];
    const skeletonFiles = (() => {
      const dir = join(presetDir, 'templates/project');
      return walk(dir).map((f) => {
        const rel = relative(dir, f).replace(/\\/g, '/');
        return { rel, body: readFileSync(f, 'utf8').trim() };
      });
    })();
    const skeletonContent = `# 小说项目骨架初始化

在当前工作区创建「小说助手」写作工程骨架。用文件写入工具按下面结构逐个创建；
空目录用 \`.gitkeep\` 占位（或创建目录后放一个空 \`.gitkeep\` 文件）。

## 需要创建的目录

${SKELETON_DIRS.map((d) => `- \`${d}/\``).join('\n')}

## 需要创建的文件（按路径逐字写入，含占位符的先原样写）

${skeletonFiles.map(({ rel, body }) => `### ${rel}\n\n\`\`\`markdown\n${body}\n\`\`\``).join('\n\n')}

## 初始化完成后

1. 与作者确认题材，把 \`story.md\` 里的 \`{genre}\` / \`{tags}\` / \`{story_arc_placeholder}\` 填好；
2. \`.agent/status.md\` 保持 \`phase: setup\`；
3. 之后按 \`skill('novel-agents')\` 的流水线推进（设定→卷纲→章纲→正文→去AI味→审阅→归档）。`;
    registerSkill({
      name: 'novel-project-init',
      description: '小说项目骨架初始化：在当前工作区创建 story.md、settings/、volumes/、chapters/、prompts/、archives/、memory/、.agent/status.md 等写作工程目录与文件。',
      whenToUse: '开始一本新书、或需要恢复/核对小说项目骨架时。',
      content: skeletonContent,
    });

    return () => { for (const d of disposers) d(); };
  },
};
