import { Role } from '../api/types';

export const homePathFor = (role: Role) =>
  role === 'profesor' ? '/profesor' : '/estudiante';
