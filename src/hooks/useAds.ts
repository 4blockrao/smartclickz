
import { useQuery } from "@tanstack/react-query";

type Ad = {
  id: string;
  target_url: string;
  image_url?: string;
  title: string;
  content?: string;
};

const sampleAds: Ad[] = [
  {
    id: "1",
    target_url: "https://example.com",
    image_url: "https://placehold.co/250x60?text=Ad+Banner",
    title: "Try Acme Pro Tools!",
    content: "Unlock 20% off your first order.",
  },
  {
    id: "2",
    target_url: "https://example.org",
    image_url: "",
    title: "Sign up for VIP membership",
    content: "Get exclusive perks and premium content.",
  },
];

export const useAds = () => {
  // Provide static example data, mimicking DB fetch
  return useQuery({
    queryKey: ["ads"],
    queryFn: async () => sampleAds,
    staleTime: Infinity,
  });
};
