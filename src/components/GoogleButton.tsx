// import { useEffect } from "react";

// declare global {
//     interface Window {
//         google: any;
//     }
// }

// interface GoogleButtonProps {
//     action: string
// }

// const env = import.meta.env;
// const GOOGLE_LOGIN_URL = env.VITE_BACKEND_GOOGLE_LOGIN_URL;

// export default function GoogleButton({ action }: GoogleButtonProps) {
//     useEffect(() => {
//         window.google.accounts.id.initialize({
//             client_id: "YOUR_GOOGLE_CLIENT_ID",
//             callback: handleCredentialResponse,
//         });

//         window.google.accounts.id.renderButton(
//             document.getElementById("googleBtn"),
//             { theme: "outline", size: "large" }
//         );
//     }, []);

//     async function handleCredentialResponse(response: any) {
//         await fetch(GOOGLE_LOGIN_URL, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//             body: JSON.stringify({ token: response.credential }),
//         });

//         window.location.href = "/dashboard";
//     }

//     return (
//         <button id="googleBtn" className="bg-gray-300 w-full py-2 mt-4 mb-12 cursor-pointer">
//             {action} with Google?
//         </button>
//     );

// }




import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from "@tanstack/react-router";

const env = import.meta.env;
const GOOGLE_LOGIN_URL = env.VITE_BACKEND_GOOGLE_LOGIN_URL;

export default function GoogleButton() {
    const router = useRouter();

    const handleSuccess = async (credentialResponse: any) => {
        // Send the token to your backend (Method 2)
        const res = await fetch(GOOGLE_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credentialResponse.credential }),
            credentials: "include" // important for session
        });

        if (res.ok) {
            router.navigate({ to: "/dashboard" });
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
        />
    );
}