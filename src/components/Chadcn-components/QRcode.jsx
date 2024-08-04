import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ArrowDownToLine } from "lucide-react";
import { useQRCode } from "next-qrcode";

export default function QrCode({ value, value2, name }) {
  const { Image } = useQRCode();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const svgRef = useRef(null);
  const url = `https://rh-menu.vercel.app/${value}/${value2}`;

  const downloadQRCode = () => {
    setDownloading(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Obtener la imagen y convertirla a un objeto Image
    const img = svgRef?.current?.children[0];
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Descargar la imagen como JPEG
    const jpegUrl = canvas.toDataURL("image/jpeg");
    const downloadLink = document.createElement("a");
    downloadLink.href = jpegUrl;
    downloadLink.download = `${name}.jpg`;
    downloadLink.addEventListener("click", () => {
      setDownloading(false);
    });
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <div ref={svgRef} className="flex flex-col justify-center">
      <Image
        text={url}
        options={{
          type: "image/jpeg",
          quality: 0.3,
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: 200,
          color: {
            dark: "010101",
            light: "#FFFFFF",
          },
        }}
      />

      {!downloading ? (
        <Button onClick={downloadQRCode}>
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Descargar QR
        </Button>
      ) : (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Descargando
        </Button>
      )}
    </div>
  );
}
