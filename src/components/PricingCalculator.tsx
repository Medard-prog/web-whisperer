
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
import { 
  FileText, 
  ShoppingCart, 
  Search, 
  Settings,
  ArrowRight
} from "lucide-react";

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
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-2 border-brand-100 overflow-hidden rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-brand-50 to-brand-100 pb-8 relative">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 C80,30 70,50 100,70 L100,100 L0,100 Z" fill="currentColor" />
            </svg>
          </motion.div>
          <div className="relative">
            <CardTitle className="text-3xl font-bold mb-2 text-brand-800">Calculator de preț</CardTitle>
            <CardDescription className="text-gray-700 text-lg">
              Estimează costul proiectului tău web în câteva secunde
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-center">
              <Label htmlFor="pageCount" className="text-lg font-medium">Număr de pagini</Label>
              <motion.span 
                className="font-bold text-xl text-brand-600 bg-brand-50 px-3 py-1 rounded-md"
                key={pageCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {pageCount}
              </motion.span>
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
            <div className="flex justify-between text-sm text-gray-500">
              <span>Mai puține</span>
              <span>Mai multe</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Label className="text-lg font-medium">Complexitate design</Label>
            <RadioGroup
              value={designComplexity}
              onValueChange={setDesignComplexity}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50 transition-colors border">
                <RadioGroupItem value="simple" id="simple" />
                <Label htmlFor="simple" className="flex-1 cursor-pointer">
                  <div className="font-medium">Simplu</div>
                  <div className="text-gray-500 text-sm">Design basic, funcțional (+0 RON)</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50 transition-colors border">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1 cursor-pointer">
                  <div className="font-medium">Standard</div>
                  <div className="text-gray-500 text-sm">Design modern cu elemente interactive (+500 RON)</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50 transition-colors border">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="flex-1 cursor-pointer">
                  <div className="font-medium">Premium</div>
                  <div className="text-gray-500 text-sm">Design personalizat, animații complexe (+1.200 RON)</div>
                </Label>
              </div>
            </RadioGroup>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Label className="text-lg font-medium">Funcționalități</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-md hover:bg-gray-50 transition-colors border group">
                <div className="flex items-start space-x-3">
                  <FileText className="h-6 w-6 text-brand-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <Label htmlFor="cms" className="text-base font-medium">Sistem CMS</Label>
                    <p className="text-sm text-gray-500">
                      Editează conținutul fără cunoștințe tehnice
                    </p>
                  </div>
                </div>
                <Switch
                  id="cms"
                  checked={hasCMS}
                  onCheckedChange={setHasCMS}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-md hover:bg-gray-50 transition-colors border group">
                <div className="flex items-start space-x-3">
                  <ShoppingCart className="h-6 w-6 text-brand-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <Label htmlFor="ecommerce" className="text-base font-medium">Magazin online</Label>
                    <p className="text-sm text-gray-500">
                      Vinde produse și gestionează comenzi
                    </p>
                  </div>
                </div>
                <Switch
                  id="ecommerce"
                  checked={hasEcommerce}
                  onCheckedChange={setHasEcommerce}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-md hover:bg-gray-50 transition-colors border group">
                <div className="flex items-start space-x-3">
                  <Search className="h-6 w-6 text-brand-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <Label htmlFor="seo" className="text-base font-medium">Optimizare SEO</Label>
                    <p className="text-sm text-gray-500">
                      Crește vizibilitatea în motoarele de căutare
                    </p>
                  </div>
                </div>
                <Switch
                  id="seo"
                  checked={hasSEO}
                  onCheckedChange={setHasSEO}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-md hover:bg-gray-50 transition-colors border group">
                <div className="flex items-start space-x-3">
                  <Settings className="h-6 w-6 text-brand-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <Label htmlFor="maintenance" className="text-base font-medium">Mentenanță</Label>
                    <p className="text-sm text-gray-500">
                      Suport tehnic și actualizări lunare
                    </p>
                  </div>
                </div>
                <Switch
                  id="maintenance"
                  checked={maintenance}
                  onCheckedChange={setMaintenance}
                />
              </div>
            </div>
          </motion.div>
          
          <Separator className="my-6" />
          
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-brand-50 to-brand-100 p-6 rounded-xl shadow-inner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            <div>
              <h3 className="text-xl font-bold text-gray-800">Preț estimat total</h3>
              <p className="text-gray-600">Prețurile includ TVA</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-4xl font-bold text-brand-800">
                {totalPrice.toLocaleString()} RON
              </div>
              {maintenance && (
                <div className="text-sm text-gray-600">
                  + 200 RON/lună (mentenanță)
                </div>
              )}
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="bg-gray-50 py-6">
          <Button 
            onClick={handleRequestOffer}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 transition-all duration-300 transform hover:scale-105 text-lg py-6"
          >
            Solicită ofertă personalizată
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PricingCalculator;
