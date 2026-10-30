import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <div className="flex flex-1 min-h-0 w-full">
        <Sidebar />
        <main className="flex-1 min-h-0 lg:pt-0 pt-16 pb-16 lg:pb-4 overflow-y-auto bg-creme-flor flex flex-col">
          <div className="w-full flex-1 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
