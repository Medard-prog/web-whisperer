
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoStepProps {
  name: string;
  email: string;
  phone: string;
  company: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  userLoggedIn: boolean;
  price: number;
  projectInfo: {
    title: string;
    websiteType: string;
    pageCount: number;
    designComplexity: string;
    hasCMS: boolean;
    hasEcommerce: boolean;
    hasSEO: boolean;
    hasMaintenance: boolean;
  };
}

const ContactInfoStep = ({
  name,
  email,
  phone,
  company,
  handleChange,
  userLoggedIn,
  price,
  projectInfo,
}: ContactInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nume complet <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          placeholder="Numele tău complet"
          value={name}
          onChange={handleChange}
          required
          readOnly={userLoggedIn}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="exemplu@gmail.com"
          value={email}
          onChange={handleChange}
          required
          readOnly={userLoggedIn}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+40 712 345 678"
          value={phone}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Companie</Label>
        <Input
          id="company"
          name="company"
          placeholder="Numele companiei tale (opțional)"
          value={company}
          onChange={handleChange}
        />
      </div>
      
      <div className="p-4 bg-brand-50 rounded-lg mt-6">
        <h3 className="font-medium text-lg mb-2">Rezumat ofertă</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Titlu proiect:</span>
            <span className="font-medium">{projectInfo.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Tip website:</span>
            <span className="font-medium capitalize">{projectInfo.websiteType}</span>
          </div>
          <div className="flex justify-between">
            <span>Număr pagini:</span>
            <span className="font-medium">{projectInfo.pageCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Design:</span>
            <span className="font-medium capitalize">{projectInfo.designComplexity}</span>
          </div>
          <div className="flex justify-between">
            <span>Funcționalități:</span>
            <div className="flex flex-col items-end">
              {projectInfo.hasCMS && <span>Sistem CMS</span>}
              {projectInfo.hasEcommerce && <span>Magazin online</span>}
              {projectInfo.hasSEO && <span>Optimizare SEO</span>}
              {projectInfo.hasMaintenance && <span>Mentenanță lunară</span>}
              {!projectInfo.hasCMS && !projectInfo.hasEcommerce && !projectInfo.hasSEO && !projectInfo.hasMaintenance && (
                <span className="text-gray-500">Niciuna</span>
              )}
            </div>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{price.toLocaleString()} RON</span>
            </div>
            {projectInfo.hasMaintenance && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>+ Mentenanță lunară:</span>
                <span>200 RON/lună</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;
