import { Star, MapPin, Plane } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: 'Bangkok',
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800',
    country: 'Thailand',
    rating: 4.7,
    reviews: 1825,
    tag: 'Cultural Hub',
    flightPrice: '$389',
    attractions: ['Wat Arun', 'Grand Palace', 'Floating Markets'],
  },
  {
    id: 2,
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800',
    country: 'Japan',
    rating: 4.8,
    reviews: 2275,
    tag: 'Modern Metropolis',
    flightPrice: '$649',
    attractions: ['Shibuya Crossing', 'Tokyo Tower', 'Senso-ji'],
  },
  {
    id: 3,
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800',
    country: 'France',
    rating: 4.6,
    reviews: 3120,
    tag: 'Romantic Getaway',
    flightPrice: '$429',
    attractions: ['Eiffel Tower', 'Louvre', 'Notre-Dame'],
  },
  {
    id: 4,
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800',
    country: 'USA',
    rating: 4.5,
    reviews: 1950,
    tag: 'City That Never Sleeps',
    flightPrice: '$299',
    attractions: ['Statue of Liberty', 'Central Park', 'Times Square'],
  },
  {
    id: 5,
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800',
    country: 'UAE',
    rating: 4.7,
    reviews: 1420,
    tag: 'Luxury Destination',
    flightPrice: '$589',
    attractions: ['Burj Khalifa', 'Palm Jumeirah', 'Desert Safari'],
  },
  {
    id: 6,
    name: 'Sydney',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800',
    country: 'Australia',
    rating: 4.8,
    reviews: 1780,
    tag: 'Coastal Beauty',
    flightPrice: '$799',
    attractions: ['Sydney Opera House', 'Bondi Beach', 'Harbour Bridge'],
  },
];

const PopularDestinations = () => {
  return (
    <div className="py-16 bg-gray-50 flex justify-center">
      <div className="container max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Destinations Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing places with great flight deals and unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {destination.tag}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                    <div className="flex items-center mt-1">
                      <MapPin size={16} className="text-gray-400 mr-1" />
                      <span className="text-gray-600 text-sm">{destination.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{destination.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({destination.reviews})</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Must-see attractions:</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.attractions.map((attraction, index) => (
                      <span
                        key={index}
                        className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full"
                      >
                        {attraction}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <Plane size={20} className="text-blue-600 mr-2" />
                    <span className="text-2xl font-bold text-blue-600">
                      From {destination.flightPrice}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">round trip</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDestinations;