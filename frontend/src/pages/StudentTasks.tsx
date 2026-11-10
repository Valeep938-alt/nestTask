import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/client';
import { taskTypesApi, tasksApi } from '../api/services';
import { Task, TaskStatus, TaskType } from '../api/types';
import TaskCard from '../components/TaskCard';
import TaskFilters, { EMPTY_FILTERS, filterTasks } from '../components/TaskFilters';
import { useAuth } from '../context/AuthContext';

export default function StudentTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [types, setTypes] = useState<TaskType[]>([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [t, ty] = await Promise.all([tasksApi.list(), taskTypesApi.list()]);
      setTasks(t);
      setTypes(ty);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id: string, status: TaskStatus) => {
    try {
      await tasksApi.updateStatus(id, status);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const visible = filterTasks(tasks, filters);

  return (
    <>
      <div className="container page" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Espacio · Estudiante</p>
        <h1 className="title sm">
          Hola, {user?.name}. Estas son tus <em>tareas</em>.
        </h1>
        {error && <div className="alert">{error}</div>}
      </div>

      <TaskFilters value={filters} onChange={setFilters} types={types} />

      <div className="container" style={{ paddingBottom: '5rem' }}>
        {loading ? (
          <p className="muted">Cargando…</p>
        ) : visible.length === 0 ? (
          <div className="empty">Aún no tienes tareas asignadas.</div>
        ) : (
          <div className="grid">
            {visible.map((t) => (
              <TaskCard key={t.id} task={t} onStatusChange={changeStatus} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
