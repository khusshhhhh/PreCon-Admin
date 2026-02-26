import { getCurrentUser } from '@/lib/auth';
import { defaultTaskTemplates } from '@/lib/defaultTasks';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });
  const form = await req.formData();

  const site = await prisma.site.create({
    data: {
      name: String(form.get('name') || ''),
      address: String(form.get('address') || ''),
      council: String(form.get('council') || ''),
      area: String(form.get('area') || ''),
      currentSituation: String(form.get('currentSituation') || ''),
      proposedDevelopment: String(form.get('proposedDevelopment') || ''),
      numberOfHouses: Number(form.get('numberOfHouses') || 1),
      numberOfStoreys: Number(form.get('numberOfStoreys') || 1),
      organizationId: user.organizationId,
      tasks: { create: defaultTaskTemplates }
    }
  });

  return Response.json(site);
}
