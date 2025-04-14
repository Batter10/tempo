"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Template, ChosenTemplate, ActiveAgent, DataFolder, Department } from "@/types";
import {
  Bot,
  BriefcaseBusiness,
  Calculator,
  ShoppingCart,
  Users,
} from "lucide-react";

// Mock data voor templates
const templateData: Template[] = [
  {
    id: "hr-personnel-guide",
    title: "Personeelsgids Q&A",
    description:
      "Beantwoord vragen van medewerkers over het personeelshandboek en beleid.",
    department: "hr",
    icon: <Users size={24} className="text-blue-500" />,
    useCases: ["Verlofaanvragen", "Ziekmeldingen", "Arbeidsvoorwaarden"],
  },
  {
    id: "hr-onboarding",
    title: "Onboarding Assistent",
    description:
      "Begeleid nieuwe medewerkers door het onboardingproces met gepersonaliseerde instructies.",
    department: "hr",
    icon: <Users size={24} className="text-blue-500" />,
    useCases: ["Introductie", "Documentatie", "Training"],
  },
  {
    id: "logistics-inventory",
    title: "Voorraad Assistent",
    description:
      "Houd voorraden bij en genereer automatisch bestellingen wanneer nodig.",
    department: "logistics",
    icon: <BriefcaseBusiness size={24} className="text-green-500" />,
    useCases: ["Voorraadniveaus", "Bestellingen", "Leveranciersbeheer"],
  },
  {
    id: "logistics-cmr",
    title: "CMR Generator",
    description:
      "Genereer automatisch transportdocumenten op basis van ordergegevens.",
    department: "logistics",
    icon: <BriefcaseBusiness size={24} className="text-green-500" />,
    useCases: ["Vrachtbrieven", "Transportplanning", "Documentatie"],
  },
  {
    id: "finance-invoice",
    title: "Bon-naar-Factuur",
    description:
      "Converteer bonnetjes en kwitanties automatisch naar facturen voor de boekhouding.",
    department: "finance",
    icon: <Calculator size={24} className="text-purple-500" />,
    useCases: ["Bonverwerking", "Factuurcreatie", "Boekhouding"],
  },
  {
    id: "finance-expense",
    title: "Uitgavenanalyse",
    description:
      "Analyseer uitgavenpatronen en identificeer besparingsmogelijkheden.",
    department: "finance",
    icon: <Calculator size={24} className="text-purple-500" />,
    useCases: ["Kostenanalyse", "Budgettering", "Rapportage"],
  },
  {
    id: "sales-quote",
    title: "Offerte Maker",
    description:
      "Genereer professionele offertes op basis van klantgegevens en productcatalogus.",
    department: "sales",
    icon: <ShoppingCart size={24} className="text-orange-500" />,
    useCases: ["Prijsberekening", "Klantvoorstellen", "Verkoopbegeleiding"],
  },
  {
    id: "sales-crm",
    title: "CRM Generator",
    description:
      "Houd klantinteracties bij en genereer gepersonaliseerde follow-ups.",
    department: "sales",
    icon: <ShoppingCart size={24} className="text-orange-500" />,
    useCases: ["Klantbeheer", "Verkoopkansen", "Follow-up"],
  },
];

// Functie om verwijderde templates op te halen uit localStorage
const getStoredRemovedTemplateIds = (): string[] => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedIds = localStorage.getItem('removedTemplateIds');
    return storedIds ? JSON.parse(storedIds) : [];
  }
  return [];
};

// Initiële lijst van verwijderde templates
const initialRemovedIds = getStoredRemovedTemplateIds();

// Filter de initiële mock data op basis van verwijderde templates
const filterRemovedTemplates = (templates: ChosenTemplate[]) => {
  return templates.filter(template => !initialRemovedIds.includes(template.id));
};

// Mock data voor gekozen templates, gefilterd op verwijderde templates
const chosenTemplateData: ChosenTemplate[] = filterRemovedTemplates([
  {
    id: "hr-personnel-guide-1",
    title: "Personeelsgids Q&A",
    department: "HR",
    icon: <Users size={24} className="text-blue-500" />,
    status: "active",
    dataSource: "Personeelsdocumenten",
    dateAdded: "2023-10-15",
  },
  {
    id: "logistics-cmr-1",
    title: "CMR Generator",
    department: "Logistiek",
    icon: <BriefcaseBusiness size={24} className="text-green-500" />,
    status: "configured",
    dataSource: "Transportdocumenten",
    dateAdded: "2023-10-18",
  },
  {
    id: "finance-invoice-1",
    title: "Bon-naar-Factuur",
    department: "Financiën",
    icon: <Calculator size={24} className="text-purple-500" />,
    status: "draft",
    dataSource: "Facturen",
    dateAdded: "2023-10-20",
  },
]);

// Mock data voor data mappen
const dataFolderData: DataFolder[] = [];

// Context interface
interface DashboardContextType {
  templates: Template[];
  chosenTemplates: ChosenTemplate[];
  activeAgents: ActiveAgent[];
  dataFolders: DataFolder[];
  addTemplate: (template: Template) => void;
  removeTemplate: (id: string) => void;
  configureTemplate: (id: string) => void;
  activateTemplate: (id: string) => void;
  deactivateTemplate: (id: string) => void;
  pauseAgent: (id: string) => void;
  resumeAgent: (id: string) => void;
}

// Default context waarden
const defaultContext: DashboardContextType = {
  templates: templateData,
  chosenTemplates: chosenTemplateData,
  activeAgents: [],
  dataFolders: dataFolderData,
  addTemplate: () => {},
  removeTemplate: () => {},
  configureTemplate: () => {},
  activateTemplate: () => {},
  deactivateTemplate: () => {},
  pauseAgent: () => {},
  resumeAgent: () => {},
};

// Context aanmaken
const DashboardContext = createContext<DashboardContextType>(defaultContext);

// Custom hook voor gebruik van de context
export const useDashboard = () => useContext(DashboardContext);

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [templates, setTemplates] = useState<Template[]>(templateData);
  const [chosenTemplates, setChosenTemplates] = useState<ChosenTemplate[]>(chosenTemplateData);
  const [activeAgents, setActiveAgents] = useState<ActiveAgent[]>([]);
  const [dataFolders, setDataFolders] = useState<DataFolder[]>(dataFolderData);
  // Bijhouden welke templates verwijderd zijn
  const [removedTemplateIds, setRemovedTemplateIds] = useState<string[]>(initialRemovedIds);
  
  // Ref om te controleren of er een wijziging is in verwijderde templates
  const removedIdsRef = useRef<string[]>(initialRemovedIds);
  
  // Flag om bij te houden of we al een update uitvoeren
  const isUpdatingRef = useRef(false);

  // Als removedTemplateIds verandert, update localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('removedTemplateIds', JSON.stringify(removedTemplateIds));
      removedIdsRef.current = removedTemplateIds;
    }
  }, [removedTemplateIds]);

  // Initialiseer actieve agents (alleen bij eerste render)
  useEffect(() => {
    // Converteer actieve templates naar agents
    const activeTemplates = chosenTemplates.filter(
      (template) => template.status === "active" && !removedTemplateIds.includes(template.id)
    );
    
    const newActiveAgents = activeTemplates.map((template) => ({
      id: template.id,
      title: template.title,
      department: template.department,
      icon: template.icon,
      status: "online" as const,
      interactions: Math.floor(Math.random() * 100) + 50,
      lastActive: new Date().toISOString(),
      successRate: Math.floor(Math.random() * 15) + 85,
    }));
    
    setActiveAgents(newActiveAgents);
  }, []); // Leeg dependency array -> voert alleen uit bij eerste render

  // Effect voor het filteren van verwijderde templates
  useEffect(() => {
    // Voorkom oneindige lus door te controleren of we al een update uitvoeren
    if (isUpdatingRef.current) return;
    
    // Voer filtering alleen uit als er echt verwijderde templates zijn
    if (removedTemplateIds.length > 0) {
      isUpdatingRef.current = true;
      
      // Filter verwijderde templates uit
      setChosenTemplates(prevTemplates => {
        const filtered = prevTemplates.filter(template => !removedTemplateIds.includes(template.id));
        
        // Als er geen wijzigingen zijn, voorkom onnodige re-renders
        if (filtered.length === prevTemplates.length) {
          return prevTemplates;
        }
        
        return filtered;
      });
      
      // Reset de flag na een korte vertraging
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [removedTemplateIds]);

  // Effect voor het bijwerken van actieve agents wanneer chosenTemplates wijzigt
  useEffect(() => {
    // Filter actieve templates en zet ze om naar agents
    const activeTemplates = chosenTemplates.filter(
      (template) => template.status === "active" && !removedTemplateIds.includes(template.id)
    );
    
    // Controleer of er echt iets is veranderd om onnodige updates te voorkomen
    const activeTemplateIds = activeTemplates.map(t => t.id).sort().join(',');
    const currentAgentIds = activeAgents.map(a => a.id).sort().join(',');
    
    if (activeTemplateIds !== currentAgentIds) {
      const newActiveAgents = activeTemplates.map((template) => {
        // Behoud bestaande agent data indien beschikbaar
        const existingAgent = activeAgents.find(agent => agent.id === template.id);
        
        if (existingAgent) {
          return existingAgent;
        }
        
        // Anders maak een nieuwe agent
        return {
          id: template.id,
          title: template.title,
          department: template.department,
          icon: template.icon,
          status: "online" as const,
          interactions: 0,
          lastActive: new Date().toISOString(),
          successRate: 100,
        };
      });
      
      setActiveAgents(newActiveAgents);
    }
  }, [chosenTemplates]); // Alleen afhankelijk van chosenTemplates

  // Functies voor template beheer
  const addTemplate = (template: Template) => {
    // Genereer een uniek ID voor de nieuwe template
    const newId = `${template.id}-${Date.now()}`;
    
    // Controleer of de template al geselecteerd is
    const isAlreadyChosen = chosenTemplates.some(
      (chosen) => chosen.id === newId
    );

    if (!isAlreadyChosen) {
      const newChosenTemplate: ChosenTemplate = {
        id: newId,
        title: template.title,
        department: template.department === "hr" ? "HR" :
                   template.department === "logistics" ? "Logistiek" :
                   template.department === "finance" ? "Financiën" :
                   "Sales",
        icon: template.icon,
        status: "draft",
        dataSource: "",
        dateAdded: new Date().toISOString().split("T")[0],
      };
      
      setChosenTemplates([...chosenTemplates, newChosenTemplate]);
    }
  };

  const removeTemplate = (id: string) => {
    // Voeg de ID toe aan de lijst van verwijderde templates
    setRemovedTemplateIds(prev => [...prev, id]);
    
    // Verwijder de template uit de gekozen templates
    setChosenTemplates(chosenTemplates.filter((template) => template.id !== id));
    
    // Als er een actieve agent is voor deze template, verwijder die ook
    setActiveAgents(activeAgents.filter((agent) => agent.id !== id));
  };

  const configureTemplate = (id: string) => {
    setChosenTemplates(
      chosenTemplates.map((template) =>
        template.id === id
          ? { ...template, status: "configured" as const }
          : template
      )
    );
  };

  const activateTemplate = (id: string) => {
    // Update template status
    const updatedTemplates = chosenTemplates.map((template) =>
      template.id === id
        ? { ...template, status: "active" as const }
        : template
    );
    
    setChosenTemplates(updatedTemplates);
    
    // Voeg agent toe aan actieve agents
    const templateToActivate = updatedTemplates.find((t) => t.id === id);
    if (templateToActivate) {
      const newAgent: ActiveAgent = {
        id: templateToActivate.id,
        title: templateToActivate.title,
        department: templateToActivate.department,
        icon: templateToActivate.icon,
        status: "online",
        interactions: 0,
        lastActive: new Date().toISOString(),
        successRate: 100,
      };
      
      setActiveAgents([...activeAgents, newAgent]);
    }
  };

  const deactivateTemplate = (id: string) => {
    // Update template status
    setChosenTemplates(
      chosenTemplates.map((template) =>
        template.id === id
          ? { ...template, status: "configured" as const }
          : template
      )
    );
    
    // Verwijder de agent
    setActiveAgents(activeAgents.filter((agent) => agent.id !== id));
  };

  const pauseAgent = (id: string) => {
    setActiveAgents(
      activeAgents.map((agent) =>
        agent.id === id ? { ...agent, status: "paused" as const } : agent
      )
    );
  };

  const resumeAgent = (id: string) => {
    setActiveAgents(
      activeAgents.map((agent) =>
        agent.id === id ? { ...agent, status: "online" as const } : agent
      )
    );
  };

  // Context waarde
  const value = {
    templates,
    chosenTemplates,
    activeAgents,
    dataFolders,
    addTemplate,
    removeTemplate,
    configureTemplate,
    activateTemplate,
    deactivateTemplate,
    pauseAgent,
    resumeAgent,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}; 