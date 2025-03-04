import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

interface UseBackendOptions<T, P extends Record<string, string | number>> {
    fn: (params: P) => Promise<T>;
    params?: P;
    skip?: boolean;
}

interface UseBackendReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams: P) => Promise<void>;
}

export const useBackend = <T, P extends Record<string, string | number>>({
    fn,
    params = {} as P,
    skip = false,
}: UseBackendOptions<T, P>): UseBackendReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (fetchParams: P) => {
            setLoading(true);
            setError(null);

            try {
                const result = await fn(fetchParams);
                setData(result);
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                Alert.alert('Error', errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [fn]
    );

    useEffect(() => {
        if (!skip) {
            fetchData(params);
        }
    }, [fetchData, params, skip]);

    const refetch = async (newParams: P) => await fetchData(newParams);

    return { data, loading, error, refetch };
};
