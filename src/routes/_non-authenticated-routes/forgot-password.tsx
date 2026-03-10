import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from '@/components/ForgotPassword';

export const Route = createFileRoute('/_non-authenticated-routes/login')({
    component: ForgotPassword,
})
