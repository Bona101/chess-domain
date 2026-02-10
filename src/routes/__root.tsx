// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
    <h1>Rejoice</h1>
    <div className='bg'>
      Chess Domain
    </div>
      <Outlet /> {/* This is where your individual pages will swap in and out */}
      <TanStackRouterDevtools />
    </>
  ),
})