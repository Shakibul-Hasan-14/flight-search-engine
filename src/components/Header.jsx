import { Bell } from "lucide-react";
import logo from "../../public/flight.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 h-16 flex items-center justify-center">
      <div className="container max-w-6xl w-full flex items-center justify-between">
        {/* Left: Menu & Logo */}
        <div
          className="cursor-pointer  flex items-center gap-4"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Flight Engine
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-1">
            <Bell className="text-gray-600 w-6 aspect-square cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-4 aspect-square bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="w-6 aspect-square bg-blue-600 rounded-full flex items-center justify-center text-white text-small cursor-pointer">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
