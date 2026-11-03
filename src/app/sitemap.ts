import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { getPublicCategories, getPublicServices } from '@/lib/catalog/repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [services, categories] = await Promise.all([
    getPublicServices('fr'),
    getPublicCategories('fr'),
  ]);

  const staticPaths = ['', '/services', '/categories', '/about', '/contact', '/privacy', '/terms'];
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: `${siteUrl}${path || '/'}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: path === '' ? 1 : 0.8,
    });
  }

  for (const category of categories) {
    entries.push({
      url: `${siteUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const service of services) {
    entries.push({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: new Date(service.raw.updated_at),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  return entries;
}
