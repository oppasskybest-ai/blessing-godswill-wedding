/** Calls an admin API route with the signed-in admin's token. Returns an error message or ''. */
export async function adminPost(path: string, token: string | undefined, body: unknown): Promise<string> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    return res.ok ? '' : data.error || `Failed (${res.status}).`
  } catch {
    return 'Network problem. Please try again.'
  }
}
