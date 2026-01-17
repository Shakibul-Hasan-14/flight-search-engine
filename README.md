# Flight Search Engine | Advanced Flight Search Dashboard

A high-performance, responsive flight search engine built with **React**, **Material UI (MUI)**, and the **Amadeus Self-Service API**. This project demonstrates complex data management, real-time filtering, and interactive data visualization.

**[Live Demo Link]** | **[Loom Walkthrough]**

## Key Features

### 1. Advanced Data Grid (MUI)

Designed to align with the core product needs of the team.

- **Complex Filtering:** Simultaneous filtering by price, stops, and airlines with instant UI updates.
- **Custom Cell Renderers:** Visual cues for flight duration and airline branding.
- **Responsive Layout:** Seamless transition from a dense data grid on desktop to a touch-friendly card view on mobile.

### 2. Live Price Analysis (Recharts)

- **Real-time Synchronization:** An interactive bar chart showing price trends that updates instantly as search filters are applied.
- **Dynamic Scaling:** Automatically adjusts axes based on the filtered dataset to provide clear visual insights.

### 3. Optimized API Integration

- **Amadeus API:** Robust integration with the Self-Service flight offer search.
- **Loading States:** Implementation of MUI Skeletons to reduce perceived latency and improve UX.
- **Error Handling:** Graceful handling of API limits, empty states, and network errors.

## Tech Stack

- **Framework:** React
- **Styling & UI:** Material UI (MUI) and Tailwind CSS
- **State Management:** React Query for efficient caching and server-state sync.
- **Data Viz:** Recharts
- **HTTP Client:** Axios with interceptors for Amadeus OAuth2 token management.

## Engineering Decisions

- **MUI over Tailwind:** While I am proficient in Tailwind, I chose MUI for this project to mirror the company's internal tech stack and demonstrate my ability to build complex, customizable data components using their preferred library.
- **Client-Side Filtering vs. API Re-fetching:** For this prototype, filters are applied to the local state to ensure the "Instant Update" feel requested, while the initial search triggers a robust API call.
- **Performance:** Implemented debouncing on search inputs to prevent unnecessary API calls and optimized Recharts rendering to ensure 60fps interactions.

## Getting Started

### Prerequisites

- Amadeus API Keys ([Get them here](https://developers.amadeus.com/))

### Installation

1. **Clone the repo:**

```bash
git clone https://github.com/Shakibul-Hasan-14/flight-search-engine.git
cd flight-search-engine

```

2. **Install dependencies:**

```bash
npm install

```

3. **Environment Variables:**
   Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_AMADEUS_CLIENT_ID=YOUR_API_KEY
NEXT_PUBLIC_AMADEUS_CLIENT_SECRET=YOUR_API_SECRET

```

4. **Run Development Server:**

```bash
npm run dev

```

## Project Assumptions & Constraints

- The Amadeus Test Environment has limited data; if no flights are found for a specific route, the app displays a custom empty state.
- For the 16-hour scope, focus was placed on the Search/Results/Graph core loop rather than a full checkout flow.
