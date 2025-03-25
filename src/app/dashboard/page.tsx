import DashboardNavbar from "@/components/dashboard-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Database,
  FileText,
  InfoIcon,
  LayoutGrid,
  UserCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import AgentTemplates from "@/components/dashboard/agent-templates";
import DataStorage from "@/components/dashboard/data-storage";
import ChosenTemplates from "@/components/dashboard/chosen-templates";
import ActiveAgents from "@/components/dashboard/active-agents";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-semibold mb-2">
                Welkom bij Slimme Assistent
              </h2>
              <p className="text-gray-600">
                Selecteer, configureer en implementeer AI-assistenten voor uw
                bedrijf zonder technische kennis. Kies uit onze vooraf gebouwde
                templates per afdeling, upload uw data, en activeer uw slimme
                assistenten in minuten.
              </p>
            </div>
          </header>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="agent-templates" className="w-full">
            <TabsList className="w-full bg-white border rounded-lg mb-6 p-1 h-auto flex flex-wrap">
              <TabsTrigger
                value="agent-templates"
                className="flex items-center gap-2 py-3 flex-grow"
              >
                <Bot size={18} />
                <span>Agent Templates</span>
              </TabsTrigger>
              <TabsTrigger
                value="data-storage"
                className="flex items-center gap-2 py-3 flex-grow"
              >
                <Database size={18} />
                <span>Data Storage</span>
              </TabsTrigger>
              <TabsTrigger
                value="chosen-templates"
                className="flex items-center gap-2 py-3 flex-grow"
              >
                <FileText size={18} />
                <span>Gekozen Templates</span>
              </TabsTrigger>
              <TabsTrigger
                value="active-agents"
                className="flex items-center gap-2 py-3 flex-grow"
              >
                <LayoutGrid size={18} />
                <span>Actieve Agents</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agent-templates" className="space-y-6">
              <AgentTemplates />
            </TabsContent>

            <TabsContent value="data-storage" className="space-y-6">
              <DataStorage />
            </TabsContent>

            <TabsContent value="chosen-templates" className="space-y-6">
              <ChosenTemplates />
            </TabsContent>

            <TabsContent value="active-agents" className="space-y-6">
              <ActiveAgents />
            </TabsContent>
          </Tabs>

          {/* User Profile Section */}
          <section className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-primary" />
              <div>
                <h2 className="font-semibold text-xl">Gebruikersprofiel</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
