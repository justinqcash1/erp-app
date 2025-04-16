import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  status: 'PENDING' | 'VERIFIED' | 'PAID' | 'DISPUTED';
  project: {
    id: string;
    name: string;
  };
  costPhase: {
    id: string;
    name: string;
    code: string;
  };
  tickets: {
    id: string;
    ticketNumber: string;
    totalAmount: number;
  }[];
}

interface Project {
  id: string;
  name: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  projects: Project[];
  onFilterChange: (filters: any) => void;
  onInvoiceSelect: (invoice: Invoice) => void;
}

export function InvoiceList({
  invoices,
  projects,
  onFilterChange,
  onInvoiceSelect,
}: InvoiceListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedProjectId, setSelectedProjectId] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  // Handle filter changes
  const handleFilterChange = () => {
    onFilterChange({
      projectId: selectedProjectId || undefined,
      status: selectedStatus || undefined,
      search: searchQuery || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline">Pending</Badge>;
      case 'VERIFIED':
        return <Badge variant="success">Verified</Badge>;
      case 'PAID':
        return <Badge variant="primary">Paid</Badge>;
      case 'DISPUTED':
        return <Badge variant="destructive">Disputed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full"
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="PAID">Paid</option>
                <option value="DISPUTED">Disputed</option>
              </Select>
            </div>
            <Button onClick={handleFilterChange}>Filter</Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm mb-1">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm mb-1">End Date</label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Cost Phase</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{invoice.project.name}</TableCell>
                      <TableCell>{invoice.costPhase.code} - {invoice.costPhase.name}</TableCell>
                      <TableCell>{invoice.tickets.length}</TableCell>
                      <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onInvoiceSelect(invoice)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
