import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Slider,
  Skeleton,
  Card,
  CardContent,
  Divider,
  Autocomplete,
  Chip,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  IconButton,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  FlightTakeoff,
  TrendingUp,
  FilterList,
  History,
  Luggage,
  AccessTime,
  SwapHoriz,
  ErrorOutline,
} from "@mui/icons-material";
import { fetchFlightOffers } from "../api/amadeus";

const POPULAR_AIRPORTS = [
  { label: "New York (JFK)", code: "JFK" },
  { label: "London (LHR)", code: "LHR" },
  { label: "Paris (CDG)", code: "CDG" },
  { label: "Dhaka (DAC)", code: "DAC" },
  { label: "Dubai (DXB)", code: "DXB" },
  { label: "Tokyo (NRT)", code: "NRT" },
];

const Dashboard = () => {
  // Data States
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dictionaries, setDictionaries] = useState({
    carriers: {},
    aircraft: {},
  });

  // 1. LIVE NETWORK FILTERS (Triggers API)
  const [origin, setOrigin] = useState(POPULAR_AIRPORTS[0]);
  const [dest, setDest] = useState(POPULAR_AIRPORTS[1]);
  const [date, setDate] = useState("2026-05-15");

  // 2. LIVE UI FILTERS (Local Logic)
  const [priceRange, setPriceRange] = useState(5000);
  const [directOnly, setDirectOnly] = useState(false);
  const [sortBy, setSortBy] = useState("price");

  // REVERSE ROUTE HANDLER
  const swapRoute = () => {
    const temp = origin;
    setOrigin(dest);
    setDest(temp);
  };

  // EFFECT: LIVE DATA FETCHING WITH DEBOUNCE
  useEffect(() => {
    const triggerLiveSearch = async () => {
      if (!origin || !dest || !date) return;
      if (origin.code === dest.code) {
        setError("Origin and Destination cannot be the same.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchFlightOffers(origin.code, dest.code, date);
        // Handle different API wrapper structures
        const flightData = response.data || response;
        const flightDict = response.dictionaries || {
          carriers: {},
          aircraft: {},
        };

        setFlights(Array.isArray(flightData) ? flightData : []);
        setDictionaries(flightDict);

        // Adjust price slider to new results
        if (flightData?.length > 0) {
          const max = Math.max(
            ...flightData.map((f) => parseFloat(f.price.total)),
          );
          setPriceRange(Math.ceil(max));
        }
      } catch (err) {
        setError("Failed to fetch live updates. Please try a different route.");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => triggerLiveSearch(), 600);
    return () => clearTimeout(debounceTimer);
  }, [origin, dest, date]);

  // LOCAL FILTERING LOGIC
  const processedFlights = useMemo(() => {
    let result = [...flights].filter((f) => {
      const isUnderPrice = parseFloat(f.price.total) <= priceRange;
      const isDirect = directOnly
        ? f.itineraries[0].segments.length === 1
        : true;
      return isUnderPrice && isDirect;
    });

    if (sortBy === "price") {
      result.sort(
        (a, b) => parseFloat(a.price.total) - parseFloat(b.price.total),
      );
    } else if (sortBy === "duration") {
      result.sort((a, b) =>
        a.itineraries[0].duration.localeCompare(b.itineraries[0].duration),
      );
    }
    return result;
  }, [flights, priceRange, directOnly, sortBy]);

  // GRAPH DATA
  const graphData = useMemo(() => {
    return processedFlights.slice(0, 12).map((f, i) => ({
      name: `F${i + 1}`,
      price: parseFloat(f.price.total),
    }));
  }, [processedFlights]);

  return (
    <Box className="min-h-screen bg-[#F1F5F9] pb-12">
      {/* HEADER */}
      <Box className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Typography
          variant="h6"
          className="font-black text-blue-600 flex items-center gap-2"
        >
          <FlightTakeoff className="rotate-45" /> SKYFLOW{" "}
          <Chip
            label="LIVE"
            size="small"
            color="primary"
            sx={{ fontWeight: 900 }}
          />
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {loading && (
            <Typography
              variant="caption"
              className="animate-pulse font-bold text-blue-500 uppercase"
            >
              Updating Data...
            </Typography>
          )}
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
        </Stack>
      </Box>

      <Container maxWidth="xl" className="mt-8">
        <Grid container spacing={4}>
          {/* SIDEBAR */}
          <Grid item xs={12} md={4} lg={3}>
            <Stack spacing={4} className="sticky top-24">
              <Paper className="p-6 rounded-[2rem] shadow-sm border border-slate-200 space-y-6">
                <Typography
                  variant="caption"
                  className="font-black text-slate-400 uppercase tracking-widest"
                >
                  Route Selection
                </Typography>

                <Stack spacing={2} className="relative">
                  <Autocomplete
                    options={POPULAR_AIRPORTS}
                    value={origin}
                    onChange={(e, v) => v && setOrigin(v)}
                    renderInput={(params) => (
                      <TextField {...params} label="From" variant="filled" />
                    )}
                  />
                  <Box className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <IconButton
                      onClick={swapRoute}
                      className="bg-white shadow-md hover:bg-blue-50 border border-slate-100"
                    >
                      <SwapHoriz className="text-blue-600" />
                    </IconButton>
                  </Box>
                  <Autocomplete
                    options={POPULAR_AIRPORTS}
                    value={dest}
                    onChange={(e, v) => v && setDest(v)}
                    renderInput={(params) => (
                      <TextField {...params} label="To" variant="filled" />
                    )}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    variant="filled"
                    label="Travel Date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <Divider />

                <Box className="space-y-4">
                  <Typography
                    variant="caption"
                    className="font-black text-slate-400 uppercase tracking-widest block"
                  >
                    Live Filters
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={directOnly}
                        onChange={(e) => setDirectOnly(e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant="body2" className="font-bold">
                        Non-Stop Only
                      </Typography>
                    }
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      className="font-bold text-slate-500 flex justify-between mb-1"
                    >
                      <span>Max Budget</span>
                      <span className="text-blue-600">${priceRange}</span>
                    </Typography>
                    <Slider
                      value={priceRange}
                      min={100}
                      max={5000}
                      onChange={(e, v) => setPriceRange(v)}
                    />
                  </Box>
                  <FormControl fullWidth variant="filled" size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="price">Lowest Price</MenuItem>
                      <MenuItem value="duration">Fastest Flight</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* MAIN CONTENT */}
          <Grid item xs={12} md={8} lg={9}>
            {/* PRICE CHART */}
            <Paper className="p-8 rounded-[2rem] border border-slate-200 mb-8 bg-white shadow-sm">
              <Typography
                variant="subtitle1"
                className="font-black mb-6 flex items-center gap-2"
              >
                <TrendingUp className="text-blue-600" /> Real-time Price
                Distribution
              </Typography>
              <Box className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis dataKey="name" hide />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="price" radius={[8, 8, 8, 8]} barSize={35}>
                      {graphData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.price ===
                            Math.min(...graphData.map((d) => d.price))
                              ? "#2563eb"
                              : "#cbd5e1"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* RESULTS FEED */}
            <Box className="space-y-4">
              {error && (
                <Paper className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                  <ErrorOutline color="error" />
                  <Typography
                    variant="body2"
                    color="error"
                    className="font-bold"
                  >
                    {error}
                  </Typography>
                </Paper>
              )}

              {loading
                ? [1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      variant="rounded"
                      height={140}
                      className="rounded-[2rem] mb-4"
                    />
                  ))
                : processedFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      dict={dictionaries}
                    />
                  ))}

              {!loading && processedFlights.length === 0 && !error && (
                <Box className="text-center py-24 opacity-40">
                  <History sx={{ fontSize: 80 }} />
                  <Typography variant="h6" className="font-black mt-4">
                    No flights fit your criteria
                  </Typography>
                  <Typography variant="body2">
                    Try adjusting your filters or search route.
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// COMPONENT: CARD
const FlightCard = ({ flight, dict }) => {
  const itinerary = flight.itineraries[0];
  const first = itinerary.segments[0];
  const last = itinerary.segments[itinerary.segments.length - 1];

  const airline =
    dict.carriers?.[flight.validatingAirlineCodes[0]] ||
    flight.validatingAirlineCodes[0];
  const baggage =
    flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags
      ?.quantity || 0;

  return (
    <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-8">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {flight.validatingAirlineCodes[0]}
              </div>
              <Box>
                <Typography className="font-black leading-none mb-1">
                  {airline}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-slate-400 font-bold uppercase"
                >
                  {flight.travelerPricings[0].fareDetailsBySegment[0].cabin}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="flex justify-between items-center text-center">
              <Box>
                <Typography variant="h5" className="font-black">
                  {first.departure.at.split("T")[1].substring(0, 5)}
                </Typography>
                <Typography
                  variant="caption"
                  className="font-bold text-slate-400"
                >
                  {first.departure.iataCode}
                </Typography>
              </Box>

              <Box className="flex-1 px-4">
                <Typography
                  variant="caption"
                  className="font-black text-slate-300 uppercase tracking-widest"
                >
                  {itinerary.duration.substring(2)}
                </Typography>
                <Divider>
                  <FlightTakeoff
                    sx={{ fontSize: 14, color: "#cbd5e1" }}
                    className="rotate-90"
                  />
                </Divider>
                <Typography
                  variant="caption"
                  className={`font-black uppercase ${itinerary.segments.length === 1 ? "text-green-500" : "text-orange-400"}`}
                >
                  {itinerary.segments.length === 1
                    ? "Non-Stop"
                    : `${itinerary.segments.length - 1} Stop`}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" className="font-black">
                  {last.arrival.at.split("T")[1].substring(0, 5)}
                </Typography>
                <Typography
                  variant="caption"
                  className="font-bold text-slate-400"
                >
                  {last.arrival.iataCode}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={3}
            className="md:border-l border-slate-100 flex flex-col items-center md:items-end"
          >
            <Typography variant="h4" className="font-black text-blue-600">
              ${flight.price.total}
            </Typography>
            <Stack direction="row" spacing={1} className="mb-3">
              <Chip
                icon={<Luggage fontSize="small" />}
                label={baggage > 0 ? baggage : "0"}
                size="small"
              />
              <Chip
                label="Select"
                className="font-bold bg-slate-900 text-white"
                clickable
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
