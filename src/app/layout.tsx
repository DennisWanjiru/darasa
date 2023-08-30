import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Darasa | Signin",
  description: "Darasa a school management system",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
