import Signup from '@/components/Signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_non-authenticated-routes/signup')({
  component: Signup,
})