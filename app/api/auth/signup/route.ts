import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').toLowerCase().trim();
  const password = String(form.get('password') || '');

  if (!name || !email || password.length < 8) return new Response('Bad request', { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return new Response('Already exists', { status: 409 });

  let org = await prisma.organization.findFirst({ where: { name: 'PreCon Admin' } });
  if (!org) {
    org = await prisma.organization.create({ data: { name: 'PreCon Admin' } });
  }

  const userCount = await prisma.user.count({ where: { organizationId: org.id } });
  if (userCount >= 2) return new Response('Organization seat limit reached (2 users)', { status: 403 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, organizationId: org.id } });
  await createSession(user.id);
  return Response.json({ ok: true });
}
