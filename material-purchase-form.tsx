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
const materialPurchaseFormSchema = z.object({
  purchaseDate: z.date(),
  materialId: z.string().min(1, 'Material is required'),
  projectId: z.string().min(1, 'Project is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unitCost: z.number().min(0.01, 'Unit cost must be greater than 0'),
  totalCost: z.number().min(0.01, 'Total cost must be greater than 0'),
  purchaseOrder: z.string().optional(),
  ticketId: z.string().optional(),
  notes: z.string().optional(),
});

type MaterialPurchaseFormValues = z.infer<typeof materialPurchaseFormSchema>;

interface Project {
  id: string;
  name: string;
}

interface Material {
  id: string;
  name: string;
  unitOfMeasure: string;
}

interface TruckingTicket {
  id: string;
  ticketNumber: string;
  ticketDate: string;
  contractor: {
    name: string;
  };
}

interface MaterialPurchaseFormProps {
  projects: Project[];
  materials: Material[];
  availableTickets: TruckingTicket[];
  onSubmit: (data: MaterialPurchaseFormValues) => void;
  onProjectChange: (projectId: string) => void;
}

export function MaterialPurchaseForm({
  projects,
  materials,
  availableTickets,
  onSubmit,
  onProjectChange,
}: MaterialPurchaseFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MaterialPurchaseFormValues>({
    resolver: zodResolver(materialPurchaseFormSchema),
    defaultValues: {
      purchaseDate: new Date(),
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
    },
  });

  const selectedProjectId = watch('projectId');
  const selectedMaterialId = watch('materialId');
  const quantity = watch('quantity');
  const unitCost = watch('unitCost');

  // Update available tickets when project changes
  React.useEffect(() => {
    if (selectedProjectId) {
      onProjectChange(selectedProjectId);
    }
  }, [selectedProjectId, onProjectChange]);

  // Calculate total cost when quantity or unit cost changes
  React.useEffect(() => {
    if (quantity && unitCost) {
      setValue('totalCost', quantity * unitCost);
    }
  }, [quantity, unitCost, setValue]);

  const handleFormSubmit = async (data: MaterialPurchaseFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Material purchase created successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create material purchase',
        variant: 'destructive',
      });
    }
  };

  // Get selected material unit of measure
  const getSelectedMaterialUnit = () => {
    if (!selectedMaterialId) return '';
    const material = materials.find(m => m.id === selectedMaterialId);
    return material ? material.unitOfMeasure : '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Material Purchase</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="purchaseDate">Purchase Date *</label>
              <DatePicker
                id="purchaseDate"
                selected={watch('purchaseDate')}
                onChange={(date) => setValue('purchaseDate', date as Date)}
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
              <label htmlFor="materialId">Material *</label>
              <Select
                id="materialId"
                {...register('materialId')}
                error={errors.materialId?.message}
              >
                <option value="">Select Material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} ({material.unitOfMeasure})
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quantity">Quantity *</label>
              <div className="flex">
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  {...register('quantity', { valueAsNumber: true })}
                  error={errors.quantity?.message}
                  className="flex-1"
                />
                <span className="ml-2 flex items-center text-gray-500">
                  {getSelectedMaterialUnit()}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="unitCost">Unit Cost *</label>
              <div className="flex">
                <span className="flex items-center mr-2 text-gray-500">$</span>
                <Input
                  id="unitCost"
                  type="number"
                  step="0.01"
                  {...register('unitCost', { valueAsNumber: true })}
                  error={errors.unitCost?.message}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="totalCost">Total Cost *</label>
              <div className="flex">
                <span className="flex items-center mr-2 text-gray-500">$</span>
                <Input
                  id="totalCost"
                  type="number"
                  step="0.01"
                  {...register('totalCost', { valueAsNumber: true })}
                  error={errors.totalCost?.message}
                  className="flex-1"
                  readOnly
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="purchaseOrder">Purchase Order #</label>
              <Input
                id="purchaseOrder"
                {...register('purchaseOrder')}
                error={errors.purchaseOrder?.message}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ticketId">Associated Trucking Ticket</label>
              <Select
                id="ticketId"
                {...register('ticketId')}
                error={errors.ticketId?.message}
                disabled={!selectedProjectId || availableTickets.length === 0}
              >
                <option value="">Select Trucking Ticket (Optional)</option>
                {availableTickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    #{ticket.ticketNumber} - {ticket.contractor.name}
                  </option>
                ))}
              </Select>
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
            {isSubmitting ? 'Creating...' : 'Create Purchase'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
