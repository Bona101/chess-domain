import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_non-authenticated-routes/reset-password/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Missing token</div>
}
