
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train } from "lucide-react";

export default function RollingStockPage() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Rolling Stock Management</h1>
            <p className="text-muted-foreground">
              Track, manage, and view the status of all locomotives and coaches.
            </p>
          </div>
          <Card className="flex flex-col items-center justify-center h-96 border-dashed">
            <CardHeader>
              <CardTitle className="text-center text-xl text-muted-foreground">
                Feature In Development
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
                <Train className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p>The ability to manage rolling stock is coming soon.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
