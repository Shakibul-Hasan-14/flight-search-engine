import axios from "axios";

const AMADEUS_URL = import.meta.env.VITE_AMADEUS_BASE_URL;

let cachedToken = null;

const getAuthToken = async () => {
  if (cachedToken) return cachedToken;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", import.meta.env.VITE_AMADEUS_CLIENT_ID);
  params.append("client_secret", import.meta.env.VITE_AMADEUS_CLIENT_SECRET);

  const response = await axios.post(
    `${AMADEUS_URL}/v1/security/oauth2/token`,
    params,
  );
  cachedToken = response.data.access_token;

  // Token expires in response.data.expires_in seconds
  setTimeout(() => {
    cachedToken = null;
  }, response.data.expires_in * 1000);
  return cachedToken;
};

export const fetchFlightOffers = async (origin, destination, date) => {
  const token = await getAuthToken();
  const response = await axios.get(`${AMADEUS_URL}/v2/shopping/flight-offers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: 1,
      currencyCode: "USD",
      max: 23,
    },
  });
  return response.data.data;
};
