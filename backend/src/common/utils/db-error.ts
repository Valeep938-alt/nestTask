// Código de error de Postgres (23505 = duplicado, 23503 = llave foránea)
export const dbErrorCode = (error: unknown): string | undefined => {
  const e = error as { code?: string; driverError?: { code?: string } };
  return e?.driverError?.code ?? e?.code;
};
