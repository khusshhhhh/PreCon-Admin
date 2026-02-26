import { PrismaClient, Stage } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const planningTasks = [
  ['Contour Survey', 'Surveyor', false, 14],
  ['Concept Drawings', 'Architect', true, 15],
  ['Planning Drawings', 'Architect', false, 20],
  ['Site & Drainage Plan', 'Engineer', false, 7],
  ['PlanSA Submission', 'PreCon Admin', false, 5]
] as const;

const developmentTasks = [
  ['Working Drawings', 'Architect', false, 20],
  ['Bore Logs', 'Surveyor', false, 20],
  ['Energy Report', 'Architect', false, 20],
  ['Footing Report', 'Engineer', false, 20],
  ['Timber Take-offs', 'Timber Company', false, 20],
  ['Structural Steel (if required)', 'Engineer', true, 7],
  ['CITB Levy Receipt', 'CITB', false, 5],
  ['Private Certifier Review / BRC', 'Private Certifier', false, 5],
  ['Development Approval', 'Council', false, 5]
] as const;

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: 'precon-org-seed' },
    update: {},
    create: { id: 'precon-org-seed', name: 'PreCon Admin' }
  });

  const passwordHash = await bcrypt.hash('Password@123', 10);

  const users = [
    { email: 'owner@preconadmin.app', name: 'Owner' },
    { email: 'admin2@preconadmin.app', name: 'Admin Two' }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, passwordHash, organizationId: org.id },
      create: { ...user, passwordHash, organizationId: org.id }
    });
  }

  const site = await prisma.site.upsert({
    where: { id: 'seed-site-001' },
    update: {},
    create: {
      id: 'seed-site-001',
      name: 'Demo - Prospect Townhouses',
      address: '10 Main St, Prospect SA',
      council: 'City of Prospect',
      area: '760sqm',
      currentSituation: 'Vacant land',
      proposedDevelopment: '3 Townhouses',
      numberOfHouses: 3,
      numberOfStoreys: 2,
      organizationId: org.id
    }
  });

  await prisma.task.deleteMany({ where: { siteId: site.id } });

  for (const task of planningTasks) {
    await prisma.task.create({
      data: {
        siteId: site.id,
        stage: Stage.PLANNING_APPROVAL,
        title: task[0],
        provider: task[1],
        isOptional: task[2],
        expectedDays: task[3]
      }
    });
  }

  for (const task of developmentTasks) {
    await prisma.task.create({
      data: {
        siteId: site.id,
        stage: Stage.DEVELOPMENT_APPROVAL,
        title: task[0],
        provider: task[1],
        isOptional: task[2],
        expectedDays: task[3]
      }
    });
  }

  console.log('Seed complete. Login: owner@preconadmin.app / Password@123');
}

main().finally(async () => prisma.$disconnect());
