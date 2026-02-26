import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SiteDetailClient } from '@/components/site-detail-client';

export default async function SitePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const site = await prisma.site.findFirst({
    where: { id: params.id, organizationId: user!.organizationId },
    include: { tasks: { orderBy: [{ stage: 'asc' }, { createdAt: 'asc' }] }, documents: { orderBy: { uploadedAt: 'desc' } } }
  });
  if (!site) notFound();
  return <SiteDetailClient site={site} />;
}
