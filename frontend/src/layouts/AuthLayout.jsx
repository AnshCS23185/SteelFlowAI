import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-bg-base text-text-primary overflow-hidden transition-colors duration-250">
      {/* Brand Aesthetic Side Panel (Apple/Linear inspired) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#161616] dark:bg-[#161616] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-[#F64A14] opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#FFD93D] opacity-5 blur-[80px]" />

        {/* Top Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded bg-[#F64A14] flex items-center justify-center font-display font-bold text-white text-lg">
            SF
          </div>
          <div>
            <span className="font-display font-bold tracking-tight text-white block text-lg">
              SteelFlow AI
            </span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block -mt-1">
              Enterprise SaaS
            </span>
          </div>
        </div>

        {/* Core Value Statement */}
        <div className="z-10 max-w-lg my-auto space-y-6">
          <p className="text-[#F64A14] text-xs font-bold tracking-widest uppercase">
            FABRICATION INTELLIGENCE SYSTEM
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight leading-none text-white">
            Precision detailing, fabrication, & dispatch.
          </h1>
          <p className="text-gray-400 font-sans text-sm leading-relaxed">
            Unifying shop detailing, real-time inventory tracking, production control, and logistics dispatcher interfaces in a single high-fidelity, high-performance platform.
          </p>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-xs text-gray-500 z-10 font-sans">
          <span>SteelFlow AI v2.6.0</span>
          <span>© 2026 DeepMind Solutions</span>
        </div>
      </div>

      {/* Main Form Area */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
