"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ChevronLeft, BarChart } from "lucide-react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HrQaChat from "@/components/hr/hr-qa-chat";
import { useDashboard } from "@/lib/context";
import { ActiveAgent } from "@/types";

export default function AgentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { activeAgents } = useDashboard();
  const [agent, setAgent] = useState<ActiveAgent | null>(null);

  useEffect(() => {
    // Zoek de agent op basis van ID
    const foundAgent = activeAgents.find((a) => a.id === params.id);
    
    if (foundAgent) {
      setAgent(foundAgent);
    } else {
      // Als de agent niet wordt gevonden, redirect naar dashboard
      router.push('/dashboard?tab=active-agents');
    }
  }, [activeAgents, params.id, router]);

  if (!agent) {
    return <div>Laden...</div>;
  }

  // Bepaal welke component we moeten tonen op basis van de agent type
  const renderAgentComponent = () => {
    // Voor nu, alleen de HR Q&A chat component
    if (agent.title.includes("Personeelsgids Q&A")) {
      return <HrQaChat agentId={agent.id} agentName={agent.title} />;
    }
    
    // Default: nog niet geïmplementeerd bericht
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            {agent.icon}
            <span>{agent.title}</span>
          </CardTitle>
          <CardDescription>
            Deze agent is nog in ontwikkeling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-gray-500">
            De chat interface voor deze agent wordt binnenkort toegevoegd.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => router.push('/dashboard?tab=active-agents')}
            >
              <ChevronLeft size={16} />
              <span>Terug naar Dashboard</span>
            </Button>

            <div className="flex items-center gap-4">
              <span
                className={`flex items-center gap-1 text-sm ${
                  agent.status === "online"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    agent.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                {agent.status === "online" ? "Online" : "Gepauzeerd"}
              </span>

              <Button variant="outline" className="flex items-center gap-2">
                <BarChart size={16} />
                <span>Statistieken</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              {renderAgentComponent()}
            </div>
            
            <div className="space-y-4">
              {/* Agent Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Agent Informatie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p>{agent.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Afdeling</h3>
                    <p>{agent.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Interacties</h3>
                    <p>{agent.interactions}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
                    <p>{agent.successRate}%</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tips Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                      <span>Stel duidelijke vragen over HR onderwerpen.</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                      <span>Feedback helpt de agent slimmer te worden.</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                      <span>Chat werkt in het Nederlands en Engels.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 