import React from 'react';

interface FascinoLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const FascinoLogo: React.FC<FascinoLogoProps> = ({ 
  className = "", 
  width = 40, 
  height = 40 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square background with colored segments */}
      {/* Top left - Blue */}
      <path 
        d="M20 0 L50 0 L50 25 L25 50 L0 25 L0 20 C0 8.954 8.954 0 20 0 Z" 
        fill="#0891b2" 
      />
      
      {/* Top right - Red/Orange */}
      <path 
        d="M50 0 L80 0 C91.046 0 100 8.954 100 20 L100 50 L75 50 L50 25 L50 0 Z" 
        fill="#dc2626" 
      />
      
      {/* Bottom right - Green */}
      <path 
        d="M100 50 L100 80 C100 91.046 91.046 100 80 100 L50 100 L50 75 L75 50 L100 50 Z" 
        fill="#16a34a" 
      />
      
      {/* Bottom left - Yellow/Orange */}
      <path 
        d="M50 100 L20 100 C8.954 100 0 91.046 0 80 L0 50 L25 50 L50 75 L50 100 Z" 
        fill="#f59e0b" 
      />
      
      {/* White center square */}
      <rect 
        x="25" 
        y="25" 
        width="50" 
        height="50" 
        rx="8" 
        fill="white"
      />
      
      {/* "Fascino" text in the top portion */}
      <text 
        x="50" 
        y="40" 
        textAnchor="middle" 
        fontSize="12" 
        fontWeight="bold" 
        fill="#dc2626"
        fontFamily="Arial, sans-serif"
      >
        Fascino
      </text>
      
      {/* Large F letter */}
      <path 
        d="M40 45 L40 70 L45 70 L45 60 L55 60 L55 57 L45 57 L45 52 L58 52 L58 45 Z" 
        fill="#1e3a8a"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default FascinoLogo;
