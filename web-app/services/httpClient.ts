const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function httpClient(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",   // ✅ include cookies (Auth0 session)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || "API request failed");
  }

  return res.json();
}
