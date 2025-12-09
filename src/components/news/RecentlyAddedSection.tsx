"use client";

import NewsCard from "./NewsCard";

const RECENTLY_ADDED_DATA = [
    {
        id: 1,
        title: "Green Leaf Bistro",
        description: "A cozy spot offering organic, farm-to-table meals with a focus on sustainability and zero waste practices. Come taste the difference!",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
        link: "/restaurant/1",
    },
    {
        id: 2,
        title: "EcoMart Grocery",
        description: "Your one-stop shop for bulk foods, plastic-free essentials, and locally sourced produce. Bring your own containers and save!",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
        link: "/shop/2",
    },
    {
        id: 3,
        title: "The Vegan Joint",
        description: "Delicious plant-based comfort food that's good for you and the planet. Try our famous jackfruit tacos today.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
        link: "/restaurant/3",
    },
];

const RecentlyAddedSection = () => {
    return (
        <section className="py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-8 text-foreground">Recently Added</h2>
                <div className="flex flex-col gap-6">
                    {RECENTLY_ADDED_DATA.map((item) => (
                        <NewsCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            image={item.image}
                            link={item.link}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyAddedSection;
