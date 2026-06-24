import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const customDomain = process.env.CUSTOM_DOMAIN?.trim();
const site = process.env.SITE_URL?.trim() || (customDomain ? `https://${customDomain}` : 'https://example.com');
const base = process.env.BASE_PATH?.trim() || '/';

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: 'Project Moon 事件志',
      description: '一部面向中文读者的 Project Moon 世界事件、人物与组织编年读本。',
      customCss: ['./src/styles/custom.css'],
      components: {
        Footer: './src/components/Footer.astro',
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      sidebar: [
        {
          label: '入口',
          items: [
            { label: '首页', slug: '' },
            { label: '阅读目录', slug: 'book' },
          ],
        },
        {
          label: '正文',
          items: [{ autogenerate: { directory: 'book' } }],
        },
        {
          label: '索引',
          items: [
            { label: '总时间线', slug: 'reference/timeline' },
            { label: '人物索引', slug: 'people' },
            { label: '事件索引', slug: 'events' },
            { label: '组织索引', slug: 'organizations' },
            { label: '地点索引', slug: 'places' },
            { label: '术语表', slug: 'reference/terminology' },
            { label: '资料来源', slug: 'sources' },
          ],
        },
      ],
    }),
  ],
});
