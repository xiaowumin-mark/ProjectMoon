# 第二轮负责人验收意见与派工

第一轮已经建立了基本资料库和前 5 章初稿，但尚未达到“全书完成”的要求。第二轮必须修复质量缺陷，并完成剩余章节正文。

## 必须修复的问题

1. `sources/index/SRC-0001.md` 的 Lobotomy Corporation Steam URL 应核对为官方真实页面：
   - `https://store.steampowered.com/app/568220/Lobotomy_Corporation__Monster_Management_Simulation/`
2. 所有 `SRC-XXXX` 占位必须替换为真实来源 ID，或明确标注 `sources: []` 并在 `notes` 中写明“待查证”。不能保留 `SRC-XXXX`。
3. 所有来源卡中的直接引文必须删减到很短，英文引文不要超过 20-25 个词；不必要的引文直接删除。
4. `manuscript/00_preface.md` 中的 `待补充` 必须补完。
5. `manuscript/ch_06` 到 `ch_21` 不能再是占位。每章至少 1500 中文字，必须包含来源 ID 和事件 ID。
6. `appendix_a` 到 `appendix_f` 不能再是占位，必须用现有 `notes/` 内容整理为可读附录。
7. 如果事实主要来自 Wikipedia、Fandom 或二手资料，必须在正文或未确认点中标注“待官方/游戏内文本复核”。
8. 不要编造绝对年份。没有官方日期时使用相对时间位置。
9. 不要写完整剧情实录；正文应该是事件志、人物志、组织志的历史类叙述。

## 第二轮交付要求

请完成以下文件修改：

1. 修正所有 `sources/index/SRC-*.md`：
   - 更新错误 URL。
   - 删除或缩短超长直接引文。
   - 尽量在 useful_claims 中关联真实 `EVT-xxxx` 或 `PER-xxxx`。
2. 修正所有 `notes/events/EVT-*.md` 和 `notes/people/PER-*.md`：
   - 不得出现 `SRC-XXXX`。
   - 至少写入一个真实来源 ID。
   - 若来源不足，status 改为 `uncertain` 或 `partial`，并写明待查。
3. 扩写 `manuscript/ch_06` 到 `ch_21`：
   - 每章至少 1500 中文字。
   - 保留章节格式。
   - 包含事件 ID 和来源 ID。
   - 标注未确认点。
4. 完成 `manuscript/appendix_a` 到 `appendix_f`：
   - 附录 A：总时间线。
   - 附录 B：事件索引。
   - 附录 C：人物索引。
   - 附录 D：组织索引。
   - 附录 E：地点索引。
   - 附录 F：术语表与资料来源说明。
5. 更新 `logs/progress.md`，写清：
   - 第二轮修复项。
   - 扩写完成章节。
   - 仍需人工复核的事实风险。

## 验收口径

完成后以下搜索应只命中说明文件或模板，不应命中正文和资料卡：

- `SRC-XXXX`
- `待写作`
- `待补充`

以下条件必须满足：

- `manuscript/ch_01` 到 `ch_21` 都有正文。
- `appendix_a` 到 `appendix_f` 都有内容。
- 所有正文都至少出现一个 `SRC-xxxx`。
- 关键历史章节应出现 `EVT-xxxx`。

