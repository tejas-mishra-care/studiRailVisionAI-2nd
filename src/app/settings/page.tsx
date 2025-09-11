
"use client";

import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStation } from "@/context/station-context";
import { UploadCloud } from "lucide-react";

export default function SettingsPage() {
  const { station } = useStation();

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage application settings and station configurations.
            </p>
          </div>
          <div className="grid max-w-2xl gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Station Configuration</CardTitle>
                <CardDescription>
                  Set the active railway station for the entire application. Live
                  data and optimizations will be focused on this station.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-station">Current Active Station</Label>
                  <Input
                    id="current-station"
                    readOnly
                    value={`${station.name} (${station.code})`}
                    className="font-semibold"
                  />
                </div>
                <Button disabled>Change Station (Coming Soon)</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Static Data Management</CardTitle>
                <CardDescription>
                  Upload or update the static layout data for the configured
                  station (e.g., platforms, tracks, signals). This data is
                  crucial for the AI's accuracy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <UploadCloud />
                  Import Station Layout Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
