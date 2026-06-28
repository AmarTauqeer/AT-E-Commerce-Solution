import { api } from "../lib/axios";
export async function getRole(id:number) {
  const response = await api.get("/role/"+id);
  return response.data;
}

export async function getRoles() {
  const response = await api.get("/role/");
  return response.data;
}