export default function PlayOpponent({
    opponent
}: {
    opponent: string;
}) {
    return (
        <div className="bg-[#51E7EB] flex-1">
            <div className="flex">
                <div className="w-1/4">

                </div>

                <div className="w-1/2 mt-3">
                    <div className="w-full flex flex-col justify-center items-center">
                        <div className="flex items-center gap-3 w-[60%] my-3">
                            <div className="bg-gray-500 rounded-full w-7 h-7">

                            </div>
                            <div>
                                <p>{opponent}</p>
                                <p>Q, Bd, N</p>
                            </div>
                        </div>
                        <div className="bg-gray-500 w-[60%] aspect-square">

                        </div>
                        <div className="flex items-center gap-3 w-[60%] my-3">
                            <div className="bg-gray-500 rounded-full w-7 h-7">

                            </div>
                            <div>
                                <p>Me</p>
                                <p>Q, Bd, N</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-1/4">

                </div>
            </div>
        </div>
    );
}
