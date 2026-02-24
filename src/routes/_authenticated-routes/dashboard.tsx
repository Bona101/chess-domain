import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/components/Dashboard";
import { getMe } from "@/lib/auth";

interface MeResponse {
  authenticated: boolean,
  user: {
    id: number,
    email: string,
    username: string
  }
}

export const Route = createFileRoute("/_authenticated-routes/dashboard")({
  // to get username
  // ✅ loader returns data to component
  loader: async () => {
    const me: MeResponse | null = await getMe();
    return { username: me?.user.username };
  },
  component: Dashboard,
});
