
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const PricingCalculator = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(1500);
  const [pageCount, setPageCount] = useState(5);
  const [designComplexity, setDesignComplexity] = useState("standard");
  const [hasCMS, setHasCMS] = useState(false);
  const [hasEcommerce, setHasEcommerce] = useState(false);
  const [hasSEO, setHasSEO] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  
  const designPrices = {
    simple: 0,
    standard: 500,
    premium: 1200,
  };
  
  useEffect(() => {
    const pagePricing = 150 * pageCount;
    const designPricing = designPrices[designComplexity as keyof typeof designPrices];
    const cmsPricing = hasCMS ? 800 : 0;
    const ecommercePricing = hasEcommerce ? 1500 : 0;
    const seoPricing = hasSEO ? 600 : 0;
    const maintenancePricing = maintenance ? 200 : 0;
    
    const total = basePrice + pagePricing + designPricing + cmsPricing + ecommercePricing + seoPricing + maintenancePricing;
    setTotalPrice(total);
  }, [pageCount, designComplexity, hasCMS, hasEcommerce, hasSEO, maintenance, basePrice]);
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Calculator de preț aproximativ</CardTitle>
        <CardDescription>
          Estimează costul proiectului tău web. Prețul final poate varia în funcție de cerințele specifice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="pageCount">Număr de pagini</Label>
            <span className="font-medium">{pageCount}</span>
          </div>
          <Slider
            id="pageCount"
            min={1}
            max={20}
            step={1}
            value={[pageCount]}
            onValueChange={(value) => setPageCount(value[0])}
            className="py-4"
          />
        </div>
        
        <div className="space-y-3">
          <Label>Complexitate design</Label>
          <RadioGroup
            value={designComplexity}
            onValueChange={setDesignComplexity}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="simple" id="simple" />
              <Label htmlFor="simple" className="flex-1">Simplu (+0 RON)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="flex-1">Standard (+500 RON)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="premium" id="premium" />
              <Label htmlFor="premium" className="flex-1">Premium (+1.200 RON)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <Label>Funcționalități</Label>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cms">Sistem de administrare conținut (CMS)</Label>
              <p className="text-sm text-gray-500">
                Adaugă și editează conținutul site-ului fără cunoștințe tehnice
              </p>
            </div>
            <Switch
              id="cms"
              checked={hasCMS}
              onCheckedChange={setHasCMS}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ecommerce">Magazin online (eCommerce)</Label>
              <p className="text-sm text-gray-500">
                Vinde produse online, gestionează stocuri și comenzi
              </p>
            </div>
            <Switch
              id="ecommerce"
              checked={hasEcommerce}
              onCheckedChange={setHasEcommerce}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="seo">Optimizare SEO</Label>
              <p className="text-sm text-gray-500">
                Optimizare pentru motoarele de căutare și strategie de cuvinte cheie
              </p>
            </div>
            <Switch
              id="seo"
              checked={hasSEO}
              onCheckedChange={setHasSEO}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance">Mentenanță lunară</Label>
              <p className="text-sm text-gray-500">
                Actualizări, backup-uri și suport tehnic lunar
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={maintenance}
              onCheckedChange={setMaintenance}
            />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Preț estimat total</h3>
            <p className="text-sm text-gray-500">Prețurile includ TVA</p>
          </div>
          <div className="text-3xl font-bold text-brand-600">
            {totalPrice.toLocaleString()} RON
            {maintenance && (
              <span className="block text-sm font-normal text-gray-500 text-right">
                + 200 RON/lună
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg">
          Solicită ofertă personalizată
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCalculator;
