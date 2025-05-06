"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronRight, ChevronDown, Brain, User } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
    }`}>
      <div className="flex justify-between items-center w-full px-6 md:px-16 lg:px-24">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <span className={`font-bold text-xl ${isScrolled ? 'text-primary' : 'text-primary'}`}>
              NeuroFind<span className="text-blue-600">.</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-1">
              <NavigationMenuItem>
                <Link href="/" className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isScrolled 
                    ? 'text-primary hover:bg-blue-50 hover:text-blue-600' 
                    : 'text-primary hover:bg-white/20 hover:text-blue-600'
                }`}>
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about-vad" className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isScrolled 
                    ? 'text-primary hover:bg-blue-50 hover:text-blue-600' 
                    : 'text-primary hover:bg-white/20 hover:text-blue-600'
                }`}>
                  Documentation
                </Link>
              </NavigationMenuItem>
              
              
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Register
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col">
          <div className="p-6 flex flex-col gap-5">

            
            <div>
              <p className="px-2 py-1 text-sm font-semibold text-muted-foreground">ABOUT</p>
              <Link 
                href="/about-vad" 
                className="px-2 py-3 flex items-center text-lg font-medium border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Documentation</span>
                <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </Link>
              
            </div>
            
            <Link 
              href="/predict" 
              className="px-2 py-3 text-lg font-medium border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Predict
            </Link>
            
            <Link 
              href="/contact" 
              className="px-2 py-3 text-lg font-medium border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center font-medium">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-medium">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;