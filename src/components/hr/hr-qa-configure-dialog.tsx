"use client";

import { useState, useEffect } from "react";
import { Users, Trash2, Upload, FileText, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/lib/context";
import { supabase } from "@/lib/supabase/client";

interface HrQaConfigureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
}

interface Document {
  id: string;
  filename: string;
  file_path: string;
  created_at: string;
}

export default function HrQaConfigureDialog({
  isOpen,
  onClose,
  templateId,
}: HrQaConfigureDialogProps) {
  const router = useRouter();
  const { configureTemplate, activateTemplate } = useDashboard();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [botName, setBotName] = useState("HR Personeelsgids Q&A");
  const [customInstructions, setCustomInstructions] = useState("");
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  // Voorbeeld vragen om te tonen
  const exampleQuestions = [
    "Hoeveel vakantiedagen krijg ik per jaar?",
    "Hoe moet ik me ziek melden?",
    "Wat is de regeling voor thuiswerken?",
  ];

  // Documenten ophalen bij het openen van de dialoog
  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen]);

  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      const { data, error } = await supabase
        .from('hr.documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadResult(null); // Reset previous results
    }
  };

  const handleDeleteDocument = async (id: string, filePath: string) => {
    try {
      // Verwijder het bestand uit de storage
      const { error: storageError } = await supabase
        .storage
        .from('hr_documents')
        .remove([filePath.replace('hr_documents/', '')]);
      
      if (storageError) throw storageError;
      
      // Verwijder de database entry
      const { error: dbError } = await supabase
        .from('hr.documents')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      // Update lokale lijst
      setDocuments(documents.filter(doc => doc.id !== id));
      
      // Toon bevestiging
      setUploadResult({
        success: true,
        message: 'Document succesvol verwijderd',
      });
      
    } catch (error) {
      console.error('Error deleting document:', error);
      setUploadResult({
        success: false,
        message: 'Fout bij het verwijderen van document',
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadResult({
        success: false,
        message: "Selecteer eerst een bestand om te uploaden",
      });
      return;
    }

    // Controleer of het een PDF, DOC, DOCX, TXT is
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setUploadResult({
        success: false,
        message:
          "Ongeldig bestandstype. Upload een PDF, DOC, DOCX of TXT bestand.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10); // Start progress

    try {
      // Maak een FormData object
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Uploading file:', selectedFile.name);
      setUploadProgress(20);

      // Upload naar de API
      const response = await fetch('/api/hr/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90); // Almost done

      // Check of we een geldige JSON-response krijgen
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Geen JSON-response, waarschijnlijk een 404 of 500 HTML-pagina
        console.error('Ongeldige response van API, content-type:', contentType);
        const textResponse = await response.text();
        console.error('Response tekst (eerste 150 tekens):', textResponse.substring(0, 150));
        throw new Error(`API-route reageert niet met JSON. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(result?.error || `Error ${response.status}: ${response.statusText}`);
      }

      setUploadProgress(100);
      
      // Bericht aanpassen voor verschillende types documenten
      let successMessage = '';
      if (result.chunks > 0) {
        successMessage = `${selectedFile.name} succesvol geüpload en verwerkt in ${result.chunks} tekstfragmenten.`;
      } else if (result.message) {
        successMessage = `${selectedFile.name} succesvol geüpload. ${result.message}`;
      } else {
        successMessage = `${selectedFile.name} succesvol geüpload.`;
      }
      
      setUploadResult({
        success: true,
        message: successMessage
      });

      // Reset bestandsselectie
      setSelectedFile(null);
      if (document.getElementById('document') as HTMLInputElement) {
        (document.getElementById('document') as HTMLInputElement).value = '';
      }
      
      // Ververs documenten lijst
      fetchDocuments();

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: `Fout bij uploaden: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleActivate = async () => {
    if (documents.length === 0) {
      setUploadResult({
        success: false,
        message: "Upload eerst een document om de bot te kunnen activeren",
      });
      return;
    }

    try {
      // Bewaar template configuratie in Supabase
      await supabase.from('hr.template_configs').insert({
        template_id: templateId,
        template_name: botName,
        language_detection: true, // Altijd aan
        custom_instructions: customInstructions || null,
      });

      // Configureer de template
      configureTemplate(templateId);
      
      // Na 1.5 seconde activeren we de template en sluiten we de dialoog
      setTimeout(() => {
        activateTemplate(templateId);
        onClose();
        // Refresh pagina om alles weer te geven
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error('Activation error:', error);
      setUploadResult({
        success: false,
        message: `Fout bij activeren: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span>HR Q&A Bot Configureren</span>
          </DialogTitle>
          <DialogDescription>
            Upload een personeelsgids of andere HR-documenten om de HR-assistent te
            voeden met informatie.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Bot naam */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="botName" className="col-span-1 text-right">
              Bot naam
            </Label>
            <Input
              id="botName"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Bestand uploaden */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document" className="col-span-1 text-right">
              HR Document
            </Label>
            <div className="col-span-3 space-y-1.5">
              <div className="flex gap-2">
                <Input
                  id="document"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  disabled={isUploading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading || !selectedFile}
                  type="button"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Uploaden
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload een PDF, Word of tekstbestand van uw personeelsgids.
              </p>
            </div>
          </div>

          {/* Taaldetectie informatie (geen switch meer) */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="col-span-1 text-right pt-2">
              Taaldetectie
            </Label>
            <div className="col-span-3 p-3 bg-blue-50 rounded-md flex gap-2 text-sm text-blue-700">
              <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
              <span>De bot antwoordt automatisch in dezelfde taal als de vraag (Nederlands of Engels)</span>
            </div>
          </div>

          {/* Geüploade documenten lijst */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="col-span-1 text-right pt-2">
              Documenten
            </Label>
            <div className="col-span-3">
              {isLoadingDocuments ? (
                <p className="text-sm text-gray-500">Documenten laden...</p>
              ) : documents.length === 0 ? (
                <p className="text-sm text-gray-500">Geen documenten beschikbaar</p>
              ) : (
                <div className="border rounded-md divide-y">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{doc.filename}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
                        className="h-8 px-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom instructies */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="instructions" className="col-span-1 text-right pt-2">
              Instructies
            </Label>
            <div className="col-span-3 space-y-1.5">
              <Textarea
                id="instructions"
                placeholder="Optionele aanvullende instructies voor de HR-assistent..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Optioneel: aanvullende instructies voor de AI-assistent.
              </p>
            </div>
          </div>

          {/* Voorbeeldvragen */}
          <div className="mt-2 rounded-md bg-slate-50 p-4">
            <h4 className="mb-2 font-medium">Voorbeeldvragen om te stellen:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {exampleQuestions.map((question, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  {question}
                </li>
              ))}
            </ul>
          </div>

          {/* Upload result message */}
          {uploadResult && (
            <div
              className={`rounded-md p-3 text-sm ${
                uploadResult.success
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {uploadResult.message}
            </div>
          )}

          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Uploaden & verwerken...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Annuleren
          </Button>
          <Button 
            onClick={handleActivate} 
            disabled={isUploading || documents.length === 0}
          >
            {isUploading ? "Bezig..." : "Activeren"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 