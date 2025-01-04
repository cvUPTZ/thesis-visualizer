import React from "react";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "This platform revolutionized how I write my thesis. The collaboration features are incredible!",
    author: "Sarah Johnson",
    role: "PhD Candidate, Computer Science",
    rating: 5,
  },
  {
    quote: "The AI-powered suggestions and formatting tools saved me countless hours.",
    author: "Michael Chen",
    role: "Master's Student, Engineering",
    rating: 5,
  },
  {
    quote: "Working with my advisor has never been easier. Real-time feedback is a game-changer.",
    author: "Emma Davis",
    role: "Research Scholar",
    rating: 5,
  },
  {
    quote: "The citation management system is brilliant. It handles everything automatically!",
    author: "David Wilson",
    role: "PhD Student, Biology",
    rating: 5,
  },
];

export const TestimonialCarousel = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied researchers who have transformed their thesis writing experience
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
                    <div className="mb-4">
                      <Quote className="w-8 h-8 text-primary opacity-50" />
                    </div>
                    <p className="text-gray-600 mb-4 flex-grow">{testimonial.quote}</p>
                    <div>
                      <div className="flex mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="font-semibold text-[#1A1F2C]">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};