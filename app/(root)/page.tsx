import { ContactSection } from "@/components/homepage/contact-section";
import { Footer } from "@/components/homepage/footer";
import { Header } from "@/components/homepage/header";
import { HeroSection } from "@/components/homepage/hero-section";
import { ServicesSection } from "@/components/homepage/services-section";
import { TestimonialsSection } from "@/components/homepage/testimonials-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
