
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { calculateProjectPrice } from "@/lib/utils";
import { motion } from "framer-motion";

const PricingCalculator = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(1500);
  const [pageCount, setPageCount] = useState(5);
  const [designComplexity, setDesignComplexity] = useState("standard");
  const [hasCMS, setHasCMS] = useState(false);
  const [hasEcommerce, setHasEcommerce] = useState(false);
  const [hasSEO, setHasSEO] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  
  useEffect(() => {
    const total = calculateProjectPrice(
      pageCount,
      designComplexity,
      hasCMS,
      hasEcommerce,
      hasSEO,
      maintenance
    );
    setTotalPrice(total);
  }, [pageCount, designComplexity, hasCMS, hasEcommerce, hasSEO, maintenance]);
  
  const handleRequestOffer = () => {
    // Store calculator state in sessionStorage
    const calculatorState = {
      pageCount,
      designComplexity,
      hasCMS,
      hasEcommerce,
      hasSEO,
      maintenance,
      totalPrice
    };
    
    sessionStorage.setItem('calculatorState', JSON.stringify(calculatorState));
    
    // Navigate to request form
    navigate('/request-project');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-2 border-brand-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-brand-50 to-brand-100 pb-8">
          <CardTitle className="text-2xl">Calculator de preț aproximativ</CardTitle>
          <CardDescription className="text-gray-700">
            Estimează costul proiectului tău web. Prețul final poate varia în funcție de cerințele specifice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between">
              <Label htmlFor="pageCount" className="text-base">Număr de pagini</Label>
              <span className="font-medium text-brand-600">{pageCount}</span>
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
          </motion.div>
          
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Label className="text-base">Complexitate design</Label>
            <RadioGroup
              value={designComplexity}
              onValueChange={setDesignComplexity}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="simple" id="simple" />
                <Label htmlFor="simple" className="flex-1 cursor-pointer">Simplu (+0 RON)</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1 cursor-pointer">Standard (+500 RON)</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="flex-1 cursor-pointer">Premium (+1.200 RON)</Label>
              </div>
            </RadioGroup>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Label className="text-base">Funcționalități</Label>
            
            <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="cms" className="text-base">Sistem de administrare conținut (CMS)</Label>
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
            
            <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="ecommerce" className="text-base">Magazin online (eCommerce)</Label>
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
            
            <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="seo" className="text-base">Optimizare SEO</Label>
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
            
            <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance" className="text-base">Mentenanță lunară</Label>
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
          </motion.div>
          
          <Separator className="my-4" />
          
          <motion.div 
            className="flex justify-between items-center bg-brand-50 p-4 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            <div>
              <h3 className="text-lg font-medium">Preț estimat total</h3>
              <p className="text-sm text-gray-600">Prețurile includ TVA</p>
            </div>
            <div className="text-3xl font-bold text-brand-600">
              {totalPrice.toLocaleString()} RON
              {maintenance && (
                <span className="block text-sm font-normal text-gray-500 text-right">
                  + 200 RON/lună
                </span>
              )}
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="bg-gray-50 py-6">
          <Button 
            onClick={handleRequestOffer}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            Solicită ofertă personalizată
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PricingCalculator;
