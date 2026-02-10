import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "@/components/Dashboard";
import { getMe } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const me = await getMe();

    if (!me){
        throw redirect({
            to: "/login"
        });
    }
  },
  component: Dashboard,
});
