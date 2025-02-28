
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, MessageSquare } from "lucide-react";

const budgetRanges = [
  { label: "Sub 1,000 €", value: "under_1000" },
  { label: "1,000 € - 3,000 €", value: "1000_3000" },
  { label: "3,000 € - 5,000 €", value: "3000_5000" },
  { label: "5,000 € - 10,000 €", value: "5000_10000" },
  { label: "Peste 10,000 €", value: "over_10000" },
];

const StepThree = () => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Detalii Proiect</h3>
      <p className="text-sm text-gray-500 mb-6">
        Oferă-ne mai multe detalii despre proiectul tău și așteptările tale.
      </p>
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrierea Proiectului</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute left-3 top-3">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </div>
                <Textarea
                  placeholder="Descrie în detaliu proiectul tău, specificând funcționalitățile și obiectivele dorite..."
                  className="pl-10 min-h-[120px]"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FormField
          control={control}
          name="budget"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Buget Estimat</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {budgetRanges.map((range) => (
                    <div key={range.value} className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50">
                      <RadioGroupItem value={range.value} id={range.value} className="text-purple-600" />
                      <FormLabel htmlFor={range.value} className="font-normal text-gray-700 cursor-pointer flex-1">
                        {range.label}
                      </FormLabel>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Termen Limită (opțional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal border-gray-300",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Selectează o dată</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
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

export default StepThree;
