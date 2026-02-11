const env = import.meta.env;
const ME_URL = env.VITE_BACKEND_ME_URL;

export async function getMe() {
    const res = await fetch(ME_URL, {
        credentials: "include",
    });

    if (!res.ok) { 
        console.log("notMe")
        return null; 
    }
    console.log("actuallyMe")
    return res.json();
}
