import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh, no refetch
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time (cache retention)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on component mount if data is cached
      refetchOnReconnect: false, // Don't refetch on internet reconnect
      retry: 1, // Retry failed requests once
    },
  },
});