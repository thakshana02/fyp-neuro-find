"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 w-full">
        {/* Left Side */}
        <div className="text-center md:text-left w-full md:w-auto">
          <h3 className="text-lg font-semibold">Neuro Find</h3>
          <p className="text-sm text-gray-400">
            AI-powered early detection for Vascular Dementia.
          </p>
        </div>



        {/* Copyright */}
        <div className="text-center md:text-right text-sm text-gray-400 mt-4 md:mt-0 w-full md:w-auto">
          © {new Date().getFullYear()} NeuroFind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
