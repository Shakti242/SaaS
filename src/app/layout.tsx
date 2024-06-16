import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import ThemeProvider  from '@/providers/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
// import ModalProvider from '@/providers/modal-provider'
// import { Toaster } from '@/components/ui/sonner'
// import { BillingProvider } from '@/providers/billing-provider'

const font = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fuzzie.',
  description: 'Automate Your Work With Fuzzie.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      publishableKey={"pk_test_aW52aXRpbmctbGFjZXdpbmctOC5jbGVyay5hY2NvdW50cy5kZXYk"}
    >
      <html lang="en">
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange children={undefined}          >
            {/* <BillingProvider>
              <ModalProvider>
                {children}
                <Toaster />
              </ModalProvider>
            </BillingProvider> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}