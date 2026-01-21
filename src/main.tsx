import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 1. Import the QueryClient and Provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. Create a client instance
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(

<StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
