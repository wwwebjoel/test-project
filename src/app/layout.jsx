
"use client"
import "../app/globals.css";


export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`m-0 p-0 box-border`}>{children}</body>
    </html>
  );
}
