
export async function updateAreaMap(areaId, image_url) {
  const r = await fetch(`/areas/${areaId}`, {
    method: "PUT", headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ image_url })
  });
  if (!r.ok) throw new Error("updateAreaMap failed");
  return r.json();
}
