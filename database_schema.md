# Database Schema for ERP Application

## Overview
This document outlines the database schema for the web-based ERP application designed to handle trucking ticket management, invoice verification, material-freight tracking, and scope change calculations. The schema is designed for PostgreSQL and will be implemented using Prisma ORM.

## Entity Relationship Diagram (Conceptual)

```
User
  |
  |---- Project
  |      |
  |      |---- CostPhase
  |      |
  |      |---- ScopeItem
  |             |
  |             |---- ScopeItemCostRelation
  |                    |
  |                    |---- CostPhase
  |
  |---- TruckingTicket
  |      |
  |      |---- Project
  |      |
  |      |---- Material
  |      |
  |      |---- TruckingContractor
  |
  |---- Invoice
  |      |
  |      |---- TruckingTicket
  |      |
  |      |---- Project
  |      |
  |      |---- CostPhase
  |
  |---- MaterialPurchase
         |
         |---- Material
         |
         |---- Project
         |
         |---- TruckingTicket
```

## Tables

### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String    // Hashed password
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  projects      Project[]
  tickets       TruckingTicket[]
  invoices      Invoice[]
  materialPurchases MaterialPurchase[]
}

enum Role {
  ADMIN
  MANAGER
  ACCOUNTANT
  USER
}
```

### Project
```prisma
model Project {
  id            String    @id @default(cuid())
  name          String
  description   String?
  startDate     DateTime
  endDate       DateTime?
  status        ProjectStatus @default(ACTIVE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  costPhases    CostPhase[]
  scopeItems    ScopeItem[]
  tickets       TruckingTicket[]
  invoices      Invoice[]
  materialPurchases MaterialPurchase[]
}

enum ProjectStatus {
  ACTIVE
  COMPLETED
  ON_HOLD
  CANCELLED
}
```

### CostPhase
```prisma
model CostPhase {
  id            String    @id @default(cuid())
  name          String
  code          String    // Cost code identifier
  description   String?
  unitOfMeasure String    // e.g., LF, CY, EA
  unitCost      Float
  quantity      Float
  totalCost     Float
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id])
  invoices      Invoice[]
  scopeItemRelations ScopeItemCostRelation[]
}
```

### ScopeItem
```prisma
model ScopeItem {
  id            String    @id @default(cuid())
  name          String
  description   String?
  unitOfMeasure String    // e.g., LF, CY, EA
  quantity      Float
  unitRevenue   Float
  totalRevenue  Float
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id])
  costRelations ScopeItemCostRelation[]
}
```

### ScopeItemCostRelation
```prisma
model ScopeItemCostRelation {
  id            String    @id @default(cuid())
  ratio         Float     // How much of the cost phase is affected by this scope item
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  scopeItemId   String
  scopeItem     ScopeItem @relation(fields: [scopeItemId], references: [id])
  costPhaseId   String
  costPhase     CostPhase @relation(fields: [costPhaseId], references: [id])
}
```

### Material
```prisma
model Material {
  id            String    @id @default(cuid())
  name          String
  description   String?
  unitOfMeasure String    // e.g., Tons, CY, EA
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  tickets       TruckingTicket[]
  purchases     MaterialPurchase[]
}
```

### TruckingContractor
```prisma
model TruckingContractor {
  id            String    @id @default(cuid())
  name          String
  contactPerson String?
  phone         String?
  email         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  tickets       TruckingTicket[]
}
```

### TruckingTicket
```prisma
model TruckingTicket {
  id            String    @id @default(cuid())
  ticketNumber  String    @unique  // External ticket identifier
  ticketDate    DateTime
  quantity      Float?
  hours         Float?    // For hourly trucking
  rate          Float
  totalAmount   Float
  ticketType    TicketType
  status        TicketStatus @default(LOGGED)
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id])
  materialId    String?
  material      Material? @relation(fields: [materialId], references: [id])
  contractorId  String
  contractor    TruckingContractor @relation(fields: [contractorId], references: [id])
  userId        String    // Who logged the ticket
  user          User      @relation(fields: [userId], references: [id])
  invoiceId     String?
  invoice       Invoice?  @relation(fields: [invoiceId], references: [id])
  materialPurchases MaterialPurchase[]
}

enum TicketType {
  MATERIAL
  HOURLY
}

enum TicketStatus {
  LOGGED
  INVOICED
  DISPUTED
  VOID
}
```

### Invoice
```prisma
model Invoice {
  id            String    @id @default(cuid())
  invoiceNumber String    @unique  // External invoice identifier
  invoiceDate   DateTime
  dueDate       DateTime
  totalAmount   Float
  status        InvoiceStatus @default(PENDING)
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id])
  costPhaseId   String
  costPhase     CostPhase @relation(fields: [costPhaseId], references: [id])
  userId        String    // Who processed the invoice
  user          User      @relation(fields: [userId], references: [id])
  tickets       TruckingTicket[]
}

enum InvoiceStatus {
  PENDING
  VERIFIED
  PAID
  DISPUTED
}
```

### MaterialPurchase
```prisma
model MaterialPurchase {
  id            String    @id @default(cuid())
  purchaseDate  DateTime
  quantity      Float
  unitCost      Float
  totalCost     Float
  purchaseOrder String?   // PO number
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  materialId    String
  material      Material  @relation(fields: [materialId], references: [id])
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id])
  userId        String    // Who logged the purchase
  user          User      @relation(fields: [userId], references: [id])
  ticketId      String?   // Associated trucking ticket if applicable
  ticket        TruckingTicket? @relation(fields: [ticketId], references: [id])
}
```

## Schema Explanation

### Trucking Ticket Management
The schema supports both material and hourly trucking tickets through the `TruckingTicket` model with a `ticketType` field. Each ticket is associated with a project, contractor, and optionally a material. The `status` field tracks whether a ticket has been invoiced, allowing for easy identification of uninvoiced tickets for monthly accrual.

### Invoice Verification
Invoices are linked to trucking tickets, enabling verification that the invoice rate matches the operation. The `Invoice` model includes a status field to track verification progress. By linking invoices to cost phases, the system ensures proper cost coding.

### Material-Freight Tracking
The `MaterialPurchase` model tracks material purchases, which can be linked to trucking tickets. This allows for alignment verification between materials purchased and the freight used to transport them.

### Scope Change Calculator
The schema implements a flexible scope change system through the `ScopeItem` and `ScopeItemCostRelation` models. When a scope item quantity changes, the system can automatically adjust related cost phases based on the defined ratios. This supports the requirement to update multiple cost codes when a scope change occurs.

### Duplicate Ticket Detection
The unique constraint on `ticketNumber` in the `TruckingTicket` model prevents duplicate tickets from being entered into the system.
