import { useEffect, useState } from "react";
import { fetchApi } from "./client";

interface UseApiResult<T> {
	data: T | null;
	error: string | null;
	loading: boolean;
}

export function useApi<T>(path: string): UseApiResult<T> {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		fetchApi<T>(path)
			.then((result) => {
				if (!cancelled) {
					setData(result);
					setLoading(false);
				}
			})
			.catch((err: Error) => {
				if (!cancelled) {
					setError(err.message);
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [path]);

	return { data, error, loading };
}
