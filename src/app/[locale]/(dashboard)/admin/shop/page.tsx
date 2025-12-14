import ShopHero from "@/components/layout/Dashboard/Admin/Shop/ShopHero";
import ShopTable from "@/components/layout/Dashboard/Admin/Shop/ShopTable";

const page = () => {
  return (
    <div>
      <ShopHero />
      <div className="w-[80%] mx-auto py-10">
        <ShopTable />
      </div>
    </div>
  );
};

export default page;
