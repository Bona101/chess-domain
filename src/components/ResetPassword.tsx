import { useState } from "react";

const env = import.meta.env;
const RESET_PASSWORD_URL = env.VITE_BACKEND_RESET_PASSWORD_URL;


export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        const res = await fetch(RESET_PASSWORD_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword: password }),
            credentials: "include" // important to send cookie
        });

        if (res.ok) {
            alert("Check your email.");
        } else {
            alert("Sending email failed.");
        }


    };


    return (
        <div className="">
            <form onSubmit={sendEmail}>
                <div className="mb-12">
                    <p className="mb-1">Email</p>
                    <input
                        type="email"
                        autoComplete="email"
                        placeholder="xyz@gmail.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-white h-10 w-full text-lg rounded-sm p-1"
                        required
                    />
                </div>

                <div className="mb-12">
                    <p className="mb-1">New Password</p>
                    <input
                        type="password"
                        autoComplete="current-password"
                        placeholder="New Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-white h-10 w-full text-lg rounded-sm p-1"
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="w-22 bg-white rounded-sm py-1 cursor-pointer">Submit</button>
                </div>

            </form>
        </div>

    );
}
