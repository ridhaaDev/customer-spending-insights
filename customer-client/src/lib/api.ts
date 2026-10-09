// Base URL of the customer-api. Baked in at build time from NEXT_PUBLIC_API_URL.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  return res.json();
}
