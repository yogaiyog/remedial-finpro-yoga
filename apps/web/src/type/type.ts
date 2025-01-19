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
    email: string;
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

//--------------

export interface IinvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Iclient {
  id: string;
  name: string;
  address: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Iinvoice {
  id: string;
  userId: string;
  clientId: string;
  dueDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  client: Iclient;
  invoiceItems: IinvoiceItem[];
}