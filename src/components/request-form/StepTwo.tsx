
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const projectTypes = [
  { label: "Website", value: "website" },
  { label: "Aplicație Web", value: "web_app" },
  { label: "eCommerce", value: "ecommerce" },
  { label: "Optimizare SEO", value: "seo" },
  { label: "Branding & Design", value: "branding" },
  { label: "Consultanță IT", value: "consulting" },
  { label: "Integrare API", value: "api_integration" },
  { label: "Altele", value: "other" },
];

const StepTwo = () => {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  
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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between border-gray-300 text-left font-normal"
                    >
                      {field.value
                        ? projectTypes.find((type) => type.value === field.value)?.label
                        : "Selectează tipul proiectului"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Caută tipul proiectului..." />
                    <CommandEmpty>Nu a fost găsit niciun tip de proiect.</CommandEmpty>
                    <CommandGroup>
                      {projectTypes.map((type) => (
                        <CommandItem
                          key={type.value}
                          value={type.value}
                          onSelect={(currentValue) => {
                            setValue("projectType", currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === type.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {type.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepTwo;
