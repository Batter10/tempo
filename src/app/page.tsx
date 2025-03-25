import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
  FileText,
  Database,
  Bot,
  BriefcaseBusiness,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white" id="templates">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Waarom Slimme Assistent?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Wij revolutioneren de manier waarop MKB-bedrijven AI implementeren
              met gebruiksvriendelijke technologie en ongeëvenaarde service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BriefcaseBusiness className="w-6 h-6" />,
                title: "Voor het MKB",
                description:
                  "Speciaal ontworpen voor Nederlandse MKB-bedrijven",
              },
              {
                icon: <Bot className="w-6 h-6" />,
                title: "Afdelingsgerichte AI",
                description: "Templates voor HR, Logistiek, Financiën en Sales",
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Intelligente Data Verwerking",
                description:
                  "Automatische verwerking van PDF's, Excel en afbeeldingen",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Gebruiksvriendelijk",
                description: "Geen technische kennis vereist",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              AI-Templates per Afdeling
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kies uit onze vooraf gebouwde templates die zijn afgestemd op
              specifieke afdelingsbehoeften.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "HR",
                description:
                  "Automatiseer personeelszaken en verbeter de werknemerservaring",
                useCases: [
                  "Personeelsgids Q&A",
                  "Onboarding Assistent",
                  "Verlofaanvragen",
                ],
              },
              {
                title: "Logistiek",
                description:
                  "Optimaliseer uw supply chain en voorraadbeheersprocessen",
                useCases: [
                  "Voorraad Assistent",
                  "Verzendplanning",
                  "Leveranciersmanagement",
                ],
              },
              {
                title: "Financiën",
                description:
                  "Vereenvoudig financiële processen en verbeter inzichten",
                useCases: [
                  "Factuurverwerking",
                  "Uitgavenanalyse",
                  "Budgetplanning",
                ],
              },
              {
                title: "Sales",
                description: "Boost uw verkoopresultaten en klantrelaties",
                useCases: [
                  "CRM Generator",
                  "Verkoopvoorspellingen",
                  "Klantcommunicatie",
                ],
              },
            ].map((category, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-2xl font-semibold mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <ul className="space-y-2">
                  {category.useCases.map((useCase, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Upload Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Intelligente Data Verwerking
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Upload uw bedrijfsgegevens en laat onze AI het zware werk doen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-blue-700 rounded-xl">
              <FileText className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <div className="text-xl font-bold mb-2">PDF Documenten</div>
              <div className="text-blue-100">
                Automatische extractie van relevante informatie uit uw
                bedrijfsdocumenten
              </div>
            </div>
            <div className="p-6 bg-blue-700 rounded-xl">
              <Database className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <div className="text-xl font-bold mb-2">Excel Bestanden</div>
              <div className="text-blue-100">
                Intelligente verwerking van spreadsheets en databestanden
              </div>
            </div>
            <div className="p-6 bg-blue-700 rounded-xl">
              <Bot className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <div className="text-xl font-bold mb-2">
                Automatische Suggesties
              </div>
              <div className="text-blue-100">
                Slimme veldherkenning en mapping suggesties voor optimale
                resultaten
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Klaar om te Beginnen?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Sluit u aan bij Nederlandse MKB-bedrijven die hun bedrijfsprocessen
            al hebben getransformeerd met onze AI-assistenten.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Nu Gratis
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
