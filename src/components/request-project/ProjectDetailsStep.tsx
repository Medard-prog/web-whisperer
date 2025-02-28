
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectDetailsStepProps {
  title: string;
  description: string;
  websiteType: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const ProjectDetailsStep = ({
  title,
  description,
  websiteType,
  handleChange,
  handleSelectChange,
}: ProjectDetailsStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titlu proiect <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          name="title"
          placeholder="ex: Website nou pentru compania mea"
          value={title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descriere proiect <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descrie detaliat ce fel de website îți dorești și ce obiective vrei să atingi"
          value={description}
          onChange={handleChange}
          rows={5}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="websiteType">Tip website <span className="text-red-500">*</span></Label>
        <Select
          value={websiteType}
          onValueChange={(value) => handleSelectChange('websiteType', value)}
        >
          <SelectTrigger id="websiteType">
            <SelectValue placeholder="Alege tipul de website" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="presentation">Website de prezentare</SelectItem>
            <SelectItem value="ecommerce">Magazin online</SelectItem>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="portfolio">Portofoliu</SelectItem>
            <SelectItem value="application">Aplicație web</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProjectDetailsStep;
