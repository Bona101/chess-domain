import LogoutButton from "@/components/LogoutButton";
import { Link } from "@tanstack/react-router";

import { useLoaderData } from "@tanstack/react-router";

export default function Dashboard() {
    const { username } = useLoaderData({ from: "/_authenticated-routes/dashboard" });

    return (
        <div className="bg-[#51E7EB] flex-1">
            <div className="flex">
                <div className="w-1/4">
                    <div className="flex gap-3 items-center my-3">
                        <div className="bg-gray-500 rounded-full w-4 h-4">

                        </div>
                        <p>{username ?? "username"}</p>
                    </div>

                    <Link to="/play-computer" className="bg-[#5196EB] block mb-5 p-2 rounded-sm w-[8rem] cursor-pointer">
                        Play Computer
                    </Link>

                    <Link to="/play-person" className="bg-[#5196EB] block p-2 rounded-sm w-[8rem] cursor-pointer">
                        Play Person
                    </Link>
                </div>

                <div className="w-1/2 mt-10 flex justify-center items-center">
                    <div className="bg-gray-500 w-[65%] aspect-square">

                    </div>
                </div>

                <div className="w-1/4">

                </div>
            </div>
            <LogoutButton />
        </div>
    );
}
