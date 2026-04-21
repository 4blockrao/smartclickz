
import React from "react";
import QRCode from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ProfileQRCodeProps {
  profileUrl: string;
  displayName?: string;
  size?: number;
  foreground?: string;
  background?: string;
}

export const ProfileQRCode: React.FC<ProfileQRCodeProps> = ({
  profileUrl,
  displayName,
  size = 144, // default to larger size for readability
  foreground = "#1A1F2C",
  background = "#FFF",
}) => {
  function handleDownload() {
    const canvas = document.getElementById("profile-qr") as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `${displayName || "profile"}-networker-qr.png`;
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <QRCode
        id="profile-qr"
        value={profileUrl}
        size={size}
        fgColor={foreground}
        bgColor={background}
        style={{ borderRadius: 8, boxShadow: "0 1px 8px #ccc" }}
        includeMargin={true}
        level="Q"
      />
      <Button variant="outline" size="sm" onClick={handleDownload} className="mt-1">
        <Download className="w-4 h-4 mr-1" />
        Download QR
      </Button>
    </div>
  );
};
