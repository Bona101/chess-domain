import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import SignupOrLogin from "@/components/SignupOrLogin";

const env = import.meta.env;
const SIGNUP_URL = env.VITE_BACKEND_SIGNUP_URL;


export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch(SIGNUP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username }),
            credentials: "include" // important for session
        });

        if (res.ok) {
            alert("Signed up and logged in!");
            console.log("signed up")
            router.navigate({ to: "/dashboard" })
        } else {
            const msg = await res.text();
            alert("Signup failed: " + msg);
        }
    };

    return (
        <div>
            <SignupOrLogin action="Sign up" handleAction={handleSignup} email={email} password={password} setEmail={setEmail} setPassword={setPassword} username={username} setUsername={setUsername}/>
        </div>

    );
}
