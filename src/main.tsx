import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// 1. Import the "map" that the plugin built for you
import { routeTree } from './routeTree.gen'

// 2. Create the router engine using that map
const router = createRouter({ routeTree })

// 3. Register the router for TypeScript (so it knows your routes are valid)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 4. Provide the router to your whole app */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)