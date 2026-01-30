import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/pastplayed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/pastplayed"!</div>
}
