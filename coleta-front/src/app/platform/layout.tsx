import Sidebar from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="w-full">
                <Topbar />
                <div className="w-full bg-creme-flor items-center justify-center px-4 py-6 sm:py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}