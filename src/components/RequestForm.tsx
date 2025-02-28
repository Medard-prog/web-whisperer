
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PricingCalculator from "./PricingCalculator";

const RequestForm = () => {
  const { toast } = useToast();
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    websiteType: "",
    budget: "",
    timeline: "",
    description: "",
    requirements: "",
    heardFrom: "",
    termsAccepted: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const nextStep = () => {
    if (formStep === 0) {
      // Validate first step
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          variant: "destructive",
          title: "Câmpuri obligatorii",
          description: "Te rugăm să completezi toate câmpurile obligatorii.",
        });
        return;
      }
    }

    if (formStep === 1) {
      // Validate second step
      if (!formData.websiteType || !formData.budget || !formData.description) {
        toast({
          variant: "destructive",
          title: "Câmpuri obligatorii",
          description: "Te rugăm să completezi toate câmpurile obligatorii.",
        });
        return;
      }
    }

    setFormStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      toast({
        variant: "destructive",
        title: "Termeni și condiții",
        description: "Te rugăm să accepți termenii și condițiile înainte de a trimite cererea.",
      });
      return;
    }

    // Process form submission
    toast({
      title: "Cerere trimisă cu succes!",
      description: "Te vom contacta în curând pentru a discuta despre proiectul tău.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      websiteType: "",
      budget: "",
      timeline: "",
      description: "",
      requirements: "",
      heardFrom: "",
      termsAccepted: false,
    });
    setFormStep(0);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Solicită o ofertă personalizată</CardTitle>
        <CardDescription>
          Completează formularul de mai jos și vei primi o ofertă adaptată nevoilor tale.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {formStep === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name">Nume complet *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nume și prenume"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemplu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07XX XXX XXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Companie</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Numele companiei (opțional)"
                />
              </div>
            </div>
          )}

          {formStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="websiteType">Tipul de website *</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("websiteType", value)}
                  value={formData.websiteType}
                  required
                >
                  <SelectTrigger id="websiteType">
                    <SelectValue placeholder="Selectează tipul de website" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prezentare">Site de prezentare</SelectItem>
                    <SelectItem value="ecommerce">Magazin online</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="aplicatie">Aplicație web</SelectItem>
                    <SelectItem value="portofoliu">Portofoliu</SelectItem>
                    <SelectItem value="altele">Altele</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Buget estimat *</Label>
                <RadioGroup
                  onValueChange={(value) => handleSelectChange("budget", value)}
                  value={formData.budget}
                  className="flex flex-col space-y-1"
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="< 1000" id="budget-1" />
                    <Label htmlFor="budget-1">Sub 1.000 RON</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1000-3000" id="budget-2" />
                    <Label htmlFor="budget-2">1.000 - 3.000 RON</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3000-5000" id="budget-3" />
                    <Label htmlFor="budget-3">3.000 - 5.000 RON</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5000-10000" id="budget-4" />
                    <Label htmlFor="budget-4">5.000 - 10.000 RON</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="> 10000" id="budget-5" />
                    <Label htmlFor="budget-5">Peste 10.000 RON</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Termen limită</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("timeline", value)}
                  value={formData.timeline}
                >
                  <SelectTrigger id="timeline">
                    <SelectValue placeholder="Selectează termenul limită" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent (sub 2 săptămâni)</SelectItem>
                    <SelectItem value="normal">Normal (2-4 săptămâni)</SelectItem>
                    <SelectItem value="relaxed">Relaxat (1-2 luni)</SelectItem>
                    <SelectItem value="flexibil">Flexibil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrierea proiectului *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descrie pe scurt ce fel de website îți dorești"
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="requirements">Cerințe specifice</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Ai cerințe specifice pentru proiect? De exemplu, elemente de design, funcționalități speciale, etc."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heardFrom">De unde ai auzit despre noi?</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("heardFrom", value)}
                  value={formData.heardFrom}
                >
                  <SelectTrigger id="heardFrom">
                    <SelectValue placeholder="Selectează" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="recomandare">Recomandare</SelectItem>
                    <SelectItem value="altele">Altele</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("termsAccepted", checked as boolean)
                  }
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  Sunt de acord cu{" "}
                  <a href="/termeni-conditii" className="text-brand-600 hover:underline" target="_blank">
                    termenii și condițiile
                  </a>{" "}
                  și{" "}
                  <a href="/politica-confidentialitate" className="text-brand-600 hover:underline" target="_blank">
                    politica de confidențialitate
                  </a>
                </Label>
              </div>
            </div>
          )}

          {formStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Rezumatul cererii</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nume</p>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Companie</p>
                    <p className="font-medium">{formData.company || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tip website</p>
                    <p className="font-medium">{formData.websiteType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Buget</p>
                    <p className="font-medium">{formData.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Termen</p>
                    <p className="font-medium">{formData.timeline || "-"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Descriere proiect</p>
                  <p className="font-medium">{formData.description}</p>
                </div>
                
                {formData.requirements && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Cerințe specifice</p>
                    <p className="font-medium">{formData.requirements}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-brand-50 p-4 rounded-lg border border-brand-100">
                <p className="text-center text-brand-800">
                  Verifică informațiile de mai sus și trimite cererea ta. Te vom contacta în cel mai scurt timp pentru a discuta detaliile proiectului tău.
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {formStep > 0 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            Înapoi
          </Button>
        )}
        {formStep === 0 && <div></div>}
        
        {formStep < 3 ? (
          <Button type="button" onClick={nextStep}>
            Continuă
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit}>
            Trimite cererea
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RequestForm;
