import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(siteRoot, '..');
const outRoot = path.resolve(siteRoot, 'src/content/docs');

const manuscriptDir = path.join(repoRoot, 'manuscript');
const notesDir = path.join(repoRoot, 'notes');
const sourcesDir = path.join(repoRoot, 'sources/index');

const routeByPrefix = {
  EVT: 'events',
  PER: 'people',
  SRC: 'sources',
  ORG: 'organizations',
  PLC: 'places',
};

function idRoute(id) {
  const prefix = String(id).slice(0, 3);
  const route = routeByPrefix[prefix];
  return route ? `/${route}/${String(id).toLowerCase()}/` : '#';
}

function assertSafeOutputPath() {
  const contentRoot = path.resolve(siteRoot, 'src/content');
  if (!outRoot.startsWith(contentRoot + path.sep)) {
    throw new Error(`Refusing to write outside site content directory: ${outRoot}`);
  }
}

async function readText(filePath) {
  return (await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, '');
}

async function listMarkdownFiles(dir, prefix = '') {
  const files = await fs.readdir(dir, { withFileTypes: true });
  return files
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name.startsWith(prefix))
    .map((entry) => entry.name)
    .sort(compareIds);
}

function compareIds(a, b) {
  return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
}

function parseYamlDocument(text) {
  if (text.trimStart().startsWith('---')) {
    const normalized = text.replace(/^\uFEFF/, '');
    const end = normalized.indexOf('\n---', 3);
    if (end >= 0) {
      const rawFrontmatter = normalized.slice(3, end).trim();
      const body = normalized.slice(end).replace(/^\n---\r?\n?/, '').trim();
      return {
        data: parseYamlLoose(rawFrontmatter),
        body,
      };
    }
  }

  return {
    data: parseYamlLoose(text),
    body: '',
  };
}

function parseYamlLoose(text) {
  try {
    return YAML.parse(text) || {};
  } catch {
    return parseSimpleRecord(text);
  }
}

function parseSimpleRecord(text) {
  const record = {};
  let activeListKey = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/\t/g, '  ');
    if (!line.trim() || line.trimStart().startsWith('#')) continue;

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && activeListKey) {
      if (!Array.isArray(record[activeListKey])) record[activeListKey] = [];
      record[activeListKey].push(parseSimpleValue(listMatch[1]));
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!keyMatch) continue;

    const [, key, rawValue] = keyMatch;
    activeListKey = key;
    record[key] = parseSimpleValue(rawValue);
  }

  return record;
}

function parseSimpleValue(rawValue) {
  const value = rawValue.trim();
  if (!value) return '';
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }
  return stripQuotes(value);
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function frontmatter(data) {
  return `---\n${YAML.stringify(data).trimEnd()}\n---\n\n`;
}

async function writeDoc(relativePath, data, body) {
  const target = path.join(outRoot, relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${frontmatter(data)}${body.trim()}\n`, 'utf8');
}

function firstHeading(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+?)\s*$/m);
  return match?.[1]?.trim() || fallback;
}

function stripFirstHeading(markdown) {
  return markdown.replace(/^\s*#\s+.+?\s*\r?\n+/, '').trim();
}

function chapterDescription(markdown) {
  const summary = markdown.match(/##\s+本章摘要\s+([\s\S]*?)(?=\n##\s+|\n#\s+|$)/);
  const source = summary?.[1] || markdown;
  return plainExcerpt(source, 150);
}

function plainExcerpt(value, limit = 120) {
  const text = String(value || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`|~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '';
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function linkIds(markdown) {
  return markdown.replace(/\b((EVT|PER|SRC|ORG|PLC)-\d{4})\b/g, (match, id, prefix, offset, fullText) => {
    const before = fullText.slice(Math.max(0, offset - 2), offset);
    const after = fullText.slice(offset + id.length, offset + id.length + 2);
    if (before.endsWith('[') || after.startsWith('](')) return id;
    return `[${id}](${idRoute(id)})`;
  });
}

function displayValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) {
    if (!value.length) return '—';
    return value.map((item) => displayValue(item)).join(', ');
  }
  if (typeof value === 'object') return inlineCode(JSON.stringify(value));
  return linkIds(String(value));
}

function tableValue(value) {
  return displayValue(value).replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
}

function inlineCode(value) {
  return `\`${String(value).replace(/`/g, '\\`')}\``;
}

function renderFieldTable(rows) {
  const body = rows
    .map(([label, value]) => `| ${label} | ${tableValue(value)} |`)
    .join('\n');
  return `| 字段 | 内容 |\n| --- | --- |\n${body}`;
}

function renderBullets(value) {
  if (!value) return '—';
  const items = Array.isArray(value) ? value : [value];
  if (!items.length) return '—';
  return items.map((item) => `- ${displayValue(item)}`).join('\n');
}

function splitMarkdownTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function parseFirstMarkdownTable(markdown) {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = lines.findIndex((line, index) => {
    const next = lines[index + 1] || '';
    return line.trim().startsWith('|') && /^\s*\|?\s*:?-{3,}:?\s*\|/.test(next);
  });
  if (headerIndex < 0) return [];

  const headers = splitMarkdownTableRow(lines[headerIndex]);
  const rows = [];
  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim().startsWith('|')) break;
    const cells = splitMarkdownTableRow(line);
    const row = {};
    headers.forEach((header, cellIndex) => {
      row[header] = cells[cellIndex] || '';
    });
    rows.push(row);
  }
  return rows;
}

function manuscriptOrder(fileName) {
  if (fileName === '00_preface.md') return 1;
  const chapter = fileName.match(/^ch_(\d+)/);
  if (chapter) return 10 + Number(chapter[1]);
  const appendix = fileName.match(/^appendix_([a-z])/);
  if (appendix) return 100 + appendix[1].charCodeAt(0) - 96;
  return 999;
}

async function generateHomePage() {
  await writeDoc(
    'index.md',
    {
      title: 'Project Moon 事件志',
      description: '一部面向中文读者的 Project Moon 世界事件、人物与组织编年读本。',
      template: 'splash',
      hero: {
        title: 'Project Moon 事件志',
        tagline: '按时间、事件、人物和组织重新整理都市的历史脉络。',
        actions: [
          { text: '开始阅读', link: '/book/00_preface/' },
          { text: '查看总时间线', link: '/reference/timeline/', variant: 'minimal' },
        ],
      },
      sidebar: { order: 1 },
    },
    `
<div class="site-cover">
  <img src="/assets/projectmoon-archive-cover.png" alt="Project Moon 事件志封面图：档案、时间线与都市剪影组成的抽象画面">
</div>

## 站点定位

这里不是官方设定集，也不是 Wiki 搬运，而是一份围绕 Project Moon 世界事件、人物、组织和资料来源建立的中文历史类读本。

## 阅读入口

- [阅读正文](/book/)
- [查看总时间线](/reference/timeline/)
- [按人物检索](/people/)
- [按事件检索](/events/)
- [核对资料来源](/sources/)
`
  );
}

async function generateBookPages() {
  const files = (await listMarkdownFiles(manuscriptDir))
    .filter((file) => file !== 'BOOK.md')
    .sort((a, b) => manuscriptOrder(a) - manuscriptOrder(b));

  const entries = [];
  for (const file of files) {
    const raw = await readText(path.join(manuscriptDir, file));
    const title = firstHeading(raw, path.basename(file, '.md'));
    const slug = path.basename(file, '.md');
    const order = manuscriptOrder(file);
    const body = linkIds(stripFirstHeading(raw));
    const description = chapterDescription(raw);

    entries.push({ title, slug, description, order });
    await writeDoc(
      `book/${file}`,
      {
        title,
        description,
        sidebar: { order, label: title },
      },
      body
    );
  }

  const tableRows = entries
    .map((entry) => `| [${entry.title}](/book/${entry.slug}/) | ${tableValue(entry.description)} |`)
    .join('\n');

  await writeDoc(
    'book/index.md',
    {
      title: '阅读目录',
      description: 'Project Moon 事件志的正文章节与附录目录。',
      sidebar: { order: 0, label: '阅读目录' },
    },
    `## 正文与附录\n\n| 篇章 | 摘要 |\n| --- | --- |\n${tableRows}`
  );
}

async function generateEventPages() {
  const files = await listMarkdownFiles(path.join(notesDir, 'events'), 'EVT-');
  const entries = [];

  for (const file of files) {
    const { data } = parseYamlDocument(await readText(path.join(notesDir, 'events', file)));
    const id = data.id || path.basename(file, '.md');
    const title = data.title || id;
    const fullTitle = `${id} ${title}`;
    const order = Number(id.match(/\d+/)?.[0] || 9999);

    entries.push({ id, title, status: data.status, time: data.time_position, summary: data.summary });
    await writeDoc(
      `events/${id}.md`,
      {
        title: fullTitle,
        description: plainExcerpt(data.summary, 150),
        sidebar: { order, label: id },
      },
      `
## 摘要

${displayValue(data.summary)}

## 基本信息

${renderFieldTable([
  ['事件 ID', id],
  ['确认状态', data.status],
  ['剧透级别', data.spoiler_level],
  ['时间位置', data.time_position],
  ['相关作品', data.related_works],
  ['参与者', data.participants],
  ['组织', data.organizations],
  ['地点', data.places],
  ['来源', data.sources],
])}

## 起因

${renderBullets(data.causes)}

## 经过

${renderBullets(data.process)}

## 结果

${renderBullets(data.outcomes)}

## 长期影响

${renderBullets(data.long_term_impact)}

## 冲突与备注

${renderFieldTable([
  ['冲突', data.conflicts],
  ['备注', data.notes],
  ['最后检查', data.last_checked],
])}
`
    );
  }

  const rows = entries
    .sort((a, b) => compareIds(a.id, b.id))
    .map((entry) => `| [${entry.id}](${idRoute(entry.id)}) | ${tableValue(entry.title)} | ${tableValue(entry.time)} | ${tableValue(entry.status)} | ${tableValue(entry.summary)} |`)
    .join('\n');

  await writeDoc(
    'events/index.md',
    {
      title: '事件索引',
      description: 'Project Moon 事件志中的事件卡索引。',
      sidebar: { order: 1, label: '事件索引' },
    },
    `| ID | 事件 | 时间位置 | 状态 | 摘要 |\n| --- | --- | --- | --- | --- |\n${rows}`
  );
}

async function generatePeoplePages() {
  const files = await listMarkdownFiles(path.join(notesDir, 'people'), 'PER-');
  const entries = [];

  for (const file of files) {
    const { data } = parseYamlDocument(await readText(path.join(notesDir, 'people', file)));
    const id = data.id || path.basename(file, '.md');
    const name = data.name || id;
    const title = `${id} ${name}`;
    const order = Number(id.match(/\d+/)?.[0] || 9999);

    entries.push({ id, name, aliases: data.aliases, affiliations: data.affiliations, summary: data.biographical_summary });
    await writeDoc(
      `people/${id}.md`,
      {
        title,
        description: plainExcerpt(data.biographical_summary, 150),
        sidebar: { order, label: name },
      },
      `
## 人物摘要

${displayValue(data.biographical_summary)}

## 基本信息

${renderFieldTable([
  ['人物 ID', id],
  ['姓名', data.name],
  ['别名', data.aliases],
  ['剧透级别', data.spoiler_level],
  ['相关作品', data.related_works],
  ['隶属组织', data.affiliations],
  ['首次已知登场', data.first_known_appearance],
  ['最后已知状态', data.last_known_status],
  ['关键事件', data.key_events],
  ['来源', data.sources],
])}

## 动机

${displayValue(data.motives)}

## 关系

${displayValue(data.relationships)}

## 不确定点

${displayValue(data.uncertain_points)}

## 核查

${renderFieldTable([['最后检查', data.last_checked]])}
`
    );
  }

  const rows = entries
    .sort((a, b) => compareIds(a.id, b.id))
    .map((entry) => `| [${entry.id}](${idRoute(entry.id)}) | ${tableValue(entry.name)} | ${tableValue(entry.aliases)} | ${tableValue(entry.affiliations)} | ${tableValue(entry.summary)} |`)
    .join('\n');

  await writeDoc(
    'people/index.md',
    {
      title: '人物索引',
      description: 'Project Moon 事件志中的人物卡索引。',
      sidebar: { order: 1, label: '人物索引' },
    },
    `| ID | 人物 | 别名 | 组织 | 摘要 |\n| --- | --- | --- | --- | --- |\n${rows}`
  );
}

async function generateSourcePages() {
  const files = await listMarkdownFiles(sourcesDir, 'SRC-');
  const entries = [];

  for (const file of files) {
    const { data } = parseYamlDocument(await readText(path.join(sourcesDir, file)));
    const id = data.id || path.basename(file, '.md');
    const title = data.title || id;
    const order = Number(id.match(/\d+/)?.[0] || 9999);

    entries.push({ id, title, level: data.source_level, publisher: data.publisher, url: data.url, summary: data.summary });
    await writeDoc(
      `sources/${id}.md`,
      {
        title: `${id} ${title}`,
        description: plainExcerpt(data.summary, 150),
        sidebar: { order, label: id },
      },
      `
## 来源摘要

${displayValue(data.summary)}

## 基本信息

${renderFieldTable([
  ['来源 ID', id],
  ['标题', data.url ? `[${title}](${data.url})` : title],
  ['来源等级', data.source_level],
  ['发布方', data.publisher],
  ['作者', data.author],
  ['发布日期', data.published_date],
  ['访问日期', data.accessed_date],
  ['语言', data.language],
  ['覆盖作品', data.covered_work],
  ['可靠性说明', data.reliability_notes],
  ['版权说明', data.copyright_notes],
])}

## 覆盖范围

${renderFieldTable([
  ['覆盖事件', data.covered_events],
  ['覆盖人物', data.covered_people],
  ['覆盖组织', data.covered_organizations],
  ['覆盖地点', data.covered_places],
])}

## 可用断言

${renderClaims(data.useful_claims)}
`
    );
  }

  const rows = entries
    .sort((a, b) => compareIds(a.id, b.id))
    .map((entry) => `| [${entry.id}](${idRoute(entry.id)}) | ${entry.url ? `[${tableValue(entry.title)}](${entry.url})` : tableValue(entry.title)} | ${tableValue(entry.level)} | ${tableValue(entry.publisher)} | ${tableValue(entry.summary)} |`)
    .join('\n');

  await writeDoc(
    'sources/index.md',
    {
      title: '资料来源',
      description: 'Project Moon 事件志引用和校准过的资料来源索引。',
      sidebar: { order: 1, label: '资料来源' },
    },
    `| ID | 标题 | 等级 | 发布方 | 摘要 |\n| --- | --- | --- | --- | --- |\n${rows}`
  );
}

function renderClaims(claims) {
  if (!Array.isArray(claims) || claims.length === 0) return '—';
  return claims
    .map((claim) => {
      const evidence = claim.evidence_type ? `（${claim.evidence_type}）` : '';
      const related = [claim.related_event_id, claim.related_person_id].filter(Boolean).map(displayValue).join(', ');
      return `- ${displayValue(claim.claim)}${evidence}${related ? `；关联：${related}` : ''}`;
    })
    .join('\n');
}

async function generateOrganizations() {
  const markdown = await readText(path.join(notesDir, 'organizations.md'));
  const rows = parseFirstMarkdownTable(markdown);
  const entries = rows.map((row) => ({
    id: row.ID,
    name: row['名称'],
    type: row['类型'],
    works: row['相关作品'],
    events: row['关联事件'],
    role: row['主要行动/历史作用'],
    sources: row['来源'],
    status: row['状态'],
  }));

  for (const entry of entries) {
    await writeDoc(
      `organizations/${entry.id}.md`,
      {
        title: `${entry.id} ${entry.name}`,
        description: plainExcerpt(entry.role, 150),
        sidebar: { order: Number(entry.id.match(/\d+/)?.[0] || 9999), label: entry.name },
      },
      `
## 组织信息

${renderFieldTable([
  ['组织 ID', entry.id],
  ['名称', entry.name],
  ['类型', entry.type],
  ['相关作品', entry.works],
  ['关联事件', entry.events],
  ['来源', entry.sources],
  ['状态', entry.status],
])}

## 历史作用

${displayValue(entry.role)}
`
    );
  }

  const indexRows = entries
    .map((entry) => `| [${entry.id}](${idRoute(entry.id)}) | ${tableValue(entry.name)} | ${tableValue(entry.type)} | ${tableValue(entry.events)} | ${tableValue(entry.status)} | ${tableValue(entry.role)} |`)
    .join('\n');

  await writeDoc(
    'organizations/index.md',
    {
      title: '组织索引',
      description: 'Project Moon 事件志中的组织索引。',
      sidebar: { order: 1, label: '组织索引' },
    },
    `| ID | 名称 | 类型 | 关联事件 | 状态 | 历史作用 |\n| --- | --- | --- | --- | --- | --- |\n${indexRows}`
  );
}

async function generatePlaces() {
  const markdown = await readText(path.join(notesDir, 'places.md'));
  const rows = parseFirstMarkdownTable(markdown);
  const entries = rows.map((row) => ({
    id: row.ID,
    name: row['名称'],
    type: row['类型'],
    works: row['相关作品'],
    events: row['关联事件'],
    role: row['历史作用'],
    sources: row['来源'],
    status: row['状态'],
  }));

  for (const entry of entries) {
    await writeDoc(
      `places/${entry.id}.md`,
      {
        title: `${entry.id} ${entry.name}`,
        description: plainExcerpt(entry.role, 150),
        sidebar: { order: Number(entry.id.match(/\d+/)?.[0] || 9999), label: entry.name },
      },
      `
## 地点信息

${renderFieldTable([
  ['地点 ID', entry.id],
  ['名称', entry.name],
  ['类型', entry.type],
  ['相关作品', entry.works],
  ['关联事件', entry.events],
  ['来源', entry.sources],
  ['状态', entry.status],
])}

## 历史作用

${displayValue(entry.role)}
`
    );
  }

  const indexRows = entries
    .map((entry) => `| [${entry.id}](${idRoute(entry.id)}) | ${tableValue(entry.name)} | ${tableValue(entry.type)} | ${tableValue(entry.events)} | ${tableValue(entry.status)} | ${tableValue(entry.role)} |`)
    .join('\n');

  await writeDoc(
    'places/index.md',
    {
      title: '地点索引',
      description: 'Project Moon 事件志中的地点索引。',
      sidebar: { order: 1, label: '地点索引' },
    },
    `| ID | 名称 | 类型 | 关联事件 | 状态 | 历史作用 |\n| --- | --- | --- | --- | --- | --- |\n${indexRows}`
  );
}

async function generateReferencePages() {
  await writeDoc(
    'reference/index.md',
    {
      title: '资料与附录',
      description: '时间线、术语表与辅助索引。',
      sidebar: { order: 1, label: '资料与附录' },
    },
    `- [总时间线](/reference/timeline/)\n- [术语表](/reference/terminology/)\n- [组织索引](/organizations/)\n- [地点索引](/places/)`
  );

  await copyMarkdownReference('timeline.md', 'reference/timeline.md', '总时间线', 2);
  await copyMarkdownReference('terminology.md', 'reference/terminology.md', '术语表', 3);
}

async function copyMarkdownReference(sourceName, targetName, title, order) {
  const raw = await readText(path.join(notesDir, sourceName));
  await writeDoc(
    targetName,
    {
      title,
      description: plainExcerpt(raw, 150),
      sidebar: { order, label: title },
    },
    linkIds(stripFirstHeading(raw))
  );
}

async function main() {
  assertSafeOutputPath();
  await fs.rm(outRoot, { recursive: true, force: true });
  await fs.mkdir(outRoot, { recursive: true });

  await generateHomePage();
  await generateBookPages();
  await generateEventPages();
  await generatePeoplePages();
  await generateOrganizations();
  await generatePlaces();
  await generateReferencePages();
  await generateSourcePages();

  console.log(`Generated Starlight content in ${path.relative(repoRoot, outRoot)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
