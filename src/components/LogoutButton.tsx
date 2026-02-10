import { useRouter } from "@tanstack/react-router";

const env = import.meta.env;
const LOGOUT_URL = env.VITE_BACKEND_LOGOUT_URL;

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch(LOGOUT_URL, {
            method: "POST",
            credentials: "include",
        });

        router.navigate({ to: "/login" });
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    )
}