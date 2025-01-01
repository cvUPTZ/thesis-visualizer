import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <section className="pt-32 pb-24 px-4">
    <div className="max-w-7xl mx-auto text-center">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
        Transform Your <span className="text-[#9b87f5]">Thesis Writing</span> Experience
      </h1>
      <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
        Streamline your academic writing process with our powerful visualization
        and organization tools. Perfect for researchers and students.
      </p>
      <Link to="/auth">
        <Button className="bg-[#9b87f5] text-white text-lg px-8 py-6 rounded-lg hover:bg-[#7E69AB] transition-colors">
          Start Writing Now
        </Button>
      </Link>
    </div>
  </section>
);