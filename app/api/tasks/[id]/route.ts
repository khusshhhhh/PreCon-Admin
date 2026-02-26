import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();

  const task = await prisma.task.findFirst({ where: { id: params.id, site: { organizationId: user.organizationId } } });
  if (!task) return new Response('Not found', { status: 404 });

  const dueDate = body.dueDate ? new Date(body.dueDate) : task.dueDate;
  const reminderDaysPrior = body.reminderDaysPrior !== undefined ? Number(body.reminderDaysPrior) : task.reminderDaysPrior;

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      status: body.status || task.status,
      dueDate,
      reminderDaysPrior,
      notes: body.notes !== undefined ? body.notes : task.notes
    }
  });

  if (dueDate) {
    await prisma.reminder.deleteMany({ where: { taskId: task.id, recipientId: user.id, sentAt: null } });
    await prisma.reminder.create({
      data: {
        taskId: task.id,
        recipientId: user.id,
        remindAt: subDays(dueDate, reminderDaysPrior)
      }
    });
  }

  return Response.json(updated);
}
