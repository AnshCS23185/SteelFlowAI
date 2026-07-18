import { Outlet } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function AuthLayout() {
  return (
    <div className="h-screen w-screen flex bg-[#FAFAFA] text-[#111111] overflow-hidden font-sans">
      {/* Brand Aesthetic Side Panel (Industrial/Enterprise inspired) */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-[#111111] text-white p-10 flex-col justify-between relative overflow-hidden select-none">
        {/* Top Header Logo Container */}
        <div className="z-10 w-max">
          <img
            src={logoImg}
            alt="SteelFlow"
            className="h-50 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Core Value Statement */}
        <div className="z-10 max-w-lg my-auto space-y-6">
          <p className="text-[#FF5A1F] text-xs font-bold tracking-widest uppercase">
            STEEL FABRICATION OPERATING PLATFORM
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight leading-tight text-white">
            Manage Every Fabrication Project From Drawing To Dispatch.
          </h1>
          <p className="text-gray-400 font-sans text-xs leading-relaxed">
            Centralize project planning, inventory, production execution, warehouse operations and dispatch management in one integrated platform designed for steel fabrication industries.
          </p>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[10px] text-gray-500 z-10 font-sans border-t border-gray-800 pt-3">
          <span>Version 1.0</span>
          <span>Developed for Industrial Fabrication Management</span>
        </div>
      </div>

      {/* Main Form Area */}
      <main className="flex-1 h-full flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
