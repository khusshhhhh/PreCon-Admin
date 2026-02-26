import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const form = await req.formData();
  const site = await prisma.site.findFirst({ where: { id: params.id, organizationId: user.organizationId } });
  if (!site) return new Response('Not found', { status: 404 });

  const data = {
    name: String(form.get('name') || site.name),
    address: String(form.get('address') || site.address),
    council: String(form.get('council') || site.council),
    area: String(form.get('area') || site.area),
    currentSituation: String(form.get('currentSituation') || site.currentSituation),
    proposedDevelopment: String(form.get('proposedDevelopment') || site.proposedDevelopment),
    numberOfHouses: Number(form.get('numberOfHouses') || site.numberOfHouses),
    numberOfStoreys: Number(form.get('numberOfStoreys') || site.numberOfStoreys)
  };

  const updated = await prisma.site.update({ where: { id: site.id }, data });
  return Response.json(updated);
}
