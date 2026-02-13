// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet /> {/* This is where your individual pages will swap in and out */}
    <h1>Rejoice</h1>
    <div>
      Chess Domain
    </div>
      <TanStackRouterDevtools />
    </>
  ),
})