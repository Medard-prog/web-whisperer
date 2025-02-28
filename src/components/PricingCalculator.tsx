
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PricingCalculator = () => {
  const [pageCount, setPageCount] = useState(5);
  const [designComplexity, setDesignComplexity] = useState("standard");
  const [totalPrice, setTotalPrice] = useState(0);

  const basePrice = 500; // base price in RON
  
  const designPrices = {
    simplu: 1.0, // multiplier
    standard: 1.5,
    premium: 2.5
  };

  useEffect(() => {
    // Calculate price based on page count and design complexity
    const designMultiplier = designPrices[designComplexity as keyof typeof designPrices];
    const pagePrice = pageCount * 100;
    const calculatedPrice = (basePrice + pagePrice) * designMultiplier;
    setTotalPrice(Math.round(calculatedPrice));
  }, [pageCount, designComplexity]);

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-800 max-w-3xl mx-auto">
      <CardHeader className="bg-purple-50 dark:bg-purple-900/20 rounded-t-lg">
        <CardTitle className="text-2xl text-purple-700 dark:text-purple-300">Calculator de preț</CardTitle>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Estimează costul proiectului tău web în câteva secunde
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <Label htmlFor="pageCount">Număr de pagini</Label>
            <span className="text-purple-600 font-medium">{pageCount}</span>
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
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Mai puține</span>
            <span>Mai multe</span>
          </div>
        </div>

        <div className="mb-8">
          <Label className="mb-3 block">Complexitate design</Label>
          <RadioGroup value={designComplexity} onValueChange={setDesignComplexity}>
            <div className="flex items-center space-x-2 mb-3 border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
              <RadioGroupItem value="simplu" id="simplu" />
              <Label htmlFor="simplu" className="font-medium">
                Simplu
                <p className="font-normal text-sm text-gray-500 dark:text-gray-400">
                  Design basic, funcțional (~500 RON)
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 mb-3 border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="font-medium">
                Standard
                <p className="font-normal text-sm text-gray-500 dark:text-gray-400">
                  Design modern cu elemente interactive (~1000 RON)
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
              <RadioGroupItem value="premium" id="premium" />
              <Label htmlFor="premium" className="font-medium">
                Premium
                <p className="font-normal text-sm text-gray-500 dark:text-gray-400">
                  Design personalizat, animații complexe (~2000 RON)
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Cost total estimat:</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalPrice} RON</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 mt-4 sm:mt-0">
            Solicită ofertă personalizată
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
