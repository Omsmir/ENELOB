'use client';
import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryInstance] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 5,
                        retryDelay: 500,
                        refetchOnReconnect: false,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );
    return (
        <QueryClientProvider client={queryInstance}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default QueryProvider;
