import NewInvoice from "@/components/home-components/newInvoice";
import ClientTable from "@/components/home-components/tableClient";
import InvoiceTable from "@/components/home-components/tableInvoice";
import ProductTable from "@/components/home-components/tableProduct";

const Home = () => {
  return (
    <div className="min-h-[90vh] px-20 py-10 -z-10">
     <ClientTable/>
     <div className="mt-2"></div>
     <ProductTable/>
     <div className="mt-2"></div>
     <InvoiceTable />
     <NewInvoice/>
    </div>
  );
};

export default Home;
