import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smile, Sparkles, Shield, Zap } from "lucide-react";

const services = [
  {
    icon: Smile,
    title: "General Dentistry",
    description:
      "Comprehensive oral health care including cleanings, fillings, and preventive treatments to keep your smile healthy.",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    description:
      "Transform your smile with veneers, bonding, and aesthetic treatments designed for celebrities and professionals.",
  },
  {
    icon: Shield,
    title: "Orthodontics",
    description:
      "Straighten your teeth with modern orthodontic solutions including clear aligners and traditional braces.",
  },
  {
    icon: Zap,
    title: "Teeth Whitening",
    description:
      "Professional whitening treatments that deliver dramatic results safely and effectively in just one visit.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Comprehensive Dental Services
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            From routine care to advanced cosmetic procedures, we offer a full
            range of dental services tailored to meet your unique needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Need a specific treatment not listed? We offer many specialized
            services.
          </p>
          <a
            href="#contact"
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            Contact us to learn more →
          </a>
        </div>
      </div>
    </section>
  );
}
