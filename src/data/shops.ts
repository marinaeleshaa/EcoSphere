export interface IReview {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface IShop {
  id: number;
  title: string;
  shopName?: string;
  address?: string;
  rating: number;
  cuisine: string;
  img: string;
  desc: string;
  workingHours: string;
  reviews?: IReview[];
}

export const shops: IShop[] = [
  {
    id: 101,
    title: "The Green Fork Bistro",
    shopName: "Green Store",
    rating: 4.7,
    cuisine: "Vegan & Organic",
    img: "/store5.png",
    desc: "Fresh, seasonal ingredients prepared with a focus on sustainable and plant-based dishes. Known for their homemade pasta.",
    workingHours: "10am-11pm",
    address: "12 Evergreen Ave, Springfield",
    reviews: [
      {
        id: 1,
        userName: "Sarah Johnson",
        rating: 5,
        comment:
          "Absolutely amazing! The food is fresh, healthy, and delicious. The staff is friendly and the atmosphere is perfect for a relaxing meal.",
        date: "2 weeks ago",
      },
      {
        id: 2,
        userName: "Michael Chen",
        rating: 4,
        comment:
          "Great vegan options with excellent flavor. The pasta dishes are particularly good. Would definitely come back!",
        date: "1 month ago",
      },
      {
        id: 3,
        userName: "Emily Rodriguez",
        rating: 5,
        comment:
          "Best vegan restaurant in town! The ingredients are organic and the presentation is beautiful. Highly recommend!",
        date: "3 weeks ago",
      },
      {
        id: 4,
        userName: "David Thompson",
        rating: 4,
        comment:
          "Good food and service. The portions are generous and the prices are reasonable for organic food.",
        date: "2 months ago",
      },
    ],
  },
  {
    id: 102,
    title: "Samurai Sushi House",
    shopName: "Tech Hub",
    rating: 4.9,
    cuisine: "Japanese",
    img: "/store5.png",
    desc: "Authentic Edo-style sushi and premium sashimi flown in daily. Perfect for a high-end, classic experience.",
    workingHours: "10am-11pm",
    address: "88 Sakura St, Springfield",
    reviews: [
      {
        id: 5,
        userName: "James Wilson",
        rating: 5,
        comment:
          "Outstanding sushi! The quality is exceptional and the chef's selection is always perfect. A true culinary experience.",
        date: "1 week ago",
      },
      {
        id: 6,
        userName: "Lisa Anderson",
        rating: 5,
        comment:
          "The freshest sashimi I've ever had. The presentation is beautiful and the service is impeccable. Worth every penny!",
        date: "2 weeks ago",
      },
      {
        id: 7,
        userName: "Robert Martinez",
        rating: 4,
        comment:
          "Excellent Japanese cuisine. The sushi rolls are creative and delicious. Great place for a special occasion.",
        date: "3 weeks ago",
      },
    ],
  },
  {
    id: 103,
    title: "Mama Mia's Pizzeria",
    shopName: "Fashion Point",
    rating: 4.2,
    cuisine: "Italian",
    img: "/store5.png",
    desc: "Family-owned spot serving wood-fired pizzas and hearty Italian comfort food. Great for large groups and delivery.",
    workingHours: "10am-11pm",
    address: "55 Roma Blvd, Springfield",
    reviews: [
      {
        id: 8,
        userName: "Maria Garcia",
        rating: 5,
        comment:
          "Authentic Italian pizza with a perfect crispy crust! The family atmosphere makes it feel like home. Love this place!",
        date: "5 days ago",
      },
      {
        id: 9,
        userName: "John Smith",
        rating: 4,
        comment:
          "Great pizza and pasta. The wood-fired oven gives it that authentic taste. Good for family dinners.",
        date: "1 week ago",
      },
      {
        id: 10,
        userName: "Patricia Brown",
        rating: 4,
        comment:
          "Delicious food and friendly service. The portions are generous and the prices are fair. Highly recommend!",
        date: "2 weeks ago",
      },
    ],
  },
  {
    id: 104,
    title: "Chai & Spice Indian Kitchen",
    shopName: "Book World",
    rating: 4.5,
    cuisine: "Indian",
    img: "/store5.png",
    desc: "Vibrant and aromatic Northern Indian cuisine. Specialties include Butter Chicken and fresh Garlic Naan.",
    workingHours: "10am-11pm",
    address: "310 Spice Lane, Springfield",
  },
  {
    id: 105,
    title: "Coastal Catch Seafood",
    shopName: "Toy Land",
    rating: 3.8,
    cuisine: "Seafood",
    img: "/store5.png",
    desc: "Casual joint famous for its fried fish baskets and clam chowder. Located near the marina.",
    workingHours: "10am-11pm",
    address: "7 Harbor Rd, Springfield",
  },
  {
    id: 106,
    title: "El Fuego Mexican Grill",
    shopName: "Green Store",
    rating: 4.6,
    cuisine: "Mexican",
    img: "/store5.png",
    desc: "Taco Tuesdays and strong margaritas! Serving authentic street tacos and generous burrito bowls.",
    workingHours: "10am-11pm",
    address: "44 Cactus Ave, Springfield",
  },
  {
    id: 107,
    title: "The Corner Coffee Bar",
    shopName: "Tech Hub",
    rating: 4.4,
    cuisine: "Café/Breakfast",
    img: "/store5.png",
    desc: "Artisan coffee, fresh pastries, and light breakfast fare. A cozy spot perfect for remote work or a quick meeting.",
    workingHours: "10am-11pm",
    address: "3 Maple St, Springfield",
  },
  {
    id: 108,
    title: "The Butcher's Block Steakhouse",
    shopName: "Fashion Point",
    rating: 5.0,
    cuisine: "Steakhouse",
    img: "/store5.png",
    desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
    workingHours: "10am-11pm",
    address: "900 Prime Cut Rd, Springfield",
  },
  {
    id: 103213123448,
    title: "The Butcher's Block Steakhouse",
    shopName: "Book World",
    rating: 5.0,
    cuisine: "Steakhouse",
    img: "/store5.png",
    desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
    workingHours: "10am-11pm",
    address: "901 Prime Cut Rd, Springfield",
  },
  {
    id: 103213128,
    title: "The Butcher's Block Steakhouse",
    shopName: "Toy Land",
    rating: 5.0,
    cuisine: "Steakhouse",
    img: "/store5.png",
    desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
    workingHours: "10am-11pm",
    address: "902 Prime Cut Rd, Springfield",
  },
  {
    id: 10832131,
    title: "The Butcher's Block Steakhouse",
    shopName: "Green Store",
    rating: 5.0,
    cuisine: "Steakhouse",
    img: "/store5.png",
    desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
    workingHours: "10am-11pm",
    address: "903 Prime Cut Rd, Springfield",
  },
  {
    id: 1045345345348,
    title: "The Butcher's Block Steakhouse",
    shopName: "Tech Hub",
    rating: 5.0,
    cuisine: "Steakhouse",
    img: "/store5.png",
    desc: "The city's finest cuts of dry-aged beef and an award-winning wine list. Reservations highly recommended.",
    workingHours: "10am-11pm",
    address: "904 Prime Cut Rd, Springfield",
  },
];
