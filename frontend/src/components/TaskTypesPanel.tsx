import { FormEvent, useState } from 'react';
import { getErrorMessage } from '../api/client';
import { taskTypesApi } from '../api/services';
import { TaskType } from '../api/types';

interface Props {
  types: TaskType[];
  onChanged: () => void;
}

export default function TaskTypesPanel({ types, onChanged }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await taskTypesApi.create({ name, ...(description ? { description } : {}) });
      setName('');
      setDescription('');
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const remove = async (id: number) => {
    setError('');
    try {
      await taskTypesApi.remove(id);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <form className="panel" onSubmit={create}>
        <h2>Nuevo tipo de tarea</h2>
        {error && <div className="alert">{error}</div>}
        <div className="form-grid">
          <div>
            <label className="label">Nombre</label>
            <input className="input" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Descripción</label>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <button className="btn" style={{ marginTop: '1.2rem' }}>
          Crear tipo
        </button>
      </form>

      <div className="panel">
        <h2>Tipos existentes</h2>
        {types.length === 0 && <p className="muted">Aún no hay tipos de tarea.</p>}
        {types.map((t) => (
          <div className="row" key={t.id}>
            <div>
              <strong style={{ fontWeight: 500 }}>{t.name}</strong>
              {t.description && <p className="card-meta">{t.description}</p>}
            </div>
            <button className="btn sm danger pill" onClick={() => remove(t.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
