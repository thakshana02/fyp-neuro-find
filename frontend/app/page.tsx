"use client";
import Link from 'next/link';
import Hero from "./landing/Hero"; // Import as default export

export default function Home() {
  return (
    <main className="bg-background">
      <Hero />
    </main>
  );
}