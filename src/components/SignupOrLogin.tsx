import { Link } from "@tanstack/react-router";

export default function SignupOrLogin({ action,
    handleAction,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername
}: {
    action: string,
    handleAction: (e: React.FormEvent<HTMLFormElement>) => void,
    email: string,
    setEmail: (value: string) => void,
    password: string,
    setPassword: (value: string) => void,
    // username?: string,
    setUsername?: (value: string) => void
} & (
        | { action: "Sign up"; username: string; setUsername: (value: string) => void }
        | { action: "Log in"; username?: string; setUsername?: (value: string) => void }
    )
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
                        />
                    </div>}
                    <button className="bg-gray-300 w-full py-2 mt-4 mb-12 cursor-pointer">{action} with Google?</button>
                    <div className="flex justify-end">
                        <button type="submit" className="w-22 bg-white rounded-sm py-1 cursor-pointer">{action}</button>
                    </div>

                </form>
            </div>
            <div className="flex justify-end gap-2 bg-9red-50 w-1/4">
                <p>{action === "Sign up" ? "Already have an account?" : "Don't have an account?"}</p>
                <Link to="/login"> <p className="text-blue-500">{action === "Sign up" ? "Login" : "Sign up"}</p></Link>

            </div>
        </div>

    );
}
