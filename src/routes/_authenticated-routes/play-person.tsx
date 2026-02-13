import { createFileRoute } from '@tanstack/react-router'
import PlayOpponent from '@/components/PlayOpponent';

export const Route = createFileRoute('/_authenticated-routes/play-person')({
  component: () => <PlayOpponent opponent="Person"/>,
})