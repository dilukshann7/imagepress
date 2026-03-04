import React from "react";

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#222222] text-[#f0f0f0] font-sans text-center p-6 select-none">
      <h1 className="text-[1.75rem] font-bold tracking-wide mb-1">
        ImagePress
      </h1>
      <p className="text-[0.85rem] text-[#888] mb-5">Version 1.0.0</p>
      <p className="text-[0.9rem] text-[#bbb] max-w-75 leading-relaxed mb-6">
        A powerful image compression tool built with Electron and React.
      </p>
      <div className="w-10 h-px bg-[#444] mb-4" />
      <div className="text-[0.78rem] text-[#666] leading-loose">
        <div>
          Author <span className="text-[#999]">Dilukshan Niranjan</span>
        </div>
        <div>
          License <span className="text-[#999]">MIT</span>
        </div>
      </div>
    </div>
  );
};

export default About;
