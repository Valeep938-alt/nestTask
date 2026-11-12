import { axiosClient } from "../config/axiosClient";

export interface StudentOption {
  id: string;
  name: string;
  email: string;
}

export const usersService = {
  students: () =>
    axiosClient
      .get<StudentOption[]>("/users", { params: { role: "estudiante" } })
      .then((res) => res.data),
};
