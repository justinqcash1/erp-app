import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

// Form validation schema
const scopeChangeFormSchema = z.object({
  scopeItemId: z.string().min(1, 'Scope item is required'),
  originalQuantity: z.number().min(0, 'Original quantity must be 0 or greater'),
  newQuantity: z.number().min(0, 'New quantity must be 0 or greater'),
  unitRevenue: z.number().min(0, 'Unit revenue must be 0 or greater'),
  description: z.string().min(1, 'Description is required'),
  updateCostPhases: z.boolean().default(true),
});

type ScopeChangeFormValues = z.infer<typeof scopeChangeFormSchema>;

interface ScopeItem {
  id: string;
  name: string;
  quantity: number;
  unitRevenue: number;
  unitOfMeasure: string;
  costRelations: {
    costPhase: {
      id: string;
      name: string;
      code: string;
      quantity: number;
      unitCost: number;
      totalCost: number;
    };
    ratio: number;
  }[];
}

interface ScopeChangeFormProps {
  scopeItems: ScopeItem[];
  onSubmit: (data: ScopeChangeFormValues) => void;
  onScopeItemChange: (scopeItemId: string) => void;
}

export function ScopeChangeCalculatorForm({
  scopeItems,
  onSubmit,
  onScopeItemChange,
}: ScopeChangeFormProps) {
  const [selectedScopeItem, setSelectedScopeItem] = React.useState<ScopeItem | null>(null);
  const [calculatedChanges, setCalculatedChanges] = React.useState<any>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ScopeChangeFormValues>({
    resolver: zodResolver(scopeChangeFormSchema),
    defaultValues: {
      originalQuantity: 0,
      newQuantity: 0,
      unitRevenue: 0,
      updateCostPhases: true,
    },
  });

  const scopeItemId = watch('scopeItemId');
  const originalQuantity = watch('originalQuantity');
  const newQuantity = watch('newQuantity');
  const unitRevenue = watch('unitRevenue');
  const updateCostPhases = watch('updateCostPhases');

  // Update form values when scope item changes
  React.useEffect(() => {
    if (scopeItemId) {
      const scopeItem = scopeItems.find(item => item.id === scopeItemId);
      if (scopeItem) {
        setSelectedScopeItem(scopeItem);
        setValue('originalQuantity', scopeItem.quantity);
        setValue('unitRevenue', scopeItem.unitRevenue);
        onScopeItemChange(scopeItemId);
      }
    } else {
      setSelectedScopeItem(null);
    }
  }, [scopeItemId, scopeItems, setValue, onScopeItemChange]);

  // Calculate changes when values change
  React.useEffect(() => {
    if (selectedScopeItem && newQuantity !== undefined && originalQuantity !== undefined && unitRevenue !== undefined) {
      const quantityChangeRatio = originalQuantity > 0 ? newQuantity / originalQuantity : 0;
      const originalTotalRevenue = originalQuantity * unitRevenue;
      const newTotalRevenue = newQuantity * unitRevenue;
      const revenueDifference = newTotalRevenue - originalTotalRevenue;
      
      const costPhaseChanges = selectedScopeItem.costRelations.map(relation => {
        const costPhase = relation.costPhase;
        const newQuantity = updateCostPhases 
          ? costPhase.quantity * (1 + (quantityChangeRatio - 1) * relation.ratio)
          : costPhase.quantity;
        const newTotalCost = newQuantity * costPhase.unitCost;
        const costDifference = newTotalCost - costPhase.totalCost;
        
        return {
          costPhase,
          originalQuantity: costPhase.quantity,
          newQuantity,
          originalTotalCost: costPhase.totalCost,
          newTotalCost,
          costDifference,
          ratio: relation.ratio,
        };
      });
      
      setCalculatedChanges({
        quantityChangeRatio,
        originalTotalRevenue,
        newTotalRevenue,
        revenueDifference,
        costPhaseChanges,
      });
    } else {
      setCalculatedChanges(null);
    }
  }, [selectedScopeItem, originalQuantity, newQuantity, unitRevenue, updateCostPhases]);

  const handleFormSubmit = async (data: ScopeChangeFormValues) => {
    try {
      await onSubmit({
        ...data,
        originalQuantity: Number(data.originalQuantity),
        newQuantity: Number(data.newQuantity),
        unitRevenue: Number(data.unitRevenue),
      });
      toast({
        title: 'Success',
        description: 'Scope change applied successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply scope change',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scope Change Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="scopeItemId">Scope Item *</label>
              <Select
                id="scopeItemId"
                {...register('scopeItemId')}
                error={errors.scopeItemId?.message}
              >
                <option value="">Select Scope Item</option>
                {scopeItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.quantity} {item.unitOfMeasure})
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="originalQuantity">Original Quantity *</label>
              <Input
                id="originalQuantity"
                type="number"
                step="0.01"
                {...register('originalQuantity', { valueAsNumber: true })}
                error={errors.originalQuantity?.message}
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="newQuantity">New Quantity *</label>
              <Input
                id="newQuantity"
                type="number"
                step="0.01"
                {...register('newQuantity', { valueAsNumber: true })}
                error={errors.newQuantity?.message}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="unitRevenue">Unit Revenue *</label>
              <Input
                id="unitRevenue"
                type="number"
                step="0.01"
                {...register('unitRevenue', { valueAsNumber: true })}
                error={errors.unitRevenue?.message}
              />
            </div>
            
            <div className="space-y-2 flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('updateCostPhases')}
                  className="mr-2"
                />
                Automatically update related cost phases
              </label>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description">Change Description *</label>
              <Textarea
                id="description"
                {...register('description')}
                error={errors.description?.message}
                placeholder="Describe the reason for this scope change..."
              />
            </div>
          </div>
          
          {calculatedChanges && (
            <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-lg">Calculated Changes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Revenue Impact</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Original Total Revenue:</span>
                      <span>${calculatedChanges.originalTotalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Total Revenue:</span>
                      <span>${calculatedChanges.newTotalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Revenue Difference:</span>
                      <span className={calculatedChanges.revenueDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${calculatedChanges.revenueDifference.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Quantity Change</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Original Quantity:</span>
                      <span>{originalQuantity} {selectedScopeItem?.unitOfMeasure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Quantity:</span>
                      <span>{newQuantity} {selectedScopeItem?.unitOfMeasure}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Change Ratio:</span>
                      <span>
                        {(calculatedChanges.quantityChangeRatio * 100).toFixed(1)}%
                        {calculatedChanges.quantityChangeRatio > 1 ? ' (Increase)' : calculatedChanges.quantityChangeRatio < 1 ? ' (Decrease)' : ' (No Change)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {updateCostPhases && calculatedChanges.costPhaseChanges.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Cost Phase Impacts</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cost Phase</TableHead>
                          <TableHead>Ratio</TableHead>
                          <TableHead>Original Quantity</TableHead>
                          <TableHead>New Quantity</TableHead>
                          <TableHead>Original Cost</TableHead>
                          <TableHead>New Cost</TableHead>
                          <TableHead>Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculatedChanges.costPhaseChanges.map((change, index) => (
                          <TableRow key={index}>
                            <TableCell>{change.costPhase.code} - {change.costPhase.name}</TableCell>
                            <TableCell>{(change.ratio * 100).toFixed(1)}%</TableCell>
                            <TableCell>{change.originalQuantity.toFixed(2)}</TableCell>
                            <TableCell>{change.newQuantity.toFixed(2)}</TableCell>
                            <TableCell>${change.originalTotalCost.toFixed(2)}</TableCell>
                            <TableCell>${change.newTotalCost.toFixed(2)}</TableCell>
                            <TableCell className={change.costDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                              ${change.costDifference.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-medium">Total Cost Impact:</TableCell>
                          <TableCell colSpan={2}></TableCell>
                          <TableCell className={
                            calculatedChanges.costPhaseChanges.reduce((sum, change) => sum + change.costDifference, 0) >= 0 
                              ? 'text-green-600 font-medium' 
                              : 'text-red-600 font-medium'
                          }>
                            ${calculatedChanges.costPhaseChanges.reduce((sum, change) => sum + change.costDifference, 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <Button type="submit" disabled={isSubmitting || !calculatedChanges}>
            {isSubmitting ? 'Applying Changes...' : 'Apply Scope Change'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
