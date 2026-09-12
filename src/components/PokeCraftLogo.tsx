import React from 'react';

interface PokeCraftLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}

export const PokeCraftLogo: React.FC<PokeCraftLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
}) => {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;

  return (
    <div className={`flex items-center gap-2.5 select-none font-display ${className}`}>
      {/* Premium stylized Poké Ball glyph */}
      <div
        style={{ width: iconSize, height: iconSize }}
        className="relative shrink-0 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-[#071525] p-[1.5px] shadow-sm"
      >
        <div className="w-full h-full rounded-full bg-[#071525] relative overflow-hidden flex flex-col items-center justify-center">
          {/* Top red hemisphere */}
          <div className="w-full h-1/2 bg-[#EE3F3F]" />
          {/* Bottom white hemisphere */}
          <div className="w-full h-1/2 bg-[#F1F5F9]" />
          {/* Center dark dividing band */}
          <div className="absolute inset-x-0 h-[22%] bg-[#071525] top-[39%]" />
          {/* Center release button */}
          <div className="absolute w-[36%] h-[36%] rounded-full bg-[#071525] flex items-center justify-center border-[1.5px] border-[#071525] z-10">
            <div className="w-[50%] h-[50%] rounded-full bg-[#FFD21F] shadow-inner" />
          </div>
        </div>
      </div>

      <div className="flex items-baseline tracking-tight">
        <span
          className={`font-black uppercase tracking-wide text-lg sm:text-xl ${
            variant === 'dark' ? 'text-[#071525]' : 'text-white'
          }`}
        >
          Poke<span className="text-[#FFD21F]">Craft</span>
        </span>
        <span className="ml-1.5 hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#FFD21F]/15 text-[#FFD21F] border border-[#FFD21F]/30">
          3D Prints
        </span>
      </div>
    </div>
  );
};
