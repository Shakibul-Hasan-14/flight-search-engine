import { Star, Clock, Plane, Hotel, Utensils, Ticket } from "lucide-react";

const packages = [
  {
    id: 1,
    title: "Tokyo Cultural Experience",
    duration: "7 Days",
    flights: "Round-trip included",
    hotels: "4-star accommodation",
    meals: "Breakfast daily",
    activities: "Guided tours included",
    price: "$1,899",
    savings: "Save $300",
    rating: 4.8,
    tag: "Best Seller",
    features: ["Temple visits", "Sushi making class", "Mt. Fuji tour"],
  },
  {
    id: 2,
    title: "Paris Romantic Getaway",
    duration: "5 Days",
    flights: "Direct flights",
    hotels: "Boutique hotel",
    meals: "3 dinners included",
    activities: "River cruise ticket",
    price: "$1,499",
    savings: "Save $200",
    rating: 4.7,
    tag: "Romantic",
    features: ["Eiffel Tower access", "Louvre tickets", "Wine tasting"],
  },
  {
    id: 3,
    title: "Bali Luxury Retreat",
    duration: "8 Days",
    flights: "Business class upgrade",
    hotels: "5-star villa",
    meals: "All-inclusive",
    activities: "Spa treatments",
    price: "$2,999",
    savings: "Save $500",
    rating: 4.9,
    tag: "Luxury",
    features: ["Private pool", "Yoga sessions", "Beachfront dining"],
  },
  {
    id: 4,
    title: "New York City Adventure",
    duration: "4 Days",
    flights: "Economy class",
    hotels: "Central location",
    meals: "2 lunches included",
    activities: "Broadway show ticket",
    price: "$999",
    savings: "Save $150",
    rating: 4.6,
    tag: "City Break",
    features: ["Statue of Liberty tour", "Museum passes", "Shopping discount"],
  },
];

const PopularPackages = () => {
  return (
    <div className="py-16 bg-white flex justify-center">
      <div className="container max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Curated Travel Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All-in-one packages with flights, hotels, and experiences for the
            perfect vacation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative p-6">
                {pkg.tag && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {pkg.tag}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.title}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Star
                        size={16}
                        className="text-yellow-400 fill-current mr-1"
                      />
                      <span className="text-sm font-semibold">
                        {pkg.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Plane size={18} className="text-blue-600 mr-3" />
                    <span className="text-gray-700 text-sm">{pkg.flights}</span>
                  </div>
                  <div className="flex items-center">
                    <Hotel size={18} className="text-blue-600 mr-3" />
                    <span className="text-gray-700 text-sm">{pkg.hotels}</span>
                  </div>
                  <div className="flex items-center">
                    <Utensils size={18} className="text-blue-600 mr-3" />
                    <span className="text-gray-700 text-sm">{pkg.meals}</span>
                  </div>
                  <div className="flex items-center">
                    <Ticket size={18} className="text-blue-600 mr-3" />
                    <span className="text-gray-700 text-sm">
                      {pkg.activities}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">
                    Package includes:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {pkg.price}
                      </div>
                      <div className="text-green-600 text-sm font-semibold">
                        {pkg.savings}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">per person</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
                    View Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularPackages;
