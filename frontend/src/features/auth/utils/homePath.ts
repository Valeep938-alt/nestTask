import type { Role } from "../types";

export function homePathFor(role: Role): string {
  return role === "profesor" ? "/profesor" : "/estudiante";
}
