import React from "react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export const TestimonialCard = ({ quote, author, role }: TestimonialCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <p className="text-gray-600 mb-4">{quote}</p>
    <div>
      <p className="font-semibold text-[#1A1F2C]">{author}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);