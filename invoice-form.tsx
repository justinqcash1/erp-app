import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

// Form validation schema
const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.date(),
  dueDate: z.date(),
  projectId: z.string().min(1, 'Project is required'),
  costPhaseId: z.string().min(1, 'Cost phase is required'),
  totalAmount: z.number().min(0.01, 'Total amount must be greater than 0'),
  notes: z.string().optional(),
  ticketIds: z.array(z.string()).optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface Project {
  id: string;
  name: string;
}

interface CostPhase {
  id: string;
  name: string;
  code: string;
}

interface TruckingTicket {
  id: string;
  ticketNumber: string;
  ticketDate: string;
  totalAmount: number;
  contractor: {
    name: string;
  };
  material?: {
    name: string;
  };
}

interface InvoiceFormProps {
  projects: Project[];
  costPhases: CostPhase[];
  selectedTickets: TruckingTicket[];
  onSubmit: (data: InvoiceFormValues) => void;
  onProjectChange: (projectId: string) => void;
}

export function InvoiceForm({
  projects,
  costPhases,
  selectedTickets,
  onSubmit,
  onProjectChange,
}: InvoiceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      totalAmount: selectedTickets.reduce((sum, ticket) => sum + ticket.totalAmount, 0),
      ticketIds: selectedTickets.map(ticket => ticket.id),
    },
  });

  const selectedProjectId = watch('projectId');

  // Update cost phases when project changes
  React.useEffect(() => {
    if (selectedProjectId) {
      onProjectChange(selectedProjectId);
    }
  }, [selectedProjectId, onProjectChange]);

  // Update total amount when selected tickets change
  React.useEffect(() => {
    const totalAmount = selectedTickets.reduce((sum, ticket) => sum + ticket.totalAmount, 0);
    setValue('totalAmount', totalAmount);
    setValue('ticketIds', selectedTickets.map(ticket => ticket.id));
  }, [selectedTickets, setValue]);

  const handleFormSubmit = async (data: InvoiceFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="invoiceNumber">Invoice Number *</label>
              <Input
                id="invoiceNumber"
                {...register('invoiceNumber')}
                error={errors.invoiceNumber?.message}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="invoiceDate">Invoice Date *</label>
              <DatePicker
                id="invoiceDate"
                selected={watch('invoiceDate')}
                onChange={(date) => setValue('invoiceDate', date as Date)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dueDate">Due Date *</label>
              <DatePicker
                id="dueDate"
                selected={watch('dueDate')}
                onChange={(date) => setValue('dueDate', date as Date)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="projectId">Project *</label>
              <Select
                id="projectId"
                {...register('projectId')}
                error={errors.projectId?.message}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="costPhaseId">Cost Phase *</label>
              <Select
                id="costPhaseId"
                {...register('costPhaseId')}
                error={errors.costPhaseId?.message}
                disabled={!selectedProjectId || costPhases.length === 0}
              >
                <option value="">Select Cost Phase</option>
                {costPhases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.code} - {phase.name}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="totalAmount">Total Amount *</label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                {...register('totalAmount', { valueAsNumber: true })}
                error={errors.totalAmount?.message}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes">Notes</label>
            <Textarea
              id="notes"
              {...register('notes')}
              error={errors.notes?.message}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Selected Trucking Tickets</h3>
            {selectedTickets.length === 0 ? (
              <p className="text-gray-500">No tickets selected</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.ticketNumber}</TableCell>
                        <TableCell>{formatDate(ticket.ticketDate)}</TableCell>
                        <TableCell>{ticket.contractor.name}</TableCell>
                        <TableCell>{ticket.material?.name || '-'}</TableCell>
                        <TableCell>${ticket.totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Total:
                      </TableCell>
                      <TableCell className="font-medium">
                        ${selectedTickets.reduce((sum, ticket) => sum + ticket.totalAmount, 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={isSubmitting || selectedTickets.length === 0}>
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
