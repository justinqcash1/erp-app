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
      <body>{children}</body>
    </html>
  )
}
