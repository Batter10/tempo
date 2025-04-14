"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bot,
  BriefcaseBusiness,
  Calculator,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useDashboard } from "@/lib/context";
import { useRouter } from "next/navigation";

export default function ActiveAgents() {
  const { activeAgents, pauseAgent, resumeAgent } = useDashboard();
  const router = useRouter();

  const navigateToTab = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  const navigateToAgentChat = (agentId: string) => {
    router.push(`/dashboard/agent/${agentId}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} minuten geleden`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} uur geleden`;
    } else {
      return `${Math.floor(diffMins / 1440)} dagen geleden`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Actieve Agents</h2>
        <p className="text-gray-600">
          Bekijk en beheer uw actieve AI-assistenten. Monitor hun prestaties en
          pas ze aan waar nodig.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeAgents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border col-span-2">
            <Bot size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              Geen actieve agents
            </h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Activeer een geconfigureerde template om te beginnen
            </p>
            <Button 
              variant="outline"
              onClick={() => navigateToTab("chosen-templates")}
            >
              Naar Gekozen Templates
            </Button>
          </div>
        ) : (
          activeAgents.map((agent) => (
            <Card
              key={agent.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {agent.icon}
                    </div>
                    <div>
                      <CardTitle>{agent.title}</CardTitle>
                      <CardDescription>{agent.department}</CardDescription>
                    </div>
                  </div>
                  <div>
                    {agent.status === "online" ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        Gepauzeerd
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Interacties</div>
                    <div className="text-2xl font-semibold">
                      {agent.interactions}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Succes Rate</div>
                    <div className="text-2xl font-semibold">
                      {agent.successRate}%
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Laatst actief: {formatTimeAgo(agent.lastActive)}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => navigateToAgentChat(agent.id)}
                >
                  <MessageSquare size={16} />
                  <span>Chat</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Settings size={16} />
                  <span>Instellingen</span>
                </Button>
                {agent.status === "online" ? (
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => pauseAgent(agent.id)}
                  >
                    <PauseCircle size={16} />
                    <span>Pauzeren</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => resumeAgent(agent.id)}
                  >
                    <PlayCircle size={16} />
                    <span>Hervatten</span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
