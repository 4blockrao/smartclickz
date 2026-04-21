
import React from "react";
import { Input } from "@/components/ui/input";
import { Flag } from "lucide-react";
import { countryList } from "./signupValidation";

interface CountryPhoneFieldsProps {
  country: string;
  phone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  phoneError: string;
  onPhoneBlur: () => void;
}

export const CountryPhoneFields: React.FC<CountryPhoneFieldsProps> = ({
  country,
  phone,
  onChange,
  phoneError,
  onPhoneBlur,
}) => {
  const selectedCountry = countryList.find((c) => c.name === country) || countryList[0];
  return (
    <div className="flex gap-3 mb-1">
      <div className="relative w-2/5 flex items-center">
        <Flag className="absolute left-4 text-gray-400" size={18} />
        <select
          name="country"
          value={country}
          onChange={onChange}
          className="appearance-none w-full py-3 pl-10 pr-8 rounded-lg border border-input bg-gray-100 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-base text-gray-900 transition"
          aria-label="Country"
          style={{ minHeight: 46 }}
        >
          {countryList.map((c) => (
            <option value={c.name} key={c.code}>
              {c.name} ({c.dial})
            </option>
          ))}
        </select>
        <span className="absolute right-2 text-gray-400">&#9662;</span>
      </div>
      <div className="relative w-3/5 flex flex-col">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-700 text-base font-semibold">{selectedCountry.dial}</span>
          <Input
            style={{ paddingLeft: 38 }}
            className={`py-3 text-base bg-gray-100 rounded-lg focus:bg-white transition ${phoneError ? "border-red-400" : ""}`}
            name="phone"
            placeholder="Phone (10 digits)"
            value={phone}
            onChange={onChange}
            onBlur={onPhoneBlur}
            aria-label="Phone Number"
            autoComplete="tel"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </div>
        {phoneError && (
          <span className="ml-2 text-xs text-red-500 mt-1">{phoneError}</span>
        )}
      </div>
    </div>
  );
};
