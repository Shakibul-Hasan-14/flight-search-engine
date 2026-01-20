// pages/HomePage.jsx
import React from "react";
import Header from "../components/Header";
import HeroSearch from "../components/HeroSearch";
import PopularDestinations from "../components/PopularDestinations";
import PopularPackages from "../components/PopularPackages";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSearch />
      <PopularDestinations />
      <PopularPackages />
      <Footer />
    </div>
  );
};

export default HomePage;
