import React from "react";
import { Calculator, Settings } from "lucide-react";

interface HeaderProps {
  onAdminClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAdminClick,
  onHomeClick,
}) => {
  return (
    <header className="header-modern sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center space-x-3 cursor-pointer group transition-transform hover:scale-105"
            onClick={onHomeClick}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                <span className="hidden sm:inline">LED Cost Calculator</span>
                <span className="sm:hidden">Calculator</span>
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                Professional cost estimation
              </p>
            </div>
          </div>

          <button onClick={onAdminClick} className="btn-modern group">
            <Settings className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
