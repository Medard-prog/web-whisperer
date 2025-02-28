
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const commonFeatures = [
  { id: "responsive", label: "Design Responsive" },
  { id: "seo", label: "Optimizare SEO" },
  { id: "cms", label: "Sistem de Management al Conținutului" },
  { id: "analytics", label: "Integrare Google Analytics" },
  { id: "social", label: "Integrare cu Rețelele Sociale" },
  { id: "payments", label: "Procesare Plăți" },
  { id: "multilingual", label: "Suport Multilingv" },
  { id: "blog", label: "Blog / Secțiune de Știri" },
];

const StepFour = () => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Funcționalități & Confirmare</h3>
      <p className="text-sm text-gray-500 mb-6">
        Selectează funcționalitățile dorite și confirmă cererea ta de proiect.
      </p>
      
      <FormField
        control={control}
        name="features"
        render={() => (
          <FormItem>
            <div className="mb-3">
              <FormLabel>Funcționalități (opțional)</FormLabel>
              <p className="text-xs text-gray-500 mt-1">
                Selectează funcționalitățile pe care le dorești în proiectul tău
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonFeatures.map((feature) => (
                <FormField
                  key={feature.id}
                  control={control}
                  name="features"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={feature.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 hover:bg-gray-50"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(feature.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([...currentValues, feature.id]);
                              } else {
                                field.onChange(
                                  currentValues.filter((value) => value !== feature.id)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {feature.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="bg-purple-50 p-4 rounded-md border border-purple-200 mt-8">
        <FormField
          control={control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal">
                  Sunt de acord cu <a href="#" className="text-purple-600 hover:underline">termenii și condițiile</a> și <a href="#" className="text-purple-600 hover:underline">politica de confidențialitate</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <p className="text-xs text-gray-500 mt-4">
          După trimiterea cererii, vom analiza proiectul tău și te vom contacta cât mai curând posibil pentru a discuta despre detalii și pentru a-ți oferi o estimare de preț și timp.
        </p>
      </div>
    </div>
  );
};

export default StepFour;
