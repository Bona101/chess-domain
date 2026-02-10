import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

const env = import.meta.env;
const SIGNUP_URL = env.VITE_BACKEND_SIGNUP_URL;


export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch(SIGNUP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include" // important for session
        });

        if (res.ok) {
            alert("Signed up and logged in!");
            router.navigate({ to: "/dashboard" })
        } else {
            const msg = await res.text();
            alert("Signup failed: " + msg);
        }
    };

    return (
        <form onSubmit={handleSignup}>
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
            <button type="submit">Sign Up</button>
        </form>
    );
}
