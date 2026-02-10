import { useRouter } from "@tanstack/react-router";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("http://localhost:5000/logout", {
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