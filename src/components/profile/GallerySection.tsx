
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

interface GallerySectionProps {
  gallery: GalleryImage[];
  loadingGallery: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, loadingGallery }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingGallery ? (
          <div>Loading images…</div>
        ) : gallery.length === 0 ? (
          <div className="text-muted-foreground text-sm">No images uploaded.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {gallery.map(img => (
              <div key={img.id} className="w-full group">
                <AspectRatio ratio={1} className="bg-muted rounded-lg overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.caption || "Gallery image"}
                    className="object-cover rounded-lg w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </AspectRatio>
                {img.caption && (
                  <div className="mt-1 text-xs text-muted-foreground text-center">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
