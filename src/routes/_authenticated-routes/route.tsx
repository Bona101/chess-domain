import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { getMe } from "@/lib/auth";

export const Route = createFileRoute('/_authenticated-routes')({
  beforeLoad: async () => {
    const me = await getMe();

    if (!me) {
      throw redirect({
        to: "/login"
      });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='min-h-screen bg-green-500 flex flex-col'>
      <div className="bg-[#5196EB] flex justify-center items-center">
        <h1 className="text-4xl font-bold">Chess Domain</h1>
      </div>
      <Outlet />
    </div>
  )
}
