'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const statuses = ['NOT_STARTED', 'REQUESTED', 'IN_PROGRESS', 'REVISED', 'FINALISED', 'SUBMITTED', 'APPROVED'];

type SitePayload = any;

export function SiteDetailClient({ site }: { site: SitePayload }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function saveSite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/sites/${site.id}`, { method: 'PATCH', body: fd });
    setSaving(false);
    router.refresh();
  }

  async function updateTask(taskId: string, data: Record<string, string>) {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    router.refresh();
  }

  async function uploadDoc(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.append('siteId', site.id);
    await fetch('/api/upload', { method: 'POST', body: fd });
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  const planning = site.tasks.filter((t: any) => t.stage === 'PLANNING_APPROVAL');
  const dev = site.tasks.filter((t: any) => t.stage === 'DEVELOPMENT_APPROVAL');

  return (
    <>
      <div className="card">
        <h2>Site Details</h2>
        <form onSubmit={saveSite} className="grid two">
          <input name="name" defaultValue={site.name} />
          <input name="address" defaultValue={site.address} />
          <input name="council" defaultValue={site.council} />
          <input name="area" defaultValue={site.area} />
          <input name="currentSituation" defaultValue={site.currentSituation} />
          <input name="proposedDevelopment" defaultValue={site.proposedDevelopment} />
          <input name="numberOfHouses" type="number" defaultValue={site.numberOfHouses} />
          <input name="numberOfStoreys" type="number" defaultValue={site.numberOfStoreys} />
          <button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
        </form>
      </div>

      <TaskTable title="Planning Approval Checklist" tasks={planning} onTaskUpdate={updateTask} />
      <TaskTable title="Development Approval Checklist" tasks={dev} onTaskUpdate={updateTask} />

      <div className="card">
        <h2>Documents</h2>
        <form onSubmit={uploadDoc} className="grid two">
          <input name="label" required placeholder="Label (Form1 / Contract of Sale / Survey / Other)" />
          <input name="category" required placeholder="Category" />
          <select name="taskId" defaultValue="">
            <option value="">Not linked to task</option>
            {site.tasks.map((task: any) => <option key={task.id} value={task.id}>{task.title}</option>)}
          </select>
          <input name="file" type="file" required />
          <button className="primary" type="submit">Upload document</button>
        </form>
        <table className="table">
          <thead><tr><th>Label</th><th>Category</th><th>Uploaded</th><th>File</th></tr></thead>
          <tbody>
            {site.documents.map((doc: any) => (
              <tr key={doc.id}>
                <td>{doc.label}</td><td>{doc.category}</td><td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td><a href={doc.storagePath} target="_blank">{doc.fileName}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TaskTable({ title, tasks, onTaskUpdate }: { title: string; tasks: any[]; onTaskUpdate: (id: string, data: Record<string, string>) => Promise<void> }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <table className="table">
        <thead>
          <tr><th>Task</th><th>Provider</th><th>Status</th><th>Due Date</th><th>Reminder (days)</th><th>Optional</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.provider}</td>
              <td>
                <select defaultValue={task.status} onChange={(e) => onTaskUpdate(task.id, { status: e.target.value })}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </td>
              <td>
                <input type="date" defaultValue={task.dueDate ? task.dueDate.slice(0, 10) : ''} onBlur={(e) => onTaskUpdate(task.id, { dueDate: e.target.value })} />
              </td>
              <td>
                <input type="number" min={0} defaultValue={task.reminderDaysPrior} onBlur={(e) => onTaskUpdate(task.id, { reminderDaysPrior: e.target.value })} />
              </td>
              <td>{task.isOptional ? <span className="badge">Optional</span> : 'No'}</td>
              <td>
                <input defaultValue={task.notes || ''} onBlur={(e) => onTaskUpdate(task.id, { notes: e.target.value })} placeholder="Notes / RFI details" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
