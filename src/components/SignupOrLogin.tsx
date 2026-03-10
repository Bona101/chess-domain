import { Link } from "@tanstack/react-router";
import GoogleButton from "@/components/GoogleButton";

type AuthAction = "Sign up" | "Log in";

interface SignupOrLoginProps {
    action: AuthAction,
    handleAction: (e: React.FormEvent<HTMLFormElement>) => void,
    email: string,
    setEmail: (value: string) => void,
    password: string,
    setPassword: (value: string) => void,
    // username?: string,
    setUsername?: (value: string) => void
}

type CompulsoryUsernameForSignup = (
    | { action: "Sign up"; username: string; setUsername: (value: string) => void }
    | { action: "Log in"; username?: string; setUsername?: (value: string) => void }
)

type FinalProps = SignupOrLoginProps & CompulsoryUsernameForSignup;


export default function SignupOrLogin({ action,
    handleAction,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername
}: FinalProps
) {

    return (
        <div className="flex flex-col items-center">
            <p className="w-1/4 text-2xl mb-2">{action}</p>
            <div className="bg-gray-500 p-5 w-1/4 rounded-lg">
                <form onSubmit={handleAction}>
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
                        <p className="mb-1">Password</p>
                        <input
                            type="password"
                            autoComplete={action === "Sign up" ? "new-password" : "current-password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="bg-white h-10 w-full text-lg rounded-sm p-1"
                            required
                        />
                    </div>
                    {action === "Sign up" && <div className="mb-12">
                        <p className="mb-1">Username</p>
                        <input
                            type="text"
                            autoComplete="username"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="bg-white h-10 w-full text-lg rounded-sm p-1"
                            required
                        />
                    </div>}
                    <GoogleButton />
                    {action === "Log in" && <Link to="/dashboard" className="text-blue-500">Forgot Password?</Link> }
                    <div className="flex justify-end">
                        <button type="submit" className="w-22 bg-white rounded-sm py-1 cursor-pointer">{action}</button>
                    </div>

                </form>
            </div>
            <div className="flex justify-end gap-2 bg-9red-50 w-1/4">
                <p>{action === "Sign up" ? "Already have an account?" : "Don't have an account?"}</p>
                <Link to={action === "Sign up" ? "/login" : "/signup"}> <p className="text-blue-500">{action === "Sign up" ? "Log in" : "Sign up"}</p></Link>

            </div>
        </div>

    );
}
