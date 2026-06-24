# 资料研究规范

## 检索原则

AI agent 必须联网检索，并优先使用可追溯来源。任何可能随时间变化的信息，例如《Limbus Company》新章节、新活动、新访谈、新公告，都必须检查发布日期和访问日期。

每次检索应记录：

- 检索日期。
- 检索关键词。
- 搜索引擎或站点。
- 命中的来源链接。
- 是否已阅读原文。
- 是否有二次来源或转载风险。
- 本次检索新增了哪些事件、人物、组织或地点线索。

## 来源分级

`S0 官方一手来源`

- Project Moon 官方网站、官方商店页、官方公告。
- 官方 YouTube、X/Twitter、Steam、游戏内可验证文本。
- 官方发布的漫画、小说、访谈、活动页面。

`S1 官方相关来源`

- 平台商店页、发行平台新闻页、官方授权宣传页。
- 媒体对开发者的采访，但需确认采访对象和发布日期。

`S2 社区整理来源`

- Fandom、Miraheze、wiki.gg、百度百科、Bilibili 专栏、Reddit 贴文等。
- 只能作为线索，关键事实需要回查官方或游戏内来源。

`S3 玩家分析与推测`

- 视频考据、论坛长文、社群讨论。
- 只能标注为“读者推测”或“社区观点”。

## 资料卡模板

每个来源建立一个资料卡，放在 `sources/index/`。

```yaml
id: SRC-0001
title:
url:
source_level: S0
publisher:
author:
published_date:
accessed_date:
language:
covered_work:
covered_events:
covered_people:
covered_organizations:
covered_places:
reliability_notes:
copyright_notes:
summary:
useful_claims:
  - claim:
    evidence_type:
    related_event_id:
    related_person_id:
quotes:
  - text:
    reason:
    word_count:
```

## 事件卡模板

事件卡放在 `notes/events/`。正文中的关键事件应引用事件卡 ID。

```yaml
id: EVT-0001
title:
status: confirmed
spoiler_level:
time_position:
related_works:
participants:
organizations:
places:
sources:
  - SRC-0001
summary:
causes:
process:
outcomes:
long_term_impact:
conflicts:
notes:
last_checked:
```

`status` 可选：

- `confirmed`: 主要过程有可靠来源支持。
- `partial`: 事件存在可确认，但过程细节不完整。
- `uncertain`: 来源不足或有冲突。
- `interpretation`: 事件意义属于分析性判断。
- `fan_theory`: 玩家推测。

## 人物卡模板

人物卡放在 `notes/people/`。

```yaml
id: PER-0001
name:
aliases:
spoiler_level:
related_works:
affiliations:
first_known_appearance:
last_known_status:
key_events:
  - EVT-0001
sources:
  - SRC-0001
biographical_summary:
motives:
relationships:
uncertain_points:
last_checked:
```

## 事实卡模板

事实卡放在 `notes/facts/`。它用于记录不适合归入单一事件的规则、设定和概念。

```yaml
id: FACT-0001
claim:
status: confirmed
spoiler_level:
topic:
works:
sources:
  - SRC-0001
evidence_summary:
related_events:
related_people:
conflicts:
notes:
last_checked:
```

## 时间线规范

`notes/timeline.md` 是总时间线，不要求所有条目都有绝对日期，但必须有相对顺序。

时间位置可以写成：

- `前史`
- `脑叶公司时期`
- `光之种相关事件前后`
- `图书馆时期`
- `边狱公司时期`
- `顺序待确认`

如果官方没有明确日期，不得强行编造年份。

## 引用规范

正文尽量转述。必须引用原文时：

- 引文必须短。
- 引文必须服务于分析，不可堆砌。
- 引文后标注来源 ID。
- 不引用长段剧情、完整台词、完整日志或完整页面。

## 争议处理

若资料冲突，采用以下写法：

```text
资料 A 显示……；资料 B 则显示……。在没有官方进一步说明前，本书将其视为未完全确认的信息。
```

不得把“看起来合理”的推测写成事实。

