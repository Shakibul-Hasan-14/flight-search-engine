import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  ArrowRightLeft,
  Users,
  TrendingUp,
  Plane,
} from "lucide-react";

const POPULAR_AIRPORTS = [
  { label: "New York (JFK)", code: "JFK", city: "New York", country: "USA" },
  { label: "London (LHR)", code: "LHR", city: "London", country: "UK" },
  { label: "Paris (CDG)", code: "CDG", city: "Paris", country: "France" },
  { label: "Tokyo (NRT)", code: "NRT", city: "Tokyo", country: "Japan" },
  { label: "Dubai (DXB)", code: "DXB", city: "Dubai", country: "UAE" },
  {
    label: "Singapore (SIN)",
    code: "SIN",
    city: "Singapore",
    country: "Singapore",
  },
];

const HeroSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("round");
  const [origin, setOrigin] = useState(POPULAR_AIRPORTS[0]);
  const [destination, setDestination] = useState(POPULAR_AIRPORTS[1]);
  const [departureDate, setDepartureDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    return tomorrow.toISOString().split("T")[0];
  });
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1 Adult");

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      from: origin.code,
      to: destination.code,
      date: departureDate,
      type: tripType,
    });

    if (tripType === "round" && returnDate) {
      searchParams.append("returnDate", returnDate);
    }

    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="relative bg-linear-to-br from-blue-600 to-blue-800">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What's your next destination?
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Find the best flight deals and plan your perfect journey
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            {/* Trip Type Tabs */}
            <div className="flex space-x-2 mb-6">
              {["Round Trip", "One Way", "Multi-City"].map((type) => (
                <button
                  key={type}
                  className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${
                    tripType === type.toLowerCase().replace(" ", "")
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setTripType(type.toLowerCase().replace(" ", ""))
                  }
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="space-y-6">
              {/* Route Selection */}
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
                      <Plane size={20} />
                    </div>
                    <select
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={origin.code}
                      onChange={(e) => {
                        const selected = POPULAR_AIRPORTS.find(
                          (a) => a.code === e.target.value,
                        );
                        if (selected) setOrigin(selected);
                      }}
                    >
                      {POPULAR_AIRPORTS.map((airport) => (
                        <option key={airport.code} value={airport.code}>
                          {airport.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSwap}
                  className="cursor-pointer w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors transform rotate-90 md:rotate-0"
                >
                  <ArrowRightLeft size={20} />
                </button>

                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600">
                      <Plane size={20} className="rotate-90" />
                    </div>
                    <select
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={destination.code}
                      onChange={(e) => {
                        const selected = POPULAR_AIRPORTS.find(
                          (a) => a.code === e.target.value,
                        );
                        if (selected) setDestination(selected);
                      }}
                    >
                      {POPULAR_AIRPORTS.map((airport) => (
                        <option key={airport.code} value={airport.code}>
                          {airport.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates and Passengers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Calendar size={20} />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                </div>

                {tripType === "round" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Calendar size={20} />
                      </div>
                      <input
                        type="date"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Users size={20} />
                    </div>
                    <select
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                    >
                      <option>1 Adult</option>
                      <option>2 Adults</option>
                      <option>1 Adult, 1 Child</option>
                      <option>2 Adults, 2 Children</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="cursor-pointer w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl text-lg flex items-center justify-center space-x-2 transition-all hover:shadow-lg"
              >
                <Search size={20} />
                <span>Search Flights</span>
              </button>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="text-center mt-6">
            <p className="text-blue-100">
              Popular routes today: NYC → LON from $499 • LAX → TOK from $689 •
              SIN → SYD from $429
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
