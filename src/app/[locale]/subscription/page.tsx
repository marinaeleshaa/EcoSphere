import SubscriptionHero from "@/components/layout/subscription/subscriptionHero";
import SubscriptionSection from "@/components/layout/subscription/SubscriptionSection";

export default async function page(params: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params.params;
  return (
    <>
      {/* decorations */}
      <div className="relative">
        <div className="dark:bg-primary/10 absolute top-0 left-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
        <div className="dark:bg-primary/10 absolute bottom-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
        <SubscriptionHero />
      </div>
      <div>
        <SubscriptionSection locale={locale} />
      </div>
    </>
  );
}
