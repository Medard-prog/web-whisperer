
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, HelpCircle, Mail, Phone } from "lucide-react";

const Support = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <PageTransition>
        <div className="flex-1 p-6 max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-purple-600" />
                Asistență & Suport
              </h1>
              <p className="text-gray-500 mt-1">
                Echipa noastră de suport îți stă la dispoziție pentru orice întrebare
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {/* FAQ and Contact Information Card */}
            <Card className="shadow-md border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="text-lg font-semibold text-indigo-900">
                  Întrebări frecvente & Contact
                </CardTitle>
                <CardDescription>
                  Găsește răspunsuri rapide sau contactează-ne direct
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* FAQs Section */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 mb-3">Întrebări frecvente</h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-white shadow-sm rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <p className="font-medium text-gray-900">Cum pot solicita un proiect nou?</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Accesează pagina "Dashboard" și apasă pe butonul "Solicită Proiect Nou".
                        </p>
                      </div>
                      
                      <div className="p-3 bg-white shadow-sm rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <p className="font-medium text-gray-900">Cum pot modifica un proiect?</p>
                        <p className="text-sm text-gray-600 mt-1">
                          În pagina proiectului găsești butonul "Solicită Modificări".
                        </p>
                      </div>
                      
                      <div className="p-3 bg-white shadow-sm rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <p className="font-medium text-gray-900">Cum funcționează plățile?</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Plățile se fac conform contractului, de obicei 50% avans și 50% la finalizare.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-white shadow-sm rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <p className="font-medium text-gray-900">Cât durează realizarea unui proiect?</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Durata depinde de complexitatea proiectului. La începutul colaborării vei primi un calendar estimativ.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 mb-3">Contactează-ne direct</h3>
                    
                    <div className="p-5 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-12 w-12 bg-purple-100">
                          <AvatarFallback className="bg-purple-600 text-white">
                            MW
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-900">MetWeb</h4>
                          <p className="text-sm text-gray-600">Echipa de suport</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email</p>
                            <a href="mailto:metweb.romania@gmail.com" className="text-sm text-purple-600 hover:text-purple-700">
                              metweb.romania@gmail.com
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Telefon</p>
                            <a href="tel:+40727608260" className="text-sm text-purple-600 hover:text-purple-700">
                              +40 727 608 260
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-5 border-t border-purple-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Program de lucru</h4>
                        <p className="text-sm text-gray-600">Luni - Vineri: 9:00 - 18:00</p>
                        <p className="text-sm text-gray-600">Weekend: Închis</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Răspuns rapid
                          </Badge>
                          <span className="text-xs text-gray-500">De obicei în 24h</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-gray-900">Asistență prioritară</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Pentru situații urgente, te rugăm să ne contactezi telefonic pentru asistență imediată.
                      </p>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600" onClick={() => window.location.href = 'tel:+40727608260'}>
                        Sună acum
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Support;
