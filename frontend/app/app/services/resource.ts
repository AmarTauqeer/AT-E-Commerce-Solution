import { api } from "../lib/axios";
export async function getResources() {
  const response = await api.get("/resource/");
  return response.data;
}