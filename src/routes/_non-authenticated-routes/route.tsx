import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_non-authenticated-routes')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className='flex flex-col items-center mt-3 mb-7'>
        <p>Welcome to</p>
        <h1 className='text-4xl font-bold'>Chess Domain</h1>
      </div>
      <Outlet />
    </div>
  )
}
