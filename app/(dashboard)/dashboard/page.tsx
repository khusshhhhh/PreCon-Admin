import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SiteCreateForm } from '@/components/site-create-form';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const sites = await prisma.site.findMany({
    where: { organizationId: user!.organizationId },
    orderBy: { updatedAt: 'desc' },
    include: { tasks: true }
  });

  return (
    <>
      <div className="card">
        <h2>Create New Site</h2>
        <SiteCreateForm />
      </div>
      <div className="card">
        <h2>Sites Pipeline</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Site</th><th>Council</th><th>Address</th><th>Progress</th><th />
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => {
              const complete = site.tasks.filter((t) => t.status === 'APPROVED' || t.status === 'FINALISED').length;
              return (
                <tr key={site.id}>
                  <td>{site.name}</td>
                  <td>{site.council}</td>
                  <td>{site.address}</td>
                  <td>{complete}/{site.tasks.length} checklist items</td>
                  <td><Link href={`/dashboard/sites/${site.id}`}>Open</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
