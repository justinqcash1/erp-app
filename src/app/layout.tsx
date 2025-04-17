import './globals.css';
import Navbar from './components/navbar';

export const metadata = {
  title: 'ERP Application',
  description: 'Trucking ticket management and invoice verification system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
