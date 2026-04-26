import api from "@/lib/api";

export async function getChildren() {
  const res = await api.get("/children");
  return res.data;
}

export async function getChildById(id: string) {
  const res = await api.get(`/children/${id}`);
  return res.data;
}

export async function reviewChild(id: string) {
  const res = await api.patch(`/children/${id}/review`);
  return res.data;
}