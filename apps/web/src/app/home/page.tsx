import DataReport from "@/components/home-components/dashboard";
import NewInvoice from "@/components/home-components/newInvoice";
import ClientTable from "@/components/home-components/tableClient";
import InvoiceTable from "@/components/home-components/tableInvoice";
import ProductTable from "@/components/home-components/tableProduct";

const Home = () => {
  return (
    <div className="min-h-[90vh] px-20 py-10 -z-10 bg-slate-100">
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-1">
          <NewInvoice/>
        </div>
      </div>
     <div className="mt-2"></div>
    <div className="grid grid-cols-5 gap-2">
      <div className="col-span-3">
        <ProductTable />
      </div>
      <div className="col-span-2">
          <DataReport />
      </div>
    </div>
     <div className="grid grid-cols-5 gap-2 mt-2">
        <div className="col-span-1">
          <ClientTable />
        </div>
        <div className="col-span-4">
          <InvoiceTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
