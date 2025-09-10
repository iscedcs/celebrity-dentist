import { Button } from "@/components/ui/button";
import { Award, Star, Users } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-popover to-background py-12 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Trusted by celebrities & professionals
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 lg:mb-6">
              Transform Your Smile,{" "}
              <span className="text-primary">Elevate Your Confidence</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0">
              Experience world-class dental care with our celebrity dentist.
              From cosmetic dentistry to preventive care, we provide exceptional
              service in a professional, welcoming environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button asChild size="lg" className="text-base">
                <Link href={"#contact"}>Book Your Consultation</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-base bg-transparent"
              >
                Call (123) 456-7890
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  15+
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  5000+
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Happy Patients
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  4.9
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-card">
              <img
                src="/homepage-disp.jpg"
                alt="Dr. Whiten Lighten - Celebrity Dentist"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 bg-background p-4 rounded-lg shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Celebrity Dentist
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Trusted by professionals
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
