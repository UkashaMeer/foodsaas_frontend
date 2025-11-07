import "@/app/globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/providers/Providers";

export default function AdminLayout({ children }) {
  return (
    <div>
      <Toaster />
      <Providers>
        <div className="flex min-h-screen">
          <div className="flex-1 flex flex-col">
              {children}
          </div>
        </div>
      </Providers>
    </div>
  );
}
