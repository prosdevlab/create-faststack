export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(path, {
		headers: { "Content-Type": "application/json", ...init?.headers },
		...init,
	});

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}

	return res.json() as Promise<T>;
}
