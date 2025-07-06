// app/layout.js or app/layout.tsx
// import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Anonify",
  description: "Anonymous Social Networking App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
