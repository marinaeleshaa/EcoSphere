import { useState } from "react";
import ShopCard from "./ShopCard";
import FilterBar from "./FilterBar";
import { motion } from "framer-motion";

export default function ShopSection() {
  const [currentSort, setCurrentSort] = useState("Default"); // New state for sorting
  const [searchQuery, setSearchQuery] = useState("");

  const shops = [
    {
      id: 101,
      title: "The Green Fork Bistro",
      rating: 4.7,
      cuisine: "Vegan & Organic",
      img: "/store5.png",
      desc: "Fresh, seasonal ingredients prepared with a focus on sustainable and plant-based dishes. Known for their homemade pasta.",
      workingHours: "10am-11pm",
    },
    {
      id: 102,
      title: "Samurai Sushi House",
      rating: 4.9,
      cuisine: "Japanese",
      img: "/store5.png",
      desc: "Authentic Edo-style sushi and premium sashimi flown in daily. Perfect for a high-end, classic experience.",
      workingHours: "10am-11pm",
    },
    {
      id: 103,
      title: "Mama Mia's Pizzeria",
      rating: 4.2,
      cuisine: "Italian",
      img: "/store5.png",
      desc: "Family-owned spot serving wood-fired pizzas and hearty Italian comfort food. Great for large groups and delivery.",
      workingHours: "10am-11pm",
    },
    {
      id: 104,
      title: "Chai & Spice Indian Kitchen",
      rating: 4.5,
      cuisine: "Indian",
      img: "/store5.png",
      desc: "Vibrant and aromatic Northern Indian cuisine. Specialties include Butter Chicken and fresh Garlic Naan.",
      workingHours: "10am-11pm",
    },
    {
      id: 105,
      title: "Coastal Catch Seafood",
      rating: 3.8,
      cuisine: "Seafood",
      img: "/store5.png",
      desc: "Casual joint famous for its fried fish baskets and clam chowder. Located near the marina.",
      workingHours: "10am-11pm",
    },
    {
      id: 106,
      title: "El Fuego Mexican Grill",
      rating: 4.6,
      cuisine: "Mexican",
      img: "/store5.png",
      desc: "Taco Tuesdays and strong margaritas! Serving authentic street tacos and generous burrito bowls.",
      workingHours: "10am-11pm",
    },
    {
      id: 107,
      title: "The Corner Coffee Bar",
      rating: 4.4,
      cuisine: "Café/Breakfast",
      img: "/store5.png",
      desc: "Artisan coffee, fresh pastries, and light breakfast fare. A cozy spot perfect for remote work or a quick meeting.",
      workingHours: "10am-11pm",
    },
    {
      id: 108,
      title: "The Butcher's Block Steakhouse",
      rating: 5.0,
      cuisine: "Steakhouse",
      img: "/store5.png",
      desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
      workingHours: "10am-11pm",
    },
    {
      id: 103213123448,
      title: "The Butcher's Block Steakhouse",
      rating: 5.0,
      cuisine: "Steakhouse",
      img: "/store5.png",
      desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
      workingHours: "10am-11pm",
    },
    {
      id: 103213128,
      title: "The Butcher's Block Steakhouse",
      rating: 5.0,
      cuisine: "Steakhouse",
      img: "/store5.png",
      desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
      workingHours: "10am-11pm",
    },
    {
      id: 10832131,
      title: "The Butcher's Block Steakhouse",
      rating: 5.0,
      cuisine: "Steakhouse",
      img: "/store5.png",
      desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
      workingHours: "10am-11pm",
    },
    {
      id: 1045345345348,
      title: "The Butcher's Block Steakhouse",
      rating: 5.0,
      cuisine: "Steakhouse",
      img: "/store5.png",
      desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
      workingHours: "10am-11pm",
    },
  ];

  const processedShops = shops.filter((shop) => {
    const passesSearch =
      shop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return passesSearch;
  });

  const sortedShops = [...processedShops].sort((a, b) => {
    if (currentSort === "Highest Rating") {
      return b.rating - a.rating;
    }
    if (currentSort === "Lowest Rating") {
      return a.rating - b.rating;
    }

    return 0;
  });

  return (
    <>
      <FilterBar
        onSortChange={setCurrentSort}
        onSearch={setSearchQuery}
        isSorting={true}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 auto-rows-auto w-[80%] mx-auto mb-4">
        {sortedShops.length > 0 ? (
          sortedShops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ShopCard shop={shop} index={index} />
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-primary-forground py-10">
            No products match your current search criteria.
          </p>
        )}
      </div>
    </>
  );
}
