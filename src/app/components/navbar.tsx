"use client";

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">ERP System</Link>
        <div className="space-x-4">
          <Link href="/trucking-tickets" className="hover:text-gray-300">Trucking Tickets</Link>
          <Link href="/invoices" className="hover:text-gray-300">Invoices</Link>
          <Link href="/material-purchases" className="hover:text-gray-300">Materials</Link>
          <Link href="/scope-changes" className="hover:text-gray-300">Scope Changes</Link>
        </div>
      </div>
    </nav>
  );
}
