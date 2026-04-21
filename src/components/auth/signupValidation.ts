
// All form field validation and country list constants

export const countryList = [
  { name: "United States", code: "US", dial: "+1" },
  { name: "India", code: "IN", dial: "+91" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Mexico", code: "MX", dial: "+52" },
  { name: "Brazil", code: "BR", dial: "+55" },
  { name: "Japan", code: "JP", dial: "+81" },
  // ...add more as needed
];

export const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);
export const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

