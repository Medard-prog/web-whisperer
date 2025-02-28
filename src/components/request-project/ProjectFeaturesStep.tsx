
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProjectFeaturesStepProps {
  pageCount: number;
  designComplexity: string;
  hasCMS: boolean;
  hasEcommerce: boolean;
  hasSEO: boolean;
  hasMaintenance: boolean;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const ProjectFeaturesStep = ({
  pageCount,
  designComplexity,
  hasCMS,
  hasEcommerce,
  hasSEO,
  hasMaintenance,
  handleSelectChange,
  handleCheckboxChange,
}: ProjectFeaturesStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Număr de pagini</Label>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Pagini: {pageCount}</span>
          <span className="text-sm font-medium">+{pageCount * 150} RON</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={pageCount}
          onChange={(e) => handleSelectChange('pageCount', e.target.value)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Complexitate design</Label>
        <RadioGroup
          value={designComplexity}
          onValueChange={(value) => handleSelectChange('designComplexity', value)}
        >
          <div className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="simple" id="simple" />
              <Label htmlFor="simple" className="cursor-pointer">Design simplu</Label>
            </div>
            <span className="text-sm font-medium">+0 RON</span>
          </div>
          <div className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="cursor-pointer">Design standard</Label>
            </div>
            <span className="text-sm font-medium">+500 RON</span>
          </div>
          <div className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="premium" id="premium" />
              <Label htmlFor="premium" className="cursor-pointer">Design premium</Label>
            </div>
            <span className="text-sm font-medium">+1.200 RON</span>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-3">
        <Label>Funcționalități</Label>
        
        <div className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCMS"
              checked={hasCMS}
              onCheckedChange={(checked) => handleCheckboxChange('hasCMS', checked as boolean)}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="hasCMS" className="cursor-pointer">Sistem de administrare conținut (CMS)</Label>
              <p className="text-sm text-gray-500">Adaugă și editează conținutul website-ului fără cunoștințe tehnice</p>
            </div>
          </div>
          <span className="text-sm font-medium">+800 RON</span>
        </div>
        
        <div className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasEcommerce"
              checked={hasEcommerce}
              onCheckedChange={(checked) => handleCheckboxChange('hasEcommerce', checked as boolean)}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="hasEcommerce" className="cursor-pointer">Magazin online (eCommerce)</Label>
              <p className="text-sm text-gray-500">Vinde produse online, gestionează stocuri și comenzi</p>
            </div>
          </div>
          <span className="text-sm font-medium">+1.500 RON</span>
        </div>
        
        <div className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasSEO"
              checked={hasSEO}
              onCheckedChange={(checked) => handleCheckboxChange('hasSEO', checked as boolean)}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="hasSEO" className="cursor-pointer">Optimizare SEO</Label>
              <p className="text-sm text-gray-500">Optimizare pentru motoarele de căutare și strategie de cuvinte cheie</p>
            </div>
          </div>
          <span className="text-sm font-medium">+600 RON</span>
        </div>
        
        <div className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasMaintenance"
              checked={hasMaintenance}
              onCheckedChange={(checked) => handleCheckboxChange('hasMaintenance', checked as boolean)}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="hasMaintenance" className="cursor-pointer">Mentenanță lunară</Label>
              <p className="text-sm text-gray-500">Actualizări, backup-uri și suport tehnic lunar</p>
            </div>
          </div>
          <span className="text-sm font-medium">+200 RON/lună</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectFeaturesStep;
