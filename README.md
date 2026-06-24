# Project Moon 世界事件志项目

本项目用于组织 AI agent 长任务：联网收集 Project Moon 相关公开资料，建立可追溯资料库，并写作一本“历史类读品”。本书重点不是单纯讲世界观设定，而是像一部城市编年史、事件档案和人物志：记录这个世界中发生过什么、谁参与了这些事件、组织如何行动、事件之间怎样互相影响。

核心目标：

1. 以事件为主线，而不是以设定百科为主线。
2. 用时间线、人物志、组织志、地点志和事件档案支撑正文。
3. 每个关键事实都必须能追溯到来源。
4. 区分“正典事实”“未确认传闻”“合理推断”“读者解读”。
5. 不复制大段游戏文本、漫画文本、访谈全文或 Wiki 原文。
6. 长任务必须小步推进，每轮更新资料、事件卡、人物卡和进度日志。

推荐阅读顺序：

1. [AGENT_BRIEF.md](./AGENT_BRIEF.md)
2. [RESEARCH_PROTOCOL.md](./RESEARCH_PROTOCOL.md)
3. [BOOK_SPEC.md](./BOOK_SPEC.md)
4. [STYLE_GUIDE.md](./STYLE_GUIDE.md)
5. [OUTLINE.md](./OUTLINE.md)
6. [TASKS.md](./TASKS.md)

目录用途：

```text
ProjectMoon/
  AGENT_BRIEF.md              # 给 AI agent 的总任务书
  BOOK_SPEC.md                # 书籍定位、读者、范围、交付标准
  RESEARCH_PROTOCOL.md        # 联网检索、来源分级、事件/人物记录规范
  STYLE_GUIDE.md              # 历史类中文写作风格、引用和推断写法
  OUTLINE.md                  # 建议目录结构和章节目标
  TASKS.md                    # 长任务拆解和里程碑
  prompts/                    # 可复制给不同 agent 的提示词
  schemas/                    # 资料卡、事件卡、人物卡、章节卡模板
  sources/                    # 原始资料索引和摘录笔记，不放盗版全文
  notes/
    events/                   # 事件卡
    people/                   # 人物卡
    places/                   # 地点卡
    facts/                    # 事实卡
    timeline.md               # 总时间线
    organizations.md          # 组织索引
    terminology.md            # 术语表
  manuscript/                 # 正文草稿
  checklists/                 # 每章交付前检查清单
  logs/                       # 每日/每轮进度记录
```

