import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import SignupOrLogin from "@/components/SignupOrLogin";

const env = import.meta.env;
const LOGIN_URL = env.VITE_BACKEND_LOGIN_URL;

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        const res = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include" // important to send cookie
        });

        if (res.ok) {
            alert("Logged in successfully!");
            console.log("logged in")
            router.navigate({ to: "/dashboard" });
        } else {
            alert("Login failed");
        }


    };

    return (
        <div>
            <SignupOrLogin action="Log in" handleAction={handleLogin} email={email} password={password} setEmail={setEmail} setPassword={setPassword} />
        </div>

    );
}
