import { FormEvent, useState } from 'react';
import { getErrorMessage } from '../api/client';
import { tasksApi } from '../api/services';
import { NewTask, TaskType, User } from '../api/types';

interface Props {
  students: User[];
  types: TaskType[];
  onCreated: () => void;
}

const EMPTY = { user_id: '', title: '', description: '', due_date: '', task_type_id: '' };

export default function AssignTaskForm({ students, types, onCreated }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof EMPTY, value: string) => setForm({ ...form, [key]: value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body: NewTask = { user_id: form.user_id, title: form.title };
      if (form.description) body.description = form.description;
      if (form.due_date) body.due_date = form.due_date;
      if (form.task_type_id) body.task_type_id = Number(form.task_type_id);
      await tasksApi.create(body);
      setForm(EMPTY);
      onCreated();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel" onSubmit={submit}>
      <h2>Asignar tarea</h2>
      {error && <div className="alert">{error}</div>}

      <div className="form-grid">
        <div>
          <label className="label">Estudiante</label>
          <select className="select" required value={form.user_id} onChange={(e) => set('user_id', e.target.value)}>
            <option value="">Selecciona…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Título</label>
          <input className="input" required minLength={2} value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div>
          <label className="label">Tipo de tarea</label>
          <select className="select" value={form.task_type_id} onChange={(e) => set('task_type_id', e.target.value)}>
            <option value="">Sin tipo</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Fecha de entrega</label>
          <input className="input" type="date" value={form.due_date} onChange={(e) => set('due_date', e.target.value)} />
        </div>
      </div>

      <div className="field" style={{ marginTop: '1.2rem' }}>
        <label className="label">Descripción</label>
        <textarea className="textarea" value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      <button className="btn" disabled={saving}>
        {saving ? 'Guardando…' : 'Asignar tarea'}
      </button>
    </form>
  );
}
