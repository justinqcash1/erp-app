"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { InvoiceForm } from '@/components/invoice-form';
import { toast } from '@/components/ui/toast';

export default function CreateInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [projects, setProjects] = React.useState([]);
  const [costPhases, setCostPhases] = React.useState([]);
  const [selectedTickets, setSelectedTickets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  // Get ticket IDs from URL if provided
  const ticketIds = searchParams.get('tickets')?.split(',') || [];

  // Fetch projects and selected tickets on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsResponse = await fetch('/api/projects');
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        
        // Fetch selected tickets if IDs are provided
        if (ticketIds.length > 0) {
          const ticketsPromises = ticketIds.map(id => 
            fetch(`/api/trucking-tickets/${id}`).then(res => res.json())
          );
          
          const ticketsData = await Promise.all(ticketsPromises);
          setSelectedTickets(ticketsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load required data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, ticketIds]);

  // Fetch cost phases when project changes
  const handleProjectChange = async (projectId) => {
    try {
      const response = await fetch(`/api/cost-phases?projectId=${projectId}`);
      const data = await response.json();
      setCostPhases(data);
    } catch (error) {
      console.error('Error fetching cost phases:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cost phases',
        variant: 'destructive',
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create invoice');
      }
      
      const invoice = await response.json();
      
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
        variant: 'success',
      });
      
      // Redirect to the invoice detail page
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create invoice',
        variant: 'destructive',
      });
      throw error; // Re-throw to be caught by the form component
    }
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>
      
      <InvoiceForm
        projects={projects}
        costPhases={costPhases}
        selectedTickets={selectedTickets}
        onSubmit={handleSubmit}
        onProjectChange={handleProjectChange}
      />
    </div>
  );
}
