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

interface MaterialPurchase {
  id: string;
  purchaseDate: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  purchaseOrder: string | null;
  material: {
    id: string;
    name: string;
    unitOfMeasure: string;
  };
  project: {
    id: string;
    name: string;
  };
  ticket?: {
    id: string;
    ticketNumber: string;
    contractor: {
      name: string;
    };
  };
}

interface Project {
  id: string;
  name: string;
}

interface Material {
  id: string;
  name: string;
}

interface MaterialPurchaseListProps {
  purchases: MaterialPurchase[];
  projects: Project[];
  materials: Material[];
  onFilterChange: (filters: any) => void;
  onPurchaseSelect: (purchase: MaterialPurchase) => void;
}

export function MaterialPurchaseList({
  purchases,
  projects,
  materials,
  onFilterChange,
  onPurchaseSelect,
}: MaterialPurchaseListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedProjectId, setSelectedProjectId] = React.useState('');
  const [selectedMaterialId, setSelectedMaterialId] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [showUnmatchedOnly, setShowUnmatchedOnly] = React.useState(false);

  // Handle filter changes
  const handleFilterChange = () => {
    onFilterChange({
      projectId: selectedProjectId || undefined,
      materialId: selectedMaterialId || undefined,
      search: searchQuery || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      unmatchedOnly: showUnmatchedOnly,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate alignment status
  const getAlignmentStatus = (purchase: MaterialPurchase) => {
    if (!purchase.ticket) {
      return <Badge variant="destructive">No Ticket</Badge>;
    }
    return <Badge variant="success">Matched</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Material Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by PO number..."
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
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full"
              >
                <option value="">All Materials</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
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
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showUnmatchedOnly}
                  onChange={(e) => setShowUnmatchedOnly(e.target.checked)}
                  className="mr-2"
                />
                Show unmatched only
              </label>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>PO #</TableHead>
                  <TableHead>Trucking Ticket</TableHead>
                  <TableHead>Alignment</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
                      No material purchases found
                    </TableCell>
                  </TableRow>
                ) : (
                  purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                      <TableCell>{purchase.material.name}</TableCell>
                      <TableCell>{purchase.project.name}</TableCell>
                      <TableCell>{purchase.quantity} {purchase.material.unitOfMeasure}</TableCell>
                      <TableCell>${purchase.unitCost.toFixed(2)}</TableCell>
                      <TableCell>${purchase.totalCost.toFixed(2)}</TableCell>
                      <TableCell>{purchase.purchaseOrder || '-'}</TableCell>
                      <TableCell>
                        {purchase.ticket ? (
                          <a 
                            href={`/trucking-tickets/${purchase.ticket.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {purchase.ticket.ticketNumber}
                          </a>
                        ) : (
                          'None'
                        )}
                      </TableCell>
                      <TableCell>{getAlignmentStatus(purchase)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPurchaseSelect(purchase)}
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
