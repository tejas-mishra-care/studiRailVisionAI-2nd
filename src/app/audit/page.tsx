
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function AuditPage() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
            <p className="text-muted-foreground">
              Review a complete log of all system actions, AI decisions, and user inputs.
            </p>
          </div>
          <Card className="flex flex-col items-center justify-center h-96 border-dashed">
            <CardHeader>
              <CardTitle className="text-center text-xl text-muted-foreground">
                Feature In Development
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
                <History className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p>The full, filterable audit log is coming soon.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
