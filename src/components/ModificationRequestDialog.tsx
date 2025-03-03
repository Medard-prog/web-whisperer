import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Descrierea trebuie să conțină cel puțin 10 caractere",
  }),
  budget: z.string().min(1, {
    message: "Selectează un buget",
  }),
  customBudget: z.string().optional(),
  priority: z.string().min(1, {
    message: "Selectează prioritatea",
  }),
  timeline: z.string().min(1, {
    message: "Selectează un termen",
  }),
  customTimeline: z.string().optional(),
});

interface ModificationRequestDialogProps {
  children: React.ReactNode;
  projectId: string;
  userId: string;
  onRequestComplete?: () => void;
}

const ModificationRequestDialog = ({
  children,
  projectId,
  userId,
  onRequestComplete,
}: ModificationRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("request");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      budget: "",
      customBudget: "",
      priority: "normal",
      timeline: "",
      customTimeline: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const finalBudget = values.budget === "custom" ? values.customBudget : values.budget;
      const finalTimeline = values.timeline === "custom" ? values.customTimeline : values.timeline;
      
      const { data, error } = await supabase
        .from("project_modification_requests")
        .insert([
          {
            project_id: projectId,
            user_id: userId,
            description: values.description,
            budget: finalBudget,
            timeline: finalTimeline,
            priority: values.priority,
            status: "pending"
          },
        ])
        .select();

      if (error) throw error;

      toast.success("Cererea de modificare a fost trimisă cu succes", {
        description: "Te vom contacta în curând.",
      });
      
      form.reset();
      setOpen(false);
      
      if (onRequestComplete) {
        onRequestComplete();
      }
    } catch (error) {
      console.error("Error submitting modification request:", error);
      toast.error("Nu s-a putut trimite cererea", {
        description: "Te rugăm să încerci din nou mai târziu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const budgetDependentField = form.watch("budget");
  const timelineDependentField = form.watch("timeline");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicită modificări la proiect</DialogTitle>
          <DialogDescription>
            Completează formularul pentru a solicita modificări la proiect
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="request">Cerere de modificare</TabsTrigger>
            <TabsTrigger value="info">Informații</TabsTrigger>
          </TabsList>
          
          <TabsContent value="request">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descriere modificări</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrie modificările dorite în detaliu..."
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Detaliază cât mai clar modificările pe care dorești să le facem.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioritate</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează prioritatea" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Scăzută</SelectItem>
                          <SelectItem value="normal">Normală</SelectItem>
                          <SelectItem value="high">Ridicată</SelectItem>
                          <SelectItem value="urgent">Urgentă</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Cât de urgentă este această modificare pentru tine?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buget estimat</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează bugetul" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="50-100">50-100 €</SelectItem>
                          <SelectItem value="100-300">100-300 €</SelectItem>
                          <SelectItem value="300-500">300-500 €</SelectItem>
                          <SelectItem value="500-1000">500-1000 €</SelectItem>
                          <SelectItem value="1000+">Peste 1000 €</SelectItem>
                          <SelectItem value="custom">Buget personalizat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {budgetDependentField === "custom" && (
                  <FormField
                    control={form.control}
                    name="customBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buget personalizat</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Specifică bugetul tău"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termen de implementare</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează termenul" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-3-days">1-3 zile</SelectItem>
                          <SelectItem value="1-week">O săptămână</SelectItem>
                          <SelectItem value="2-weeks">2 săptămâni</SelectItem>
                          <SelectItem value="month">O lună</SelectItem>
                          <SelectItem value="custom">Termen personalizat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {timelineDependentField === "custom" && (
                  <FormField
                    control={form.control}
                    name="customTimeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Termen personalizat</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Specifică termenul tău"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Anulează
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Se trimite...
                      </>
                    ) : (
                      "Trimite cererea"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="info" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Despre modificările de proiect</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Modificările de proiect sunt schimbări sau adăugiri la proiectul tău
                  deja existent.
                </p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium">Cum funcționează procesul?</h4>
                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1 mt-2">
                  <li>Trimiți cererea de modificare cu detaliile necesare</li>
                  <li>Echipa noastră o analizează și estimează timpul și costurile</li>
                  <li>Primești o ofertă detaliată pentru modificările solicitate</li>
                  <li>După aprobare, începem lucrul la implementarea modificărilor</li>
                </ol>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium">Tipuri de modificări</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-2">
                  <li>Modificări de design și aspect</li>
                  <li>Adăugarea de funcționalități noi</li>
                  <li>Actualizarea conținutului existent</li>
                  <li>Optimizări de performanță</li>
                  <li>Integrări cu alte sisteme sau servicii</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab("request")}
                className="mr-2"
              >
                Înapoi la formular
              </Button>
              <Button onClick={() => setOpen(false)}>
                Închide
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ModificationRequestDialog;
