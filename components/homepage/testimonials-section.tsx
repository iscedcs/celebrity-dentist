"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "TV Host",
    content:
      "Dr. Whiten Lighten transformed my smile completely. The professionalism and attention to detail is unmatched. I feel confident on camera every day!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Michael Chen",
    role: "Business Executive",
    content:
      "The best dental experience I've ever had. The clinic is modern, the staff is exceptional, and the results speak for themselves. Highly recommended!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Emma Rodriguez",
    role: "Model",
    content:
      "As someone whose smile is part of my career, I trust only Dr. Whiten Lighten. The cosmetic work is flawless and the service is world-class.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-20 lg:py-24 bg-secondary/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            What Our Patients Say
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what celebrities and
            professionals say about their experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-background border-0 shadow-lg">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center">
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-lg sm:text-xl text-foreground mb-8 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <img
                    src={testimonials[currentIndex].image || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-foreground text-base sm:text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-sm sm:text-base text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTestimonial}
                    className="rounded-full w-10 h-10 p-0 bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextTestimonial}
                    className="rounded-full w-10 h-10 p-0 bg-transparent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
