import { createSession, validateUser } from '@/lib/auth';

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get('email') || '').toLowerCase().trim();
  const password = String(form.get('password') || '');
  const user = await validateUser(email, password);
  if (!user) return new Response('Unauthorized', { status: 401 });
  await createSession(user.id);
  return Response.json({ ok: true });
}
