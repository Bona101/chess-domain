import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

const env = import.meta.env;
const LOGIN_URL = env.VITE_BACKEND_LOGIN_URL;

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include" // important to send cookie
        });

        if (res.ok) {
            alert("Logged in successfully!");
            router.navigate({ to: "/dashboard" });
        } else {
            alert("Login failed");
        }

        
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}
