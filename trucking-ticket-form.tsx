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
import { toast } from '@/components/ui/toast';

// Form validation schema
const ticketFormSchema = z.object({
  ticketNumber: z.string().min(1, 'Ticket number is required'),
  ticketDate: z.date(),
  projectId: z.string().min(1, 'Project is required'),
  contractorId: z.string().min(1, 'Contractor is required'),
  ticketType: z.enum(['MATERIAL', 'HOURLY']),
  materialId: z.string().optional(),
  quantity: z.number().optional(),
  hours: z.number().optional(),
  rate: z.number().min(0.01, 'Rate must be greater than 0'),
  totalAmount: z.number().min(0.01, 'Total amount must be greater than 0'),
  notes: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

interface Project {
  id: string;
  name: string;
}

interface Contractor {
  id: string;
  name: string;
}

interface Material {
  id: string;
  name: string;
}

interface TruckingTicketFormProps {
  projects: Project[];
  contractors: Contractor[];
  materials: Material[];
  onSubmit: (data: TicketFormValues) => void;
}

export function TruckingTicketForm({
  projects,
  contractors,
  materials,
  onSubmit,
}: TruckingTicketFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      ticketDate: new Date(),
      ticketType: 'MATERIAL',
      rate: 0,
      totalAmount: 0,
    },
  });

  const ticketType = watch('ticketType');
  const rate = watch('rate');
  const quantity = watch('quantity');
  const hours = watch('hours');

  // Calculate total amount when rate, quantity, or hours change
  React.useEffect(() => {
    if (ticketType === 'MATERIAL' && rate && quantity) {
      setValue('totalAmount', rate * quantity);
    } else if (ticketType === 'HOURLY' && rate && hours) {
      setValue('totalAmount', rate * hours);
    }
  }, [ticketType, rate, quantity, hours, setValue]);

  const handleFormSubmit = async (data: TicketFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Trucking ticket created successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create trucking ticket',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Trucking Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="ticketNumber">Ticket Number *</label>
              <Input
                id="ticketNumber"
                {...register('ticketNumber')}
                error={errors.ticketNumber?.message}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ticketDate">Ticket Date *</label>
              <DatePicker
                id="ticketDate"
                selected={watch('ticketDate')}
                onChange={(date) => setValue('ticketDate', date as Date)}
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
              <label htmlFor="contractorId">Contractor *</label>
              <Select
                id="contractorId"
                {...register('contractorId')}
                error={errors.contractorId?.message}
              >
                <option value="">Select Contractor</option>
                {contractors.map((contractor) => (
                  <option key={contractor.id} value={contractor.id}>
                    {contractor.name}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ticketType">Ticket Type *</label>
              <Select
                id="ticketType"
                {...register('ticketType')}
                error={errors.ticketType?.message}
              >
                <option value="MATERIAL">Material</option>
                <option value="HOURLY">Hourly</option>
              </Select>
            </div>
            
            {ticketType === 'MATERIAL' && (
              <div className="space-y-2">
                <label htmlFor="materialId">Material</label>
                <Select
                  id="materialId"
                  {...register('materialId')}
                  error={errors.materialId?.message}
                >
                  <option value="">Select Material</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            
            {ticketType === 'MATERIAL' && (
              <div className="space-y-2">
                <label htmlFor="quantity">Quantity</label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  {...register('quantity', { valueAsNumber: true })}
                  error={errors.quantity?.message}
                />
              </div>
            )}
            
            {ticketType === 'HOURLY' && (
              <div className="space-y-2">
                <label htmlFor="hours">Hours</label>
                <Input
                  id="hours"
                  type="number"
                  step="0.01"
                  {...register('hours', { valueAsNumber: true })}
                  error={errors.hours?.message}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="rate">Rate *</label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                {...register('rate', { valueAsNumber: true })}
                error={errors.rate?.message}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="totalAmount">Total Amount *</label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                {...register('totalAmount', { valueAsNumber: true })}
                error={errors.totalAmount?.message}
                readOnly
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
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
