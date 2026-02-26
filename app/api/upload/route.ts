import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const form = await req.formData();
  const siteId = String(form.get('siteId') || '');
  const label = String(form.get('label') || '');
  const category = String(form.get('category') || 'Other Document');
  const taskIdRaw = String(form.get('taskId') || '');
  const file = form.get('file') as File;
  if (!siteId || !file) return new Response('Missing fields', { status: 400 });

  const site = await prisma.site.findFirst({ where: { id: siteId, organizationId: user.organizationId } });
  if (!site) return new Response('Site not found', { status: 404 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const folder = path.join(process.cwd(), 'public', 'uploads', siteId);
  await mkdir(folder, { recursive: true });
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const diskPath = path.join(folder, safeName);
  await writeFile(diskPath, buffer);

  const storagePath = `/uploads/${siteId}/${safeName}`;
  const doc = await prisma.document.create({
    data: {
      siteId,
      taskId: taskIdRaw || null,
      label,
      category,
      fileName: file.name,
      storagePath
    }
  });

  return Response.json(doc);
}
