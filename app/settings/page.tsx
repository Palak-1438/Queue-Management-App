import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { User, Key, Palette } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNavbar />

      <main className="md:pl-64 pt-6 px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
              <button className="flex items-center gap-2 bg-secondary text-secondary-foreground font-medium px-4 py-2.5 rounded-lg whitespace-nowrap text-left text-sm">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="flex items-center gap-2 hover:bg-muted text-muted-foreground font-medium px-4 py-2.5 rounded-lg whitespace-nowrap text-left transition-colors text-sm">
                <Key className="w-4 h-4" /> Security
              </button>
              <button className="flex items-center gap-2 hover:bg-muted text-muted-foreground font-medium px-4 py-2.5 rounded-lg whitespace-nowrap text-left transition-colors text-sm">
                <Palette className="w-4 h-4" /> Appearance
              </button>
            </nav>

            <div className="space-y-6">
              <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">Update your account profile details.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input type="text" defaultValue="Admin Manager" className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input type="email" defaultValue="admin@queueflow.com" className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" disabled />
                    <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6 opacity-50 pointer-events-none">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Key className="w-5 h-5 text-indigo-500" /> Password
                  </h3>
                  <p className="text-sm text-muted-foreground">Change your password (Coming Soon).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
