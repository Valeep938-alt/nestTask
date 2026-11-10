import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/client';
import { taskTypesApi, tasksApi, usersApi } from '../api/services';
import { Task, TaskStatus, TaskType, User } from '../api/types';
import AssignTaskForm from '../components/AssignTaskForm';
import TaskCard from '../components/TaskCard';
import TaskFilters, { EMPTY_FILTERS, filterTasks } from '../components/TaskFilters';
import TaskTypesPanel from '../components/TaskTypesPanel';

type Tab = 'tareas' | 'tipos';

export default function TeacherDashboard() {
  const [tab, setTab] = useState<Tab>('tareas');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [types, setTypes] = useState<TaskType[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [t, ty, s] = await Promise.all([tasksApi.list(), taskTypesApi.list(), usersApi.students()]);
      setTasks(t);
      setTypes(ty);
      setStudents(s);
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

  const remove = async (id: string) => {
    try {
      await tasksApi.remove(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const visible = filterTasks(tasks, filters);

  return (
    <>
      <div className="container page" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Panel · Profesor</p>
        <h1 className="title sm">
          Gestiona <em>tareas</em> y estudiantes.
        </h1>
        <div className="tabs">
          <button className={'tab' + (tab === 'tareas' ? ' active' : '')} onClick={() => setTab('tareas')}>
            Tareas
          </button>
          <button className={'tab' + (tab === 'tipos' ? ' active' : '')} onClick={() => setTab('tipos')}>
            Tipos de tarea
          </button>
        </div>
        {error && <div className="alert">{error}</div>}
      </div>

      {tab === 'tareas' ? (
        <>
          <div className="container">
            <AssignTaskForm students={students} types={types} onCreated={load} />
          </div>
          <TaskFilters value={filters} onChange={setFilters} types={types} />
          <div className="container" style={{ paddingBottom: '5rem' }}>
            {loading ? (
              <p className="muted">Cargando…</p>
            ) : visible.length === 0 ? (
              <div className="empty">No hay tareas para mostrar.</div>
            ) : (
              <div className="grid">
                {visible.map((t) => (
                  <TaskCard key={t.id} task={t} showStudent onStatusChange={changeStatus} onDelete={remove} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="container" style={{ paddingBottom: '5rem' }}>
          <TaskTypesPanel types={types} onChanged={load} />
        </div>
      )}
    </>
  );
}
