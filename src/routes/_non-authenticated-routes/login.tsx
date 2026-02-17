import { createFileRoute, redirect } from '@tanstack/react-router'
import Login from '@/components/Login'
import { getMe } from "@/lib/auth";


export const Route = createFileRoute('/_non-authenticated-routes/login')({
  beforeLoad: async () => {
      const me = await getMe();
  
      if (me){
          throw redirect({
              to: "/dashboard"
          });
      }
    },
    component: Login,
})
