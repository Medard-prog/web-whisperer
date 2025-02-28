
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const PricingCalculator = () => {
  const navigate = useNavigate();
  const [pageCount, setPageCount] = useState(5);
  const [designComplexity, setDesignComplexity] = useState('standard');
  const [features, setFeatures] = useState({
    cms: false,
    ecommerce: false,
    seo: false,
    maintenance: false,
  });
  
  const basePrice = 1000;
  const pagePrice = 200;
  const premiumDesignMultiplier = 1.5;
  const customDesignMultiplier = 2;
  
  const featurePrices = {
    cms: 500,
    ecommerce: 1000,
    seo: 400,
    maintenance: 300,
  };
  
  const calculateTotal = () => {
    let total = basePrice + pageCount * pagePrice;
    
    // Apply design complexity multiplier
    if (designComplexity === 'premium') {
      total *= premiumDesignMultiplier;
    } else if (designComplexity === 'custom') {
      total *= customDesignMultiplier;
    }
    
    // Add features
    Object.entries(features).forEach(([key, enabled]) => {
      if (enabled) {
        total += featurePrices[key as keyof typeof featurePrices];
      }
    });
    
    return total;
  };
  
  const handleRequestClick = () => {
    // Build query parameters for the request form
    const params = new URLSearchParams({
      pageCount: String(pageCount),
      designComplexity: designComplexity,
      hasCms: String(features.cms),
      hasEcommerce: String(features.ecommerce),
      hasSeo: String(features.seo),
      hasMaintenance: String(features.maintenance),
      price: String(calculateTotal())
    });
    
    // Navigate to request page with parameters
    navigate(`/request?${params.toString()}`);
  };
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('ro-RO') + ' €';
  };
  
  const total = calculateTotal();
  
  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Calculator de preț</CardTitle>
        <CardDescription>Calculează prețul estimativ pentru proiectul tău</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="pages">Număr de pagini: {pageCount}</Label>
            <span className="text-sm text-gray-500">{formatPrice(pageCount * pagePrice)}</span>
          </div>
          <Slider
            id="pages"
            min={1}
            max={20}
            step={1}
            value={[pageCount]}
            onValueChange={(value) => setPageCount(value[0])}
            className="cursor-pointer"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="design">Complexitate design</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={designComplexity === 'standard' ? 'default' : 'outline'} 
              onClick={() => setDesignComplexity('standard')}
              className="text-sm"
            >
              Standard
            </Button>
            <Button
              type="button"
              variant={designComplexity === 'premium' ? 'default' : 'outline'}
              onClick={() => setDesignComplexity('premium')}
              className="text-sm"
            >
              Premium
            </Button>
            <Button
              type="button"
              variant={designComplexity === 'custom' ? 'default' : 'outline'}
              onClick={() => setDesignComplexity('custom')}
              className="text-sm"
            >
              Custom
            </Button>
          </div>
        </div>
        
        <div className="space-y-4 pt-2">
          <Label>Funcționalități adiționale</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cms" className="text-base">Sistem de administrare (CMS)</Label>
                <CardDescription>Gestionează conținutul site-ului</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{formatPrice(featurePrices.cms)}</span>
                <Switch
                  id="cms"
                  checked={features.cms}
                  onCheckedChange={(checked) => setFeatures(prev => ({ ...prev, cms: checked }))}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ecommerce" className="text-base">Funcționalități E-commerce</Label>
                <CardDescription>Vinzi produse online</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{formatPrice(featurePrices.ecommerce)}</span>
                <Switch
                  id="ecommerce"
                  checked={features.ecommerce}
                  onCheckedChange={(checked) => setFeatures(prev => ({ ...prev, ecommerce: checked }))}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="seo" className="text-base">Optimizare SEO</Label>
                <CardDescription>Apari mai sus în rezultatele Google</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{formatPrice(featurePrices.seo)}</span>
                <Switch
                  id="seo"
                  checked={features.seo}
                  onCheckedChange={(checked) => setFeatures(prev => ({ ...prev, seo: checked }))}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance" className="text-base">Mentenanță</Label>
                <CardDescription>Suport tehnic și actualizări</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{formatPrice(featurePrices.maintenance)}</span>
                <Switch
                  id="maintenance"
                  checked={features.maintenance}
                  onCheckedChange={(checked) => setFeatures(prev => ({ ...prev, maintenance: checked }))}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full flex justify-between items-center py-4 border-t">
          <div>
            <span className="font-medium text-lg">Preț total estimat</span>
            <p className="text-sm text-gray-500">Prețul final poate varia în funcție de cerințele exacte</p>
          </div>
          <div className="text-2xl font-bold">{formatPrice(total)}</div>
        </div>
        
        <div className="w-full flex justify-end">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button 
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={handleRequestClick}
            >
              Solicită ofertă personalizată
            </Button>
          </motion.div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PricingCalculator;
