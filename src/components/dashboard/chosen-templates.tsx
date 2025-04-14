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
  Edit,
  PlayCircle,
  Power,
  ShoppingCart,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useDashboard } from "@/lib/context";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useRef } from "react";
import HrQaConfigureDialog from "@/components/hr/hr-qa-configure-dialog";

export default function ChosenTemplates() {
  const { chosenTemplates, removeTemplate, activateTemplate, deactivateTemplate } = useDashboard();
  const router = useRouter();
  
  // State om bij te houden welke templates zijn ingeschakeld/geactiveerd
  const [templateSwitches, setTemplateSwitches] = useState<Record<string, boolean>>({});
  
  // Ref om bij te houden of de initiële effect al is uitgevoerd
  const initialEffectExecuted = useRef(false);

  // State voor het beheren van de HR Q&A configuratiedialog
  const [isHrQaDialogOpen, setIsHrQaDialogOpen] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState<string>("");

  // Initialiseer schakelaars op basis van status (alleen bij eerste render)
  useEffect(() => {
    if (initialEffectExecuted.current) return;
    
    const initialSwitches: Record<string, boolean> = {};
    chosenTemplates.forEach(template => {
      // Templates zijn alleen actief als de status "active" is
      initialSwitches[template.id] = template.status === 'active';
    });
    setTemplateSwitches(initialSwitches);
    
    initialEffectExecuted.current = true;
  }, [chosenTemplates]);

  // Update templateSwitches wanneer er nieuwe templates worden toegevoegd
  useEffect(() => {
    if (!initialEffectExecuted.current) return;
    
    chosenTemplates.forEach(template => {
      if (templateSwitches[template.id] === undefined) {
        // Als een nieuwe template wordt toegevoegd, zet de schakelaar op actief als status "active" is
        setTemplateSwitches(prev => ({
          ...prev,
          [template.id]: template.status === 'active'
        }));
      }
    });
  }, [chosenTemplates, templateSwitches]);

  const navigateToTab = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  const getStatusBadge = (status: "draft" | "configured" | "active") => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Actief
          </span>
        );
      case "configured":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Geconfigureerd
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Concept
          </span>
        );
    }
  };
  
  // Functie om de schakelaar per template te updaten - nu direct activeren/deactiveren
  const toggleTemplateSwitch = (id: string, isEnabled: boolean) => {
    // Update eerst de switches state
    setTemplateSwitches(prev => ({
      ...prev,
      [id]: isEnabled
    }));
    
    // Direct activeren of deactiveren op basis van de schakelaar
    setTimeout(() => {
      if (isEnabled) {
        activateTemplate(id);
      } else {
        deactivateTemplate(id);
      }
    }, 0);
  };

  // Functie om de configuratiedialog te openen
  const handleConfigureTemplate = (templateId: string, templateTitle: string) => {
    // Voor nu openen we alleen de HR Q&A Bot configuratiedialog
    if (templateTitle.includes("Personeelsgids Q&A")) {
      setCurrentTemplateId(templateId);
      setIsHrQaDialogOpen(true);
    } else {
      // Voor andere templates, gebruik de standaard configuratiefunctie
      // TODO: Implementeer configuratiedialogen voor andere templates
      alert(`Configuratie voor ${templateTitle} komt binnenkort beschikbaar`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Gekozen Templates</h2>
        <p className="text-gray-600">
          Bekijk en beheer de templates die u heeft geselecteerd. Configureer ze
          met uw data en activeer ze als AI-assistenten.
        </p>
      </div>

      {/* HR Q&A Configuratie Dialog */}
      {isHrQaDialogOpen && (
        <HrQaConfigureDialog
          isOpen={isHrQaDialogOpen}
          onClose={() => setIsHrQaDialogOpen(false)}
          templateId={currentTemplateId}
        />
      )}

      {/* Templates List */}
      <div className="space-y-4">
        {chosenTemplates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Bot size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              Geen templates geselecteerd
            </h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Ga naar Agent Templates om templates toe te voegen
            </p>
            <Button 
              variant="outline"
              onClick={() => navigateToTab("agent-templates")}
            >
              Bekijk Templates
            </Button>
          </div>
        ) : (
          chosenTemplates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-2/3">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                          {template.title}
                        </h3>
                        {getStatusBadge(template.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.department}
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Data bron:</span>
                          <span>{template.dataSource || "Geen data toegewezen"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Toegevoegd op:</span>
                          <span>
                            {new Date(template.dateAdded).toLocaleDateString(
                              "nl-NL",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 flex flex-row md:flex-col justify-end gap-2 md:w-1/3">
                  {/* Activeren toggle (voor alle templates) */}
                  <div className="flex items-center justify-between w-full mb-2 p-2 border rounded-md bg-white">
                    <span className="text-sm font-medium">Activeren</span>
                    <Switch 
                      checked={templateSwitches[template.id] || false}
                      onCheckedChange={(checked) => toggleTemplateSwitch(template.id, checked)}
                    />
                  </div>
                  
                  {/* Configureren knop */}
                  <Button 
                    className="flex items-center gap-2 w-full"
                    variant="outline"
                    onClick={() => handleConfigureTemplate(template.id, template.title)}
                  >
                    <Edit size={16} />
                    <span>Configureren</span>
                  </Button>
                  
                  {/* Verwijder knop onderaan (voor alle templates) */}
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2 w-full"
                    onClick={() => removeTemplate(template.id)}
                  >
                    <Trash2 size={16} />
                    <span>Verwijderen</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
