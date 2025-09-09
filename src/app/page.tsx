import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Map } from "@/components/dashboard/map";
import { ControlPanel } from "@/components/dashboard/control-panel";
import { LiveStatusPanel } from "@/components/dashboard/live-status-panel";
import { AIPanel } from "@/components/dashboard/ai-panel";


export default function Home() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Map />
              <AIPanel />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <ControlPanel />
              <LiveStatusPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
