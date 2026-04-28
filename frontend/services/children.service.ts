import api from "@/lib/api";
import { FilterParams } from "@/types/filters";
import { Child, CreateChildInput, UpdateChildInput } from "@/types/child";

export interface ChildrenResponse {
  list: Child[] ; 
  totalPages: number;
  totalItems: number;
}

export async function getChildren(params?: FilterParams & { page?: number }): Promise<ChildrenResponse> {
  const res = await api.get<ChildrenResponse>("/children", { params });
  return res.data;
}

export async function getChildById(id: string | number): Promise<Child> {
  const res = await api.get<Child>(`/children/${id}`);
  return res.data;
}

export async function createChild(data: CreateChildInput): Promise<Child> {
  const res = await api.post<Child>("/children", data);
  return res.data;
}

export async function updateChild(id: string | number, data: UpdateChildInput): Promise<Child> {
  const res = await api.put<Child>(`/children/${id}`, data);
  return res.data;
}

export async function deleteChild(id: string | number): Promise<void> {
  await api.delete(`/children/${id}`);
}

export async function reviewChild(id: string | number): Promise<Child> {
  const res = await api.patch<Child>(`/children/${id}/review`);
  return res.data;
}