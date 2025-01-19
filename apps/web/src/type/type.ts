export interface LoginFormValues {
    email: string;
    password: string;
  }

  export interface Invoice {
    id: string;
    dueDate: string;
    status: string;
    client: Client;
    invoiceItems: InvoiceItem[];
    recurringSchedule?: string;  
    recurringEndDate?: string;   
  }
  

export interface InvoiceItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
  }

export interface Client {
    name: string;
    address: string;
    contactInfo: string;
  }

export interface Product {
    id: string;
    name: string;
  }

export interface InvoiceDetailProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE"
}