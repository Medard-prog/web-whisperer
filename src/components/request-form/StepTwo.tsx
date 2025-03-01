
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileText, Globe, Building, ShoppingCart, Search, Palette, HeadsetIcon, Code, FileQuestion } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const projectTypes = [
  { label: "Website", value: "website", icon: Globe },
  { label: "Aplicație Web", value: "web_app", icon: Building },
  { label: "eCommerce", value: "ecommerce", icon: ShoppingCart },
  { label: "Optimizare SEO", value: "seo", icon: Search },
  { label: "Branding & Design", value: "branding", icon: Palette },
  { label: "Consultanță IT", value: "consulting", icon: HeadsetIcon },
  { label: "Integrare API", value: "api_integration", icon: Code },
  { label: "Altele", value: "other", icon: FileQuestion },
];

const StepTwo = () => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informații Proiect</h3>
      <p className="text-sm text-gray-500 mb-6">
        Spune-ne mai multe despre proiectul tău și cum putem să te ajutăm.
      </p>
      
      <div className="space-y-6">
        <FormField
          control={control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numele Proiectului</FormLabel>
              <FormControl>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Numele proiectului tău" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipul Proiectului</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectează tipul proiectului" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4 text-gray-500" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepTwo;
