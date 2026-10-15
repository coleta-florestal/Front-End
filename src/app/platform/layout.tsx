import Sidebar from "../../components/ui/Sidebar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="w-full">
                <div className="w-full bg-creme-flor items-center justify-center pb-4">
                    {children}
                </div>
            </main>
        </div>
    )
}