
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Building } from "lucide-react";
import { useState } from "react";

// Country codes for phone numbers
const countryCodes = [
  { country: "Romania", code: "+40", flag: "🇷🇴" },
  { country: "United States", code: "+1", flag: "🇺🇸" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "France", code: "+33", flag: "🇫🇷" },
  { country: "Italy", code: "+39", flag: "🇮🇹" },
  { country: "Spain", code: "+34", flag: "🇪🇸" },
  { country: "Moldova", code: "+373", flag: "🇲🇩" },
  { country: "Ukraine", code: "+380", flag: "🇺🇦" },
  { country: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { country: "Hungary", code: "+36", flag: "🇭🇺" },
].sort((a, b) => a.country.localeCompare(b.country));

const StepOne = () => {
  const { control, setValue, watch } = useFormContext();
  const [selectedCountryCode, setSelectedCountryCode] = useState("+40"); // Default to Romania
  const phoneValue = watch("phone") || "";

  // Handle country code change
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    
    // Remove any existing country code from the phone number
    let phoneWithoutCode = phoneValue;
    countryCodes.forEach(country => {
      if (phoneValue.startsWith(country.code)) {
        phoneWithoutCode = phoneValue.substring(country.code.length);
      }
    });
    
    // Set the new phone number with the selected country code
    setValue("phone", code + phoneWithoutCode);
  };

  // Handle phone input changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Ensure the country code is always present
    if (!inputValue.startsWith(selectedCountryCode)) {
      inputValue = selectedCountryCode + inputValue.replace(selectedCountryCode, "");
    }
    
    setValue("phone", inputValue);
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <div className="flex gap-2">
                <div className="w-32">
                  <Select 
                    onValueChange={handleCountryChange}
                    defaultValue="+40"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Cod" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
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
                      placeholder="Numărul de telefon" 
                      className="pl-10" 
                      value={phoneValue} 
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
