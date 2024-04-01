'use client';

/* The FeaturesCard component is responsible for displaying the features card */
export const FeaturesCard = ({ image, title, description }) => (
  <div className="flex flex-col rounded-lg overflow-hidden hover:scale-105 transition-all duration-300">
    <div className="flex-1 flex flex-col justify-between bg-slate-700 hover:bg-slate-900 p-6">
      <img src={image} className="mb-2 w-[50px] h-[50px]" />
      <h1 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-200">
        {title}
      </h1>
      <p className="text-base text-gray-200">
        {description}
      </p>
    </div>
  </div>
);
