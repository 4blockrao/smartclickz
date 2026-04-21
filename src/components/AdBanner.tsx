
import { useAds } from "@/hooks/useAds";

export default function AdBanner() {
  const { data: ads, isLoading } = useAds();

  if (isLoading) return <div className="bg-muted h-20 w-full animate-pulse mb-4" />;
  if (!ads || ads.length === 0) return null;

  // For simplicity, just show the first ad
  const ad = ads[0];

  return (
    <a
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-yellow-100 border border-yellow-300 rounded p-3 shadow-sm mb-4 text-center hover:bg-yellow-200 transition"
    >
      {ad.image_url ? (
        <img src={ad.image_url} alt={ad.title} className="w-auto h-14 mx-auto object-contain mb-1" />
      ) : (
        <span className="font-bold text-yellow-700">{ad.title}</span>
      )}
      {ad.content && (
        <div className="text-yellow-800 text-xs">{ad.content}</div>
      )}
      <span className="block text-yellow-900 text-sm mt-1">Sponsored</span>
    </a>
  );
}
