import LogoutButton from "@/components/LogoutButton";
import { useRouter, Link } from "@tanstack/react-router";


export default function Dashboard() {
    const router = useRouter();
    return (
        <div className="bg-[#51E7EB] flex-1">
            <div className="flex">
                <div className="w-1/4">
                    <div className="flex gap-3 items-center my-3">
                        <div className="bg-gray-500 rounded-full w-4 h-4">

                        </div>
                        <p>Username</p>
                    </div>
                    <Link to="/play-computer">
                        <button className="bg-[#5196EB] block mb-5 p-2 rounded-sm w-[8rem] cursor-pointer">Play Computer</button>
                    </Link>
                    <Link to="/play-person">
                        <button className="bg-[#5196EB] block p-2 rounded-sm w-[8rem] cursor-pointer">Play Person</button>
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
