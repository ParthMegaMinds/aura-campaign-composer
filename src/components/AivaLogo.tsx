
import React from 'react';

const AivaLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-md animated-gradient flex items-center justify-center">
        <span className="text-white font-bold">AI</span>
      </div>
      <span className="font-bold text-xl">AIVA</span>
    </div>
  );
};

export default AivaLogo;
