import { ArrowLeft } from "../core/Icons";

export default function Topbar() {
    return (
        <div className="flex h-20.5 2-full items-center gap-4 bg-[#FBF9F2] py-6 px-4 border-b border-[#D8D1C4]">
            <div className="flex items-center justify-center text-verde-mata border-2 border-[#D8D1C4] rounded-lg p-2">
                <ArrowLeft />
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-verde-mata">título</h1>
                <p className="text-sm font-medium text-[#6D786E]">descrição</p>
            </div>
        </div>
    )
}