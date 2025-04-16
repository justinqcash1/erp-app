# ERP Application User Guide

## Introduction

Welcome to your custom ERP application designed specifically for managing trucking tickets, invoices, material-freight alignment, and scope changes. This guide will help you navigate the system and make the most of its features.

## Getting Started

### Accessing the System

1. Open your web browser and navigate to the application URL
2. Log in with your credentials
3. You'll be directed to the dashboard showing key metrics and navigation options

### Navigation

The main navigation menu includes:
- Dashboard
- Trucking Tickets
- Invoices
- Material Purchases
- Scope Change Calculator
- Reports
- Administration (for admin users only)

## Trucking Ticket Management

### Creating a New Trucking Ticket

1. Navigate to **Trucking Tickets** > **Create New Ticket**
2. Select the ticket type (Material or Hourly)
3. Fill in the required information:
   - Ticket number
   - Date
   - Project
   - Contractor
   - Material (for material tickets)
   - Quantity/Hours
   - Rate
4. The system will automatically calculate the total amount
5. Click "Create Ticket" to save

### Managing Trucking Tickets

1. Navigate to **Trucking Tickets** to view all tickets
2. Use filters to narrow down results by:
   - Project
   - Status (Logged, Invoiced, Disputed, Void)
   - Ticket type
   - Date range
3. Click on any ticket to view details
4. From the detail view, you can:
   - Create an invoice from the ticket
   - Mark as disputed
   - Void the ticket
   - Link to material purchases

### Monthly Uninvoiced Ticket Tracking

1. The dashboard displays a summary of uninvoiced tickets
2. Navigate to **Reports** > **Uninvoiced Tickets** for detailed reports
3. Filter by month to track accruals for specific periods

## Invoice Verification System

### Creating Invoices

1. Navigate to **Invoices** > **Create New Invoice**
2. Select the project and cost phase
3. Add trucking tickets to the invoice:
   - From the invoice creation page
   - Or by selecting tickets from the trucking tickets list
4. Verify the total amount matches the sum of tickets
5. Add any notes or reference numbers
6. Click "Create Invoice" to save

### Verifying Invoices

1. Navigate to **Invoices** to view all invoices
2. Click on an invoice to view details
3. The system automatically verifies that:
   - Invoice rates match operation rates
   - Invoice total matches the sum of tickets
4. If verification passes, click "Verify Invoice"
5. If discrepancies are found, mark as "Disputed"

### Cost Phase Coding

1. When creating an invoice, assign the appropriate cost phase
2. The system tracks costs by phase for reporting and scope change calculations
3. Navigate to **Reports** > **Cost Phase Summary** to view costs by phase

## Material-Freight Tracking

### Recording Material Purchases

1. Navigate to **Material Purchases** > **Create New Purchase**
2. Select the material, project, and enter quantity and cost
3. Optionally link to a trucking ticket that transported the material
4. Click "Create Purchase" to save

### Linking Materials to Freight

1. Navigate to **Material Purchases** to view all purchases
2. Click on an unlinked purchase
3. Select "Link to Trucking Ticket"
4. Choose from available material trucking tickets
5. Click "Link" to establish the relationship

### Material-Freight Alignment Reporting

1. Navigate to **Reports** > **Material-Freight Alignment**
2. View alignment status for all material purchases
3. Identify unmatched materials or freight
4. Generate reports for specific date ranges or projects

## Scope Change Calculator

### Calculating Scope Changes

1. Navigate to **Scope Change Calculator**
2. Select the scope item to modify
3. Enter the new quantity
4. The system will automatically:
   - Calculate the revenue impact
   - Show affected cost phases
   - Calculate cost adjustments based on defined relationships
5. Review the calculated changes
6. Click "Apply Scope Change" to save

### Viewing Scope Change History

1. Navigate to **Scope Changes** to view all changes
2. Click on any change to see details including:
   - Original and new quantities
   - Revenue impact
   - Cost phase adjustments
   - Total cost impact

## Reports

The system includes several built-in reports:

1. **Uninvoiced Ticket Report**
   - Shows all tickets not yet invoiced
   - Useful for monthly accrual tracking

2. **Invoice Verification Report**
   - Shows verification status of all invoices
   - Highlights discrepancies

3. **Material-Freight Alignment Report**
   - Shows alignment between materials and freight
   - Identifies unmatched items

4. **Scope Change Impact Report**
   - Shows financial impact of scope changes
   - Breaks down by revenue and cost

## Administration

### User Management

1. Navigate to **Administration** > **Users**
2. Add new users with appropriate roles
3. Manage existing user permissions

### System Settings

1. Navigate to **Administration** > **Settings**
2. Configure system-wide settings
3. Manage projects, contractors, and materials

## Getting Help

If you encounter any issues or have questions:

1. Refer to this user guide
2. Check the FAQ section
3. Contact your system administrator

Thank you for using our ERP application!
