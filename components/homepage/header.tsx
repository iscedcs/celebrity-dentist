"use client";

import { Button } from "@/components/ui/button";
import { Menu, Phone, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              Whiten Lighten
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#services"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Services
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+1234567890"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">(123) 456-7890</span>
            </a>
            <Button
              onClick={() => {
                router.push("/sign-in");
              }}
              size="sm"
              className=""
            >
              Sign in
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              <a
                href="#services"
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary"
              >
                Services
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary"
              >
                Contact
              </a>
              <div className="px-3 py-2">
                <Button
                  onClick={() => {
                    router.push("/sign-in");
                  }}
                  size="sm"
                  className="w-full"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
