import { Request, Response } from 'express';
import prisma from '@/prisma';

export class InvoiceController {
  async getAllInvoices(req: Request, res: Response) {
    const {userId} = req.params

    try {
      const invoices = await prisma.invoice.findMany({
        where:{userId},

        include: {
          user: true,
          client: true,
          invoiceItems: true,
        },
      });

      return res.status(200).send(invoices);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error retrieving invoices' });
    }
  }

  async getInvoiceById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          user: true,
          client: true,
          invoiceItems: true,
        },
      });

      if (!invoice) {
        return res.status(404).send({ message: 'Invoice not found' });
      }

      return res.status(200).send(invoice);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error retrieving invoice' });
    }
  }

  async createInvoice(req: Request, res: Response) {
    const { userId, clientId, dueDate, status, recurringSchedule, recurringEndDate } = req.body;

    try {
      const newInvoice = await prisma.invoice.create({
        data: {
          userId,
          clientId,
          dueDate: new Date(dueDate),
          status,
          recurringSchedule,
          recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
        },
      });

      return res.status(201).send(newInvoice);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error creating invoice' });
    }
  }

  async updateInvoice(req: Request, res: Response) {
    const { id } = req.params;
    const { dueDate, status, recurringSchedule, recurringEndDate } = req.body;

    try {
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: {
          dueDate: dueDate ? new Date(dueDate) : undefined,
          status,
          recurringSchedule,
          recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : undefined,
        },
      });

      return res.status(200).send(updatedInvoice);
    } catch (error:any) {
      console.error(error);

      if (error.code === 'P2025') {
        return res.status(404).send({ message: 'Invoice not found' });
      }

      return res.status(500).send({ message: 'Error updating invoice' });
    }
  }

  async deleteInvoice(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.invoice.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error:any) {
      console.error(error);

      // Jika invoice tidak ditemukan
      if (error.code === 'P2025') {
        return res.status(404).send({ message: 'Invoice not found' });
      }

      return res.status(500).send({ message: 'Error deleting invoice' });
    }
  }
}
