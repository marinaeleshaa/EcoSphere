import RecycleAgentTable from "@/components/layout/Dashboard/Admin/recycleAgent/recycleAgentTable";
import RecycleAgentHero from "@/components/layout/Dashboard/Admin/recycleAgent/recycleAgentHero";

const page = () => {
  return (
    <div>
      <RecycleAgentHero />
      <RecycleAgentTable />
    </div>
  );
};

export default page;
