import { prisma } from '../lib/prisma';
import { sendMail } from '../lib/mailer';

async function main() {
  const pending = await prisma.reminder.findMany({
    where: { sentAt: null, remindAt: { lte: new Date() } },
    include: {
      recipient: true,
      task: { include: { site: true } }
    }
  });

  for (const reminder of pending) {
    await sendMail({
      to: reminder.recipient.email,
      subject: `Reminder: ${reminder.task.title} for ${reminder.task.site.name}`,
      text: `Task ${reminder.task.title} is due on ${reminder.task.dueDate?.toDateString() || 'No due date'}. Status: ${reminder.task.status}`
    });

    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { sentAt: new Date() }
    });
  }

  console.log(`Processed ${pending.length} reminders.`);
}

main().finally(async () => prisma.$disconnect());
