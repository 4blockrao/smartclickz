import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// Using a simple country list for now
const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "JP", name: "Japan", flag: "🇯🇵" }
];

interface SignupFormFieldsProps {
  form: UseFormReturn<any>;
  currentStep: number;
}

const SignupFormFields: React.FC<SignupFormFieldsProps> = ({ form, currentStep }) => {
  const { register, setValue, watch, formState: { errors } } = form;

  if (currentStep === 1) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address"
              }
            })}
            type="email"
            placeholder="your@email.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{String(errors.email.message)}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            })}
            type="password"
            placeholder="Create a strong password"
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => {
                if (value !== watch("password")) {
                  return "Passwords do not match";
                }
              }
            })}
            type="password"
            placeholder="Confirm your password"
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{String(errors.confirmPassword.message)}</p>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              {...register("firstName", { required: "First name is required" })}
              placeholder="John"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{String(errors.firstName.message)}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              {...register("lastName", { required: "Last name is required" })}
              placeholder="Doe"
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{String(errors.lastName.message)}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            {...register("dateOfBirth", { 
              required: "Date of birth is required",
              validate: (value) => {
                const age = new Date().getFullYear() - new Date(value).getFullYear();
                if (age < 18) return "You must be at least 18 years old";
              }
            })}
            type="date"
            className={errors.dateOfBirth ? "border-red-500" : ""}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-500 mt-1">{String(errors.dateOfBirth.message)}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            {...register("phone", { required: "Phone number is required" })}
            type="tel"
            placeholder="+1234567890"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{String(errors.phone.message)}</p>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Select onValueChange={(value) => setValue("country", value)}>
            <SelectTrigger className={errors.country ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.slice(0, 20).map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.flag} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">{String(errors.country.message)}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            {...register("city", { required: "City is required" })}
            placeholder="Your city"
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{String(errors.city.message)}</p>
          )}
        </div>

        <div>
          <Label htmlFor="interests">Interests (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              "Technology", "Gaming", "Fashion", "Travel", "Food",
              "Fitness", "Music", "Movies", "Sports", "Business"
            ].map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={(checked) => {
                    const currentInterests = watch("interests") || [];
                    if (checked) {
                      setValue("interests", [...currentInterests, interest]);
                    } else {
                      setValue("interests", currentInterests.filter((i: string) => i !== interest));
                    }
                  }}
                />
                <span className="text-sm">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="referralCode">Referral Code (Optional)</Label>
          <Input
            {...register("referralCode")}
            placeholder="Enter referral code if you have one"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default SignupFormFields;