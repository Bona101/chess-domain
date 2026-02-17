import { Link } from "@tanstack/react-router";


export default function Home() {
    return (
        <div className="flex flex-col gap-5 items-center">
            <Link to="/signup"><button className="cursor-pointer rounded-sm p-3 bg-gray-500 w-[6rem]">Sign up</button></Link>
            <Link to="/login"><button className="cursor-pointer rounded-sm p-3 bg-gray-500 w-[6rem]">Log in</button></Link>
        </div>
    );
}
