import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchFlightOffers } from "../api/amadeus";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Bar,
  Cell,
  XAxis,
  YAxis,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  X,
  Plane,
  Filter,
  Luggage,
  Bookmark,
  Calendar,
  ChevronUp,
  TrendingUp,
  ArrowRightLeft,
} from "lucide-react";

const POPULAR_AIRPORTS = [
  { label: "Paris (CDG)", code: "CDG" },
  { label: "Dhaka (DAC)", code: "DAC" },
  { label: "Dubai (DXB)", code: "DXB" },
  { label: "Tokyo (NRT)", code: "NRT" },
  { label: "London (LHR)", code: "LHR" },
  { label: "New York (JFK)", code: "JFK" },
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Data States
  const [error, setError] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dictionaries, setDictionaries] = useState({
    carriers: {},
    aircraft: {},
  });
  const [bookmarkedFlights, setBookmarkedFlights] = useState(new Set());

  // Live Network Filters
  const [origin, setOrigin] = useState(() => {
    const from = searchParams.get("from");
    return (
      POPULAR_AIRPORTS.find((airport) => airport.code === from) ||
      POPULAR_AIRPORTS[0]
    );
  });

  const [dest, setDest] = useState(() => {
    const to = searchParams.get("to");
    return (
      POPULAR_AIRPORTS.find((airport) => airport.code === to) ||
      POPULAR_AIRPORTS[1]
    );
  });

  const [date, setDate] = useState(searchParams.get("date") || "2026-05-15");

  // Live UI Filters
  const [sortBy, setSortBy] = useState("price_asc");
  const [directOnly, setDirectOnly] = useState(false);
  const [stopFilter, setStopFilter] = useState("any");
  const [cabinClass, setCabinClass] = useState("all");
  const [baggageFilter, setBaggageFilter] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [durationFilter, setDurationFilter] = useState([0, 24]);

  // Available airlines
  const [availableAirlines, setAvailableAirlines] = useState([]);

  // Swap route
  const swapRoute = useCallback(() => {
    const temp = origin;
    setOrigin(dest);
    setDest(temp);
  }, [origin, dest]);

  // Toggle bookmark
  const toggleBookmark = useCallback((flightId) => {
    setBookmarkedFlights((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(flightId)) {
        newSet.delete(flightId);
      } else {
        newSet.add(flightId);
      }
      return newSet;
    });
  }, []);

  // Fetch flights
  useEffect(() => {
    const fetchFlights = async () => {
      if (!origin?.code || !dest?.code || !date) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetchFlightOffers(origin.code, dest.code, date);
        const flightData = response.data || response;
        const flightDict = response.dictionaries || {
          carriers: {},
          aircraft: {},
        };

        setFlights(Array.isArray(flightData) ? flightData : []);
        setDictionaries(flightDict);

        if (flightData?.length > 0) {
          const airlines = [
            ...new Set(
              flightData
                .map((f) => f.validatingAirlineCodes?.[0])
                .filter(Boolean),
            ),
          ];
          setAvailableAirlines(airlines);
          setSelectedAirlines(airlines);

          const prices = flightData.map((f) => parseFloat(f.price.total));
          if (prices.length > 0) {
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange([minPrice, maxPrice]);
          }
        }
      } catch (err) {
        setError("Failed to fetch flights. Please try again.");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFlights, 500);
    return () => clearTimeout(debounceTimer);
  }, [origin, dest, date]);

  // Process flights with all filters
  const processedFlights = useMemo(() => {
    let result = flights.filter((flight) => {
      const price = parseFloat(flight.price?.total || 0);
      const segments = flight.itineraries?.[0]?.segments || [];
      const airlineCode = flight.validatingAirlineCodes?.[0];
      const cabin =
        flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ||
        "ECONOMY";
      const baggage =
        flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
          ?.includedCheckedBags?.quantity || 0;

      const duration = flight.itineraries?.[0]?.duration || "PT0H";
      const hours = parseInt(duration.match(/(\d+)H/)?.[1] || 0);
      const minutes = parseInt(duration.match(/(\d+)M/)?.[1] || 0);
      const totalHours = hours + minutes / 60;

      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (directOnly && segments.length > 1) return false;
      if (stopFilter === "direct" && segments.length > 1) return false;
      if (stopFilter === "1" && segments.length > 2) return false;
      if (stopFilter === "2" && segments.length > 3) return false;
      if (
        selectedAirlines.length > 0 &&
        !selectedAirlines.includes(airlineCode)
      )
        return false;
      if (totalHours < durationFilter[0] || totalHours > durationFilter[1])
        return false;
      if (cabinClass !== "all" && cabin !== cabinClass.toUpperCase())
        return false;
      if (baggage < baggageFilter) return false;

      return true;
    });

    switch (sortBy) {
      case "price_asc":
        result.sort(
          (a, b) => parseFloat(a.price.total) - parseFloat(b.price.total),
        );
        break;
      case "price_desc":
        result.sort(
          (a, b) => parseFloat(b.price.total) - parseFloat(a.price.total),
        );
        break;
      case "duration_asc":
        result.sort((a, b) => {
          const durA = a.itineraries[0]?.duration || "PT0H";
          const durB = b.itineraries[0]?.duration || "PT0H";
          return durA.localeCompare(durB);
        });
        break;
      case "departure_asc":
        result.sort((a, b) => {
          const timeA = new Date(
            a.itineraries[0]?.segments?.[0]?.departure?.at || 0,
          );
          const timeB = new Date(
            b.itineraries[0]?.segments?.[0]?.departure?.at || 0,
          );
          return timeA - timeB;
        });
        break;
    }

    return result;
  }, [
    flights,
    priceRange,
    directOnly,
    stopFilter,
    selectedAirlines,
    durationFilter,
    cabinClass,
    baggageFilter,
    sortBy,
  ]);

  // Graph data
  const graphData = useMemo(() => {
    return processedFlights.slice(0, 10).map((flight, index) => ({
      name: `F${index + 1}`,
      price: parseFloat(flight.price.total),
      airline: flight.validatingAirlineCodes?.[0] || "Unknown",
      stops: flight.itineraries[0].segments.length - 1,
    }));
  }, [processedFlights]);

  // Statistics
  const stats = useMemo(() => {
    const prices = processedFlights.map((f) => parseFloat(f.price.total));
    return {
      count: processedFlights.length,
      minPrice: prices.length > 0 ? Math.min(...prices).toFixed(2) : "0",
      maxPrice: prices.length > 0 ? Math.max(...prices).toFixed(2) : "0",
      avgPrice:
        prices.length > 0
          ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
          : "0",
      directCount: processedFlights.filter(
        (f) => f.itineraries[0].segments.length === 1,
      ).length,
    };
  }, [processedFlights]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setPriceRange([0, 5000]);
    setDirectOnly(false);
    setStopFilter("any");
    setSelectedAirlines(availableAirlines);
    setDurationFilter([0, 24]);
    setCabinClass("all");
    setBaggageFilter(0);
    setSortBy("price_asc");
  }, [availableAirlines]);

  // Filter drawer
  const FilterDrawer = () => (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setMobileFiltersOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Filters</h3>
            <button onClick={() => setMobileFiltersOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <FiltersContent />
        </div>
      </div>
    </div>
  );

  // Filters content
  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Price Range</label>
          <span className="text-blue-600 font-semibold">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], parseInt(e.target.value)])
          }
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>$0</span>
          <span>$10,000</span>
        </div>
      </div>

      {/* Stops */}
      <div>
        <label className="font-medium block mb-2">Stops</label>
        <div className="grid grid-cols-2 gap-2">
          {["Any", "Non-stop", "1 stop max", "2 stops max"].map((option) => (
            <button
              key={option}
              className={`px-3 py-2 rounded-lg border ${
                stopFilter === option.toLowerCase().replace(" ", "")
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() =>
                setStopFilter(option.toLowerCase().replace(" ", ""))
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Flights */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="directOnly"
          checked={directOnly}
          onChange={(e) => setDirectOnly(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label htmlFor="directOnly" className="ml-2">
          Direct flights only
        </label>
      </div>

      {/* Airlines */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Airlines</label>
          <span className="text-sm text-gray-500">
            {selectedAirlines.length}/{availableAirlines.length}
          </span>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableAirlines.map((airlineCode) => (
            <div key={airlineCode} className="flex items-center">
              <input
                type="checkbox"
                id={`airline-${airlineCode}`}
                checked={selectedAirlines.includes(airlineCode)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAirlines([...selectedAirlines, airlineCode]);
                  } else {
                    setSelectedAirlines(
                      selectedAirlines.filter((code) => code !== airlineCode),
                    );
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor={`airline-${airlineCode}`} className="ml-2">
                {dictionaries.carriers?.[airlineCode] || airlineCode}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="font-medium block mb-2">
          Duration: {durationFilter[0]}h - {durationFilter[1]}h
        </label>
        <input
          type="range"
          min="0"
          max="48"
          step="1"
          value={durationFilter[1]}
          onChange={(e) =>
            setDurationFilter([durationFilter[0], parseInt(e.target.value)])
          }
          className="w-full"
        />
      </div>

      {/* Cabin Class */}
      <div>
        <label className="font-medium block mb-2">Cabin Class</label>
        <select
          value={cabinClass}
          onChange={(e) => setCabinClass(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Classes</option>
          <option value="economy">Economy</option>
          <option value="premium_economy">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First</option>
        </select>
      </div>

      {/* Baggage */}
      <div>
        <label className="font-medium block mb-2">
          Minimum Baggage: {baggageFilter}
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="1"
          value={baggageFilter}
          onChange={(e) => setBaggageFilter(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Sort By */}
      <div>
        <label className="font-medium block mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="duration_asc">Duration: Shortest First</option>
          <option value="departure_asc">Departure: Earliest First</option>
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
      >
        <ChevronUp size={16} className="mr-2" />
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex justify-center">
        <div className="container max-w-6xl px-4 py-6">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Plane
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600"
                />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl"
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

              <div className="flex justify-center">
                <button
                  onClick={swapRoute}
                  className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                >
                  <ArrowRightLeft size={20} className="mx-auto" />
                </button>
              </div>

              <div className="relative">
                <Plane
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 rotate-90"
                />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl"
                  value={dest.code}
                  onChange={(e) => {
                    const selected = POPULAR_AIRPORTS.find(
                      (a) => a.code === e.target.value,
                    );
                    if (selected) setDest(selected);
                  }}
                >
                  {POPULAR_AIRPORTS.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Calendar
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700"
              >
                New Search
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-1/4">
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Filters</h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ChevronUp size={16} className="inline mr-1" />
                      Reset
                    </button>
                  </div>
                  <FiltersContent />

                  {/* Stats */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-bold mb-4">Search Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Flights</span>
                        <span className="font-semibold">{stats.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Range</span>
                        <span className="font-semibold">
                          ${stats.minPrice} - ${stats.maxPrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Direct Options</span>
                        <span className="font-semibold">
                          {stats.directCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Price</span>
                        <span className="font-semibold">${stats.avgPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="space-y-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-gray-600 text-sm">Available Flights</p>
                    <p className="text-2xl font-bold">{stats.count}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-gray-600 text-sm">From</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${stats.minPrice}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-gray-600 text-sm">Direct Flights</p>
                    <p className="text-2xl font-bold">{stats.directCount}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-gray-600 text-sm">Avg Price</p>
                    <p className="text-2xl font-bold">${stats.avgPrice}</p>
                  </div>
                </div>

                {/* Live Price Graph */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <TrendingUp size={24} className="text-blue-600 mr-2" />
                      <div>
                        <h3 className="text-xl font-bold">
                          Live Price Distribution
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Updates instantly with filters
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <RechartsTooltip
                          formatter={(value) => [`$${value}`, "Price"]}
                          labelFormatter={(label, payload) =>
                            payload[0]?.payload.airline || label
                          }
                        />
                        <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                          {graphData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={
                                entry.price ===
                                Math.min(...graphData.map((d) => d.price))
                                  ? "#10B981"
                                  : "#3B82F6"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    Available Flights ({processedFlights.length})
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <Filter size={16} className="mr-2" />
                    Filters
                  </button>
                </div>

                {/* Results */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl shadow p-6 animate-pulse"
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : processedFlights.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No flights found
                    </h3>
                    <p className="text-gray-500">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {processedFlights.map((flight) => (
                      <FlightCard
                        key={flight.id}
                        flight={flight}
                        dict={dictionaries}
                        isBookmarked={bookmarkedFlights.has(flight.id)}
                        onBookmark={() => toggleBookmark(flight.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && <FilterDrawer />}

        {/* Mobile Filter FAB */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Filter size={24} />
        </button>
      </div>
      
      <Footer />
    </div>
  );
};

// Flight Card Component
const FlightCard = ({ flight, dict, isBookmarked, onBookmark }) => {
  const itinerary = flight.itineraries[0];
  const segments = itinerary.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const airlineCode = flight.validatingAirlineCodes[0];
  const airline = dict.carriers?.[airlineCode] || airlineCode;
  const baggage =
    flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags
      ?.quantity || 0;
  const cabin = flight.travelerPricings[0].fareDetailsBySegment[0].cabin;

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Airline Info */}
        <div className="md:w-1/4 mb-4 md:mb-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              {airlineCode?.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold">{airline}</h4>
              <div className="flex space-x-2 mt-1">
                <span className="text-xs border border-gray-300 px-2 py-1 rounded-full">
                  {cabin}
                </span>
                <span className="text-xs border border-gray-300 px-2 py-1 rounded-full flex items-center">
                  <Luggage size={12} className="mr-1" />
                  {baggage}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                segments.length === 1
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {segments.length === 1 ? "Direct" : `${segments.length - 1} stop`}
            </span>
            <button
              onClick={onBookmark}
              className="text-gray-400 hover:text-yellow-400"
            >
              {isBookmarked ? (
                <Bookmark size={16} className="fill-current text-yellow-400" />
              ) : (
                <Bookmark size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Flight Times */}
        <div className="md:w-2/4 mb-4 md:mb-0">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatTime(firstSegment.departure.at)}
              </div>
              <div className="text-gray-600 text-sm">
                {firstSegment.departure.iataCode}
              </div>
            </div>

            <div className="flex-1 px-4">
              <div className="text-center text-gray-500 text-sm mb-2">
                {itinerary.duration.substring(2)}
              </div>
              <div className="relative">
                <div className="border-t border-gray-300"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <Plane size={16} className="text-blue-600" />
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                  <Plane size={16} className="text-blue-600 rotate-90" />
                </div>
              </div>
              <div className="text-center text-gray-500 text-sm mt-2">
                {segments.length === 1
                  ? "Non-stop"
                  : `${segments.length - 1} connection`}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatTime(lastSegment.arrival.at)}
              </div>
              <div className="text-gray-600 text-sm">
                {lastSegment.arrival.iataCode}
              </div>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="md:w-1/4">
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              ${flight.price.total}
            </div>
            <div className="text-gray-500 text-sm mb-4">
              per passenger • Includes taxes
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl">
              Select Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
