
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Building } from "lucide-react";
import { useState, useEffect } from "react";

// Country codes for phone numbers
const countryCodes = [
  { country: "România", code: "+40", flag: "🇷🇴" },
  { country: "Statele Unite", code: "+1", flag: "🇺🇸" },
  { country: "Marea Britanie", code: "+44", flag: "🇬🇧" },
  { country: "Germania", code: "+49", flag: "🇩🇪" },
  { country: "Franța", code: "+33", flag: "🇫🇷" },
  { country: "Italia", code: "+39", flag: "🇮🇹" },
  { country: "Spania", code: "+34", flag: "🇪🇸" },
  { country: "Moldova", code: "+373", flag: "🇲🇩" },
  { country: "Ucraina", code: "+380", flag: "🇺🇦" },
  { country: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { country: "Ungaria", code: "+36", flag: "🇭🇺" },
  { country: "Austria", code: "+43", flag: "🇦🇹" },
  { country: "Belgia", code: "+32", flag: "🇧🇪" },
  { country: "Cehia", code: "+420", flag: "🇨🇿" },
  { country: "Croația", code: "+385", flag: "🇭🇷" },
  { country: "Danemarca", code: "+45", flag: "🇩🇰" },
  { country: "Elveția", code: "+41", flag: "🇨🇭" },
  { country: "Finlanda", code: "+358", flag: "🇫🇮" },
  { country: "Grecia", code: "+30", flag: "🇬🇷" },
  { country: "Irlanda", code: "+353", flag: "🇮🇪" },
  { country: "Norvegia", code: "+47", flag: "🇳🇴" },
  { country: "Olanda", code: "+31", flag: "🇳🇱" },
  { country: "Polonia", code: "+48", flag: "🇵🇱" },
  { country: "Portugalia", code: "+351", flag: "🇵🇹" },
  { country: "Slovacia", code: "+421", flag: "🇸🇰" },
  { country: "Slovenia", code: "+386", flag: "🇸🇮" },
  { country: "Suedia", code: "+46", flag: "🇸🇪" },
].sort((a, b) => a.country.localeCompare(b.country));

const StepOne = () => {
  const { control, setValue, watch } = useFormContext();
  const [selectedCountryCode, setSelectedCountryCode] = useState("+40"); // Default to Romania
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneValue = watch("phone") || "";
  
  // Initialize phone data on component mount or when phoneValue changes from external source
  useEffect(() => {
    if (phoneValue && phoneValue !== selectedCountryCode + phoneNumber) {
      // Check if phone starts with any country code
      const matchedCountry = countryCodes.find(country => 
        phoneValue.startsWith(country.code)
      );
      
      if (matchedCountry) {
        setSelectedCountryCode(matchedCountry.code);
        setPhoneNumber(phoneValue.substring(matchedCountry.code.length));
      } else {
        // If no country code is found, assume it's just the number
        setPhoneNumber(phoneValue);
      }
    }
  }, []);

  // Handle country code change
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    // Update the full phone number with new country code + existing number
    setValue("phone", code + phoneNumber);
  };

  // Handle phone input changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberOnly = e.target.value.replace(/\D/g, '');
    setPhoneNumber(numberOnly);
    setValue("phone", selectedCountryCode + numberOnly);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informații Personale</h3>
      <p className="text-sm text-gray-500 mb-6">
        Te rugăm să ne oferi datele tale de contact pentru a putea discuta despre proiect.
      </p>
      
      <div className="space-y-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nume Complet</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Numele tău complet" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input type="email" placeholder="adresa@example.com" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="phone"
          render={() => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <div className="flex gap-2">
                <div className="w-32">
                  <Select 
                    value={selectedCountryCode}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={selectedCountryCode}>
                        <div className="flex items-center gap-1">
                          {countryCodes.find(c => c.code === selectedCountryCode)?.flag} {selectedCountryCode}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                            <span className="text-xs text-gray-500">({country.country})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormControl>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Numărul de telefon (fără prefixul țării)" 
                      className="pl-10" 
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companie <span className="text-gray-500 text-sm">(opțional)</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Numele companiei" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepOne;
