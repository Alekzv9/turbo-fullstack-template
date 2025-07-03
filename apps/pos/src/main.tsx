import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { trpc } from './utils/trpc';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const apiUrl = import.meta.env.VITE_API_URL;

console.log('=== ENVIRONMENT DEBUG ===');
console.log('Environment variables:', import.meta.env);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('apiUrl variable:', apiUrl);
console.log('========================');

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${apiUrl}/trpc`,
      headers() {
        const token = localStorage.getItem('token');
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
