import type { Metadata } from 'next'
import './globals.css'
import { Suspense } from "react";


export const metadata: Metadata = {
  title: 'Alaa - AI Assistant',
  description: 'AI-powered assistant with document upload',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <Suspense>{children}</Suspense>
        </main>
      </body>
    </html>
  )
}

