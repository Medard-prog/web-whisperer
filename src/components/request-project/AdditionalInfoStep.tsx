
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoStepProps {
  exampleUrls: string[];
  additionalInfo: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  addUrl: (url: string) => void;
  removeUrl: (index: number) => void;
}

const AdditionalInfoStep = ({
  exampleUrls,
  additionalInfo,
  handleChange,
  addUrl,
  removeUrl,
}: AdditionalInfoStepProps) => {
  const [newUrl, setNewUrl] = useState("");

  const handleAddUrl = () => {
    if (!newUrl) return;
    
    // Basic URL validation
    if (!newUrl.match(/^(http|https):\/\//)) {
      setNewUrl("https://" + newUrl);
      return;
    }
    
    addUrl(newUrl);
    setNewUrl("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exampleUrls">Website-uri exemplu</Label>
        <div className="flex gap-2">
          <Input
            id="newUrl"
            placeholder="https://exemplu.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <Button type="button" onClick={handleAddUrl} className="flex-shrink-0">
            Adaugă
          </Button>
        </div>
        {exampleUrls.length > 0 && (
          <div className="mt-2 space-y-2">
            {exampleUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-600 hover:underline"
                >
                  {url}
                </a>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeUrl(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Șterge
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Informații suplimentare</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          placeholder="Orice alte detalii care ar putea fi utile pentru proiectul tău"
          value={additionalInfo}
          onChange={handleChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
