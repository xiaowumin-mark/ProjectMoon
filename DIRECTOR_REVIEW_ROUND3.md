# 第三轮负责人派工：补全衍生作品与最终交付物

第二轮已经完成 21 章和 6 个附录的正文，但仍存在“衍生作品未纳入”和“没有总书稿交付文件”的缺口。第三轮目标是补齐《The Distortion Detective》《Leviathan》等关键衍生文本，并形成最终可阅读书稿。

## 必须新增的资料来源

至少新增以下来源卡，编号从 `SRC-0013` 开始：

1. ProjectMoon Official Postype - Leviathan English series  
   URL: `https://www.postype.com/@projectmoon/series/875159`
2. ProjectMoon Official Postype - The Distortion Detective Chapter 1  
   URL: `https://www.postype.com/@projectmoon/post/5996491`
3. ProjectMoon Official Postype channel  
   URL: `https://www.postype.com/@projectmoon`
4. Limbus Company Steam News / Announcements page  
   URL: `https://steamcommunity.com/app/1973530/allnews/`

可以补充 wiki.gg、Fandom 或 Miraheze 作为 S2 线索，但必须标记为 S2，并注明“待官方/游戏内文本复核”。

## 必须新增的事件卡

至少新增 8 个事件卡，编号从 `EVT-0019` 开始：

- 扭曲侦探事务所与摩西调查线。
- 扭曲现象在城市中的扩散与个案调查。
- 《The Distortion Detective》连载中止/转向未来游戏化计划。
- Vergilius 在《Leviathan》中的前史。
- Garnet、Lapis 等人物与 Vergilius 的关联事件。
- 《Leviathan》与《Limbus Company》巴士部门的承接。
- 《Limbus Company》作为持续运营作品的版本更新事件。
- 截至 2026-06-23 的 Limbus 更新风险记录。

若具体细节没有足够来源，status 必须使用 `partial` 或 `uncertain`，不得写成 confirmed。

## 必须新增的人物卡

至少新增 6 个人物卡，编号从 `PER-0013` 开始：

- Moses
- Ezra
- Vespa
- Vergilius 的《Leviathan》时期条目或扩展条目
- Garnet
- Lapis

如角色细节来自社区来源，必须标注 S2/S3 风险。

## 必须修改的正文

1. `manuscript/ch_11_library_aftermath.md`  
   加入扭曲侦探作为图书馆后果的关键延伸。
2. `manuscript/ch_12_limbus_system.md`  
   加入 Leviathan 对 Vergilius 与巴士部门的承接作用。
3. `manuscript/ch_14_journey_chronicle.md`  
   加入“持续运营作品必须标记访问日期和版本风险”的说明。
4. `manuscript/ch_15_unfolding_history.md`  
   加入截至 2026-06-23 的更新风险说明，不得引用 2026-06-23 之后的未来更新作为已发生事实。
5. `manuscript/ch_16_key_people.md`  
   加入 Moses、Ezra、Garnet、Lapis。
6. `manuscript/appendix_a` 到 `appendix_f`  
   更新新增来源、事件、人物、术语。

## 最终交付物

1. 新建 `manuscript/BOOK.md`：
   - 按顺序整合前言、21 章、6 个附录。
   - 只做整合，不要丢内容。
   - 文件开头写明：状态为 `sourced draft`，访问日期为 `2026-06-23`，仍需人工最终事实复核。
2. 新建 `QUALITY_REPORT.md`：
   - 统计来源卡、事件卡、人物卡、章节、附录数量。
   - 说明已完成项。
   - 说明仍需人工复核的事实风险。
   - 说明版权处理：未收录完整原文、只做转述与短引。
3. 更新 `logs/progress.md`。

## 验收要求

以下搜索在资料库和正文中不得命中未处理占位：

- `SRC-XXXX`
- `待写作`
- `待补充`

以下文件必须存在：

- `manuscript/BOOK.md`
- `QUALITY_REPORT.md`

以下数量应满足：

- `sources/index/SRC-*.md` 至少 16 个。
- `notes/events/EVT-*.md` 至少 26 个。
- `notes/people/PER-*.md` 至少 18 个。
- `manuscript/ch_01` 到 `ch_21` 全部非空，均包含 `SRC-xxxx`。

