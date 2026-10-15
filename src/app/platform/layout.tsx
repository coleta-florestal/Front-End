import Sidebar from "../../components/ui/Sidebar";
import Header from "../../components/ui/Header";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
            <Header />
            <Sidebar />
            <main className="w-full lg:pt-0 pt-16 pb-16 lg:pb-4">
                <div className="w-full bg-creme-flor min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-1rem)]">
                    {children}
                </div>
            </main>
        </div>
    )
}