# 第四轮指挥记录：术语校对、事实复核与持续更新准备

生成日期：2026-06-24  
负责人：主控 Codex  
目标：深度优化并校对 Project Moon 世界事件志，使其更接近可维护的历史类读品，而不是一次性草稿。

---

## 一、本轮总目标

1. 以 LLC（LocalizeLimbusCompany）简中语言包作为《Limbus Company》相关中文术语的重要参考源，修正明显不一致译名。
2. 对既有书稿进行事实风险、来源等级、术语一致性和中文文风审计。
3. 为《Limbus Company》后续 Canto、Intervallo、赛季和公告更新建立可执行维护流程。
4. 增加机器校验脚本，使未来扩写后可以快速发现 ID、占位符、引文和整合书稿问题。
5. 保留历史类读品定位：按事件、人物、组织、地点和因果链组织材料，避免写成单纯世界观百科。

---

## 二、LLC 术语基准

参考仓库：`https://github.com/LocalizeLimbusCompany/LocalizeLimbusCompany`  
参考目录：`LLC_zh-CN`  
访问日期：2026-06-24

LLC README 说明该项目是“边狱公司 中文本地化语言包”，通过 Project Moon 官方翻译接口发布，并声明获得官方认可。本书将其作为《Limbus Company》文本相关译名的优先参考，但不将其等同于全部 Project Moon 作品的官方中文设定集。

本轮抽样确认的关键译名：

| 英文/韩文 | 本轮推荐主译 | 旧稿常见写法 | 处理原则 |
| --- | --- | --- | --- |
| The City | 都市 | 城市 | 作为专名时改为“都市”；普通语义可保留“城市”。 |
| Limbus Company | 边狱公司 | 边狱巴士（用户口语）、边狱公司 | 书稿主译为“边狱公司”；“边狱巴士”可在说明中标为俗称。 |
| Limbus Company Bus / LCB | 巴士部门 / LCB | 巴士部、巴士部门 | 首次出现写“巴士部门（LCB）”，后文可简称“巴士部门”。 |
| Executive Manager | 执行经理 | 管理者、经理人 | Limbus 语境优先“执行经理”；脑叶公司语境仍用“主管/管理者”并按来源说明。 |
| Abnormality | 异想体 | 异常体 | 改为“异想体”；“异常体”只作异译记录。 |
| Identity | 人格 | 身份 | 系统术语改为“人格”；泛指身份时不机械替换。 |
| Charon | 卡戎 | 卡隆 | Limbus 语境改为“卡戎”。 |
| Vergilius | 维吉里乌斯 | 维吉利乌斯、维吉尔 | Limbus 语境改为“维吉里乌斯”。 |
| Ryoshu | 良秀 | 旅秀 | 罪人名改为“良秀”。 |
| Meursault | 默尔索 | 莫尔索 | 罪人名改为“默尔索”。 |
| Fixer | 收尾人 | 修复者 | 保持“收尾人”。 |
| Golden Bough | 金枝 | 黄金枝 | 保持“金枝”；“黄金枝”作异译记录。 |

---

## 三、下属分工

### Agent A：术语与中文文风审计

- 模型：`newapi/gpt-5.5`
- 思考强度：`max`
- 只允许写入：`reports/translation_style_audit.md`
- 目标：
  - 对照 LLC 译名，列出正文、术语表、人物卡、事件卡中的译名问题。
  - 找出历史类读品文风中明显像“百科搬运”或“设定解释过量”的段落。
  - 给出需要主控整合的替换表与高风险句子。

### Agent B：事实与来源风险审计

- 模型：`deepseek/deepseek-v4-pro`
- 思考强度：`max`
- 只允许写入：`reports/fact_update_audit.md`
- 目标：
  - 复核 Limbus 持续更新章节、Leviathan、The Distortion Detective 相关陈述的来源强度。
  - 标出“confirmed/partial/待复核”状态不匹配之处。
  - 给出后续更新时需要新增来源卡、事件卡、人物卡的判断规则。

### Agent C：机器校验与维护性审计

- 模型：`deepseek/deepseek-v4-flash`
- 思考强度：`high`
- 只允许写入：`reports/validation_audit.md`
- 目标：
  - 检查 ID 引用、占位符、引文词数、章节来源和事件引用。
  - 建议可落地的校验脚本规则。
  - 不修改正文，只给出自动化清单。

---

## 四、主控整合准则

1. 下属报告是建议，不直接视为事实。所有正文改动由主控基于当前文件、LLC 抽样和已有来源卡统一执行。
2. 不为了“显得完整”而补写未确认剧情。持续运营内容只写访问日期前可确认的信息。
3. 修订后必须重新生成 `manuscript/BOOK.md`。
4. 修订后必须更新 `QUALITY_REPORT.md` 和 `logs/progress.md`。
5. 完工前必须运行完整验证脚本并记录结果。

