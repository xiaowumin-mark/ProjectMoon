# 最终一致性扫描报告

扫描时间：2026-06-24
扫描范围：manuscript/、notes/、sources/ 下全部 Markdown
扫描类型：最终一致性扫描

---

## 1. 摘要

本次扫描共发现 **15 处需要修复的问题**，分布在 2 个维度：
- **ID 映射冲突**（严重）：BOOK.md 中 PER 和 ORG 编号与独立章节/索引文件严重不一致（11 处）
- **BOOK.md 与源文件不同步**（严重）：BOOK.md 编译内容落后于独立章节文件（1 处整体性差异）

旧术语残留未发现实质性风险（仅术语表中记录历史译名，属正常行为）。日期残留均为 `last_checked: 2026-06-23`，即昨日检查标记，非陈旧残留。

---

## 2. 发现列表

### 2.1 旧术语残留

| 文件 | 行号 | 术语 | 说明 |
|------|------|------|------|
| `manuscript/appendix_f_terminology.md` | 24 | 异常体 | 术语表"异想体"条目中列为历史译名，可接受 |
| `notes/terminology.md` | 13 | 异常体 | 同上 |
| `manuscript/appendix_f_terminology.md` | 40 | 经理人 | 术语表"执行经理"条目中列为历史译名，可接受 |
| `notes/terminology.md` | 29 | 经理人 | 同上 |

**结论：无非预期残留。** 搜索项"卡隆""维吉利乌斯""旅秀""莫尔索""身份系统""执行管理者""汉娜协会""蓝色喧响""红色凝视""巴士部门门""戰鬥力"均未命中。

### 2.2 ID 映射冲突（严重）

以下冲突全部位于 `manuscript/BOOK.md`。该文件的部分章节编译版本与对应的独立章节文件 (`manuscript/ch_*.md`) 使用不同的 PER / ORG 编号体系。

#### PER 映射错误（BOOK.md vs notes/people/ 及独立章节文件）

| 行号 | 现行写法 | 正确映射（依 notes/people/） | 问题 |
|------|----------|---------------------------|------|
| 1757 | `PER-0004` → 艾因 / Ayin | PER-0019 → 艾因 | PER-0004 应为 Dante |
| 1767 | `PER-0007` → 葛布雅/Gebura | PER-0010 → Gebura | PER-0007 应为 Don Quixote |
| 1777 | `PER-0009` → 阿尔加利亚/Argalia | PER-0011 → Argalia | PER-0009 应为 Ishmael |
| 1823 | `PER-0011` → 但丁/Dante | PER-0004 → Dante | PER-0011 应为 Argalia |
| 1877 | `PER-0004` → 艾因 | PER-0019 | 同上偏移 |
| 2195, 2218, 2292, 2321, 2349, 2393, 2422 | `PER-0004` → 艾因 | PER-0019 | 全文偏移 |
| 2295, 2322, 2383, 2396, 2423 | `PER-0011` → 但丁 | PER-0004 | 全文偏移 |

**根因**：BOOK.md 的人物章节（对应 `ch_16_key_people.md` 和 `ch_21_sin_redemption.md` 的编译部分）使用了旧版 PER 编号，比当前 `notes/people/` 和独立章节文件的编号**整体偏移了 3-7 个位置**。独立 `ch_16_key_people.md` 和 `appendix_c_person_index.md` 的编号是正确的。

#### ORG 映射错误（BOOK.md vs notes/organizations.md）

| 行号 | 现行写法 | 正确映射（依 notes/organizations.md） |
|------|----------|-------------------------------------|
| 1999 | `ORG-0001` → 首脑 (Head) | ORG-0004 → 首脑 |
| 2000 | `ORG-0002` → L公司 (Lobotomy Corp) | ORG-0001 → 脑叶公司 |
| 2001 | `ORG-0003` → Hana 协会 | ORG-0006 → Hana 协会 |
| 2004 | `ORG-0007` → 边狱公司 | ORG-0003 → 边狱公司 |
| 2126 | `ORG-0008` → 拇指 (Thumb) | ORG-0012 → 拇指 |

**根因**：同上，BOOK.md 第 17 章编译版本使用了与独立 `ch_17_wings_associations.md` 不同的 ORG 编号。独立 `ch_17_wings_associations.md:109-113` 已使用正确编号（ORG-0001 → L公司, ORG-0003 → 边狱公司等）。

### 2.3 日期残留

| 文件 | 详情 |
|------|------|
| 26 个 EVT 文件 (EVT-0001 ~ EVT-0026) | 全部含 `last_checked: 2026-06-23` |
| 22 个 PER 文件 | 全部含 `last_checked: 2026-06-23` |
| `manuscript/BOOK.md` | 多处提及"截至2026年6月23日" |
| `manuscript/ch_14_journey_chronicle.md` | 引用 SRC-0016 日期 2026-06-23 |
| `manuscript/ch_15_unfolding_history.md` | 多处提及"截至2026年6月23日" |
| `notes/timeline.md` | EVT-0026 记录截止日期 2026-06-23 |
| `manuscript/appendix_a_timeline.md` | 同上 |
| `manuscript/appendix_b_event_index.md` | 同上 |

**结论：** 这些日期为昨日（2026-06-23）的最后检查标记。鉴于扫描时间为 2026-06-24，这些日期**不构成陈旧残留**，属于正常元数据。除非作者期望的检查周期短于 1 天，否则无需处理。

### 2.4 统计一致性

| 统计项 | 数量 | 预期/备注 |
|--------|------|----------|
| sources/index 下 SRC 文件 | 17 (SRC-0001 ~ SRC-0017) | 完整 |
| notes/events 下 EVT 文件 | 26 (EVT-0001 ~ EVT-0026) + README.md | 完整 |
| notes/people 下 PER 文件 | 26 (PER-0001 ~ PER-0026) + README.md | 完整 |
| manuscript 章节 | 21 章 (ch_01 ~ ch_21) | 完整 |
| manuscript 附录 | 6 个 (appendix_a ~ appendix_f) | 完整 |
| manuscript 前言 | 1 (00_preface.md) | 完整 |
| manuscript 编译本 | 1 (BOOK.md) | 存在 |

**结论：** 数量统计无异常。编号连续无断裂。

### 2.5 BOOK.md 状态

- **文件存在**: 是，位于 `manuscript/BOOK.md`（3689 行）
- **最后检查日期**: 2026-06-23（昨日的记录，不陈旧）
- **内容同步状态**: **陈旧的** — 人物 ID (PER) 和组织 ID (ORG) 编号与独立章节文件及索引文件不同步，差异显著
- **建议**: 保留文件，但必须整体重新编译以对齐当前 `notes/people/`、`notes/organizations.md` 及独立章节文件中的编号

---

## 3. 建议修复

### 优先级 P0（必须修复 — ID 正确性）

1. **重新编译 `manuscript/BOOK.md`**
   - 人物章节：将 PER-0004（艾因）替换为 PER-0019，PER-0007（葛布雅）替换为 PER-0010，PER-0009（阿尔加利亚）替换为 PER-0011，PER-0011（但丁）替换为 PER-0004
   - 组织章节：按 notes/organizations.md 重新对齐全部 ORG-xxxx 编号
   - 影响范围：BOOK.md 中约 40+ 处引用

### 优先级 P1（建议修复 — 内容同步）

2. **在 BOOK.md 头部添加编译日期标记**，注明最后一次从独立章节重新编译的时间
3. **建立编译约束**：BOOK.md 应始终由独立章节文件的当前版本编译生成，而非独立编辑

### 优先级 P2（可选 — 归一化）

4. 术语表中保留"异常体""经理人"等历史译名属正常行为，无需删除
5. 日期标记 `last_checked: 2026-06-23` 无需修改

---

## 4. 统计表

| 扫描项 | 状态 | 发现数 | 严重程度 |
|--------|------|--------|---------|
| 旧术语残留 | 通过（仅术语表可接受记录） | 4（均为可接受） | 无风险 |
| ID 冲突残留 | **未通过** | 11（BOOK.md 内） | **严重** |
| 日期残留 | 通过（均为昨日标记） | 0（陈旧性） | 无风险 |
| 统计一致性 | 通过 | 0 | 无风险 |
| BOOK.md 状态 | 存在但陈旧 | 1（ID 不同步） | **严重** |

---

## 5. 结论

**核心问题：** `manuscript/BOOK.md` 的人物 ID (PER-0004/0007/0009/0011) 和组织 ID (ORG-0001/0002/0003/0007/0008) 映射与独立的笔记文件和章节文件不一致，偏移量约为 3-7 个位置。该文件是独立章节文件的编译产物，但编译版本未随源文件更新。

**建议行动：** 重新编译 BOOK.md，确保 PER 和 ORG 编号与 `notes/people/`、`notes/organizations.md` 及独立 `manuscript/ch_*.md` 文件中的编号完全一致。
