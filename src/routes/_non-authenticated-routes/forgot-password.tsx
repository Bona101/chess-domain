import ForgotPassword from '@/components/ForgotPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_non-authenticated-routes/forgot-password',
)({
    component: ForgotPassword,
})
