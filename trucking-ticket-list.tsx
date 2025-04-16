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

interface TruckingTicket {
  id: string;
  ticketNumber: string;
  ticketDate: string;
  ticketType: 'MATERIAL' | 'HOURLY';
  quantity?: number;
  hours?: number;
  rate: number;
  totalAmount: number;
  status: 'LOGGED' | 'INVOICED' | 'DISPUTED' | 'VOID';
  project: {
    id: string;
    name: string;
  };
  material?: {
    id: string;
    name: string;
    unitOfMeasure: string;
  };
  contractor: {
    id: string;
    name: string;
  };
  invoice?: {
    id: string;
    invoiceNumber: string;
  };
}

interface Project {
  id: string;
  name: string;
}

interface TruckingTicketListProps {
  tickets: TruckingTicket[];
  projects: Project[];
  onFilterChange: (filters: any) => void;
  onTicketSelect: (ticket: TruckingTicket) => void;
}

export function TruckingTicketList({
  tickets,
  projects,
  onFilterChange,
  onTicketSelect,
}: TruckingTicketListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedProjectId, setSelectedProjectId] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [selectedTicketType, setSelectedTicketType] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTickets, setSelectedTickets] = React.useState<string[]>([]);

  // Handle filter changes
  const handleFilterChange = () => {
    onFilterChange({
      projectId: selectedProjectId || undefined,
      status: selectedStatus || undefined,
      ticketType: selectedTicketType || undefined,
      search: searchQuery || undefined,
    });
  };

  // Handle ticket selection
  const handleTicketSelect = (ticketId: string) => {
    setSelectedTickets((prev) => {
      if (prev.includes(ticketId)) {
        return prev.filter((id) => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  // Handle create invoice from selected tickets
  const handleCreateInvoice = () => {
    const selectedTicketObjects = tickets.filter((ticket) => 
      selectedTickets.includes(ticket.id) && ticket.status === 'LOGGED'
    );
    
    if (selectedTicketObjects.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one uninvoiced ticket',
        variant: 'destructive',
      });
      return;
    }
    
    router.push(`/invoices/create?tickets=${selectedTickets.join(',')}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LOGGED':
        return <Badge variant="outline">Logged</Badge>;
      case 'INVOICED':
        return <Badge variant="success">Invoiced</Badge>;
      case 'DISPUTED':
        return <Badge variant="destructive">Disputed</Badge>;
      case 'VOID':
        return <Badge variant="secondary">Void</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Trucking Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by ticket number..."
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
                <option value="LOGGED">Logged</option>
                <option value="INVOICED">Invoiced</option>
                <option value="DISPUTED">Disputed</option>
                <option value="VOID">Void</option>
              </Select>
            </div>
            <div>
              <Select
                value={selectedTicketType}
                onChange={(e) => setSelectedTicketType(e.target.value)}
                className="w-full"
              >
                <option value="">All Types</option>
                <option value="MATERIAL">Material</option>
                <option value="HOURLY">Hourly</option>
              </Select>
            </div>
            <Button onClick={handleFilterChange}>Filter</Button>
          </div>
          
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={handleCreateInvoice}
              disabled={selectedTickets.length === 0}
            >
              Create Invoice from Selected
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" />
                  </TableHead>
                  <TableHead>Ticket #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantity/Hours</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">
                      No trucking tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedTickets.includes(ticket.id)}
                          onChange={() => handleTicketSelect(ticket.id)}
                          disabled={ticket.status !== 'LOGGED'}
                        />
                      </TableCell>
                      <TableCell>{ticket.ticketNumber}</TableCell>
                      <TableCell>{formatDate(ticket.ticketDate)}</TableCell>
                      <TableCell>{ticket.project.name}</TableCell>
                      <TableCell>{ticket.contractor.name}</TableCell>
                      <TableCell>{ticket.ticketType === 'MATERIAL' ? 'Material' : 'Hourly'}</TableCell>
                      <TableCell>{ticket.material?.name || '-'}</TableCell>
                      <TableCell>
                        {ticket.ticketType === 'MATERIAL'
                          ? `${ticket.quantity} ${ticket.material?.unitOfMeasure || ''}`
                          : `${ticket.hours} hrs`}
                      </TableCell>
                      <TableCell>${ticket.rate.toFixed(2)}</TableCell>
                      <TableCell>${ticket.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{ticket.invoice?.invoiceNumber || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTicketSelect(ticket)}
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
