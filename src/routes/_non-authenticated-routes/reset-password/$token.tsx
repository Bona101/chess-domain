import ResetPassword from '@/components/ResetPassword';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_non-authenticated-routes/reset-password/$token',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useParams();
  return <ResetPassword token={token}/>
}
