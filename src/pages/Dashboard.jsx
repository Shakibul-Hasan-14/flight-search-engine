import React, { useState } from 'react';
import { 
  Box, Container, Grid, Paper, Typography, TextField, 
  Button, Slider, FormControl, InputLabel, Select, MenuItem,
  Skeleton, Card, CardContent, Divider
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FilterListIcon from '@mui/icons-material/FilterList';

// Mock Data for initial visual setup
const MOCK_GRAPH_DATA = [
  { date: 'Jan 18', price: 240 },
  { date: 'Jan 19', price: 310 },
  { date: 'Jan 20', price: 180 },
  { date: 'Jan 21', price: 450 },
  { date: 'Jan 22', price: 290 },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([100, 1000]);

  return (
    <Box className="min-h-screen bg-gray-50 pb-10">
      {/* 1. Header & Navigation */}
      <Box className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <Typography variant="h6" className="font-bold flex items-center gap-2 text-blue-600">
          <FlightTakeoffIcon /> SkyScanner Pro
        </Typography>
        <div className="flex gap-4">
          <Button color="inherit" className="capitalize text-gray-600">My Bookings</Button>
          <Button variant="contained" className="bg-blue-600 rounded-full px-6">Login</Button>
        </div>
      </Box>

      <Container maxWidth="xl" className="mt-8">
        <Grid container spacing={3}>
          
          {/* 2. Search & Filter Sidebar (3 Columns) */}
          <Grid item xs={12} md={3}>
            <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <Typography variant="subtitle1" className="font-bold mb-4 flex items-center gap-2">
                <FilterListIcon fontSize="small" /> Filter Results
              </Typography>
              
              <div className="space-y-6">
                <TextField fullWidth label="Origin" placeholder="NYC" variant="outlined" size="small" />
                <TextField fullWidth label="Destination" placeholder="LON" variant="outlined" size="small" />
                
                <Divider />
                
                <Box>
                  <Typography variant="body2" className="text-gray-500 mb-2">Max Price: ${priceRange[1]}</Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, val) => setPriceRange(val)}
                    valueLabelDisplay="auto"
                    min={100}
                    max={2000}
                    className="text-blue-600"
                  />
                </Box>

                <FormControl fullWidth size="small">
                  <InputLabel>Stops</InputLabel>
                  <Select label="Stops" defaultValue="any">
                    <MenuItem value="any">Any Number of Stops</MenuItem>
                    <MenuItem value="0">Non-stop only</MenuItem>
                    <MenuItem value="1">1 Stop or less</MenuItem>
                  </Select>
                </FormControl>

                <Button fullWidth variant="contained" className="bg-blue-600 py-3 shadow-md hover:bg-blue-700">
                  Search Flights
                </Button>
              </div>
            </Paper>
          </Grid>

          {/* 3. Main Content: Graph & Results (9 Columns) */}
          <Grid item xs={12} md={9}>
            
            {/* Price Trend Graph */}
            <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <Typography variant="subtitle1" className="font-bold mb-4">Price Trends (Next 5 Days)</Typography>
              <Box className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_GRAPH_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="price" radius={[4, 4, 0, 0]} barSize={40}>
                      {MOCK_GRAPH_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.price > 300 ? '#94a3b8' : '#2563eb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* Flight Results List */}
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                <Typography variant="h6" className="font-bold text-gray-800">Available Flights</Typography>
                <Typography variant="body2" className="text-gray-500">Showing 128 results</Typography>
              </div>

              {loading ? (
                // Skeleton Loading State
                [1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={120} className="rounded-xl mb-4" />)
              ) : (
                // Flight Card Placeholder
                <Card className="rounded-2xl shadow-none border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">AA</div>
                      <div>
                        <Typography className="font-bold">10:45 AM — 1:30 PM</Typography>
                        <Typography variant="body2" className="text-gray-500">American Airlines</Typography>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Typography className="font-medium">5h 45m</Typography>
                      <Divider className="w-16 mx-auto my-1" />
                      <Typography variant="caption" className="text-green-600 font-bold uppercase tracking-wider">Non-stop</Typography>
                    </div>

                    <div className="text-right">
                      <Typography variant="h5" className="font-bold text-blue-600">$428</Typography>
                      <Button variant="outlined" size="small" className="mt-2 rounded-full capitalize">View Deal</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;