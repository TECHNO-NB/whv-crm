"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, Image, BarChart3 } from "lucide-react";
import CardNgo from "./Card";
import ComprehensiveDataModel from "./ComprehensiveDataModel";
import { Sidebar } from "./ui/sidebar";

const CRMLandingPage = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 to-white text-gray-800 w-full">
      
      {/* Hero Section */}
      <section className="text-center mt-20 py-20 px-2 md:px-40 border-b-2 border-amber-600">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 ">
          World Hindu Vision <br />
          <span className="text-[#FF6B35]">NGO Management System</span>
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Empowering global Hindu communities through comprehensive digital
          management, spiritual guidance, and unified organizational excellence
          across multiple countries.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-6">
            Get Started
          </Button>
          <Button variant="outline" className="rounded-xl px-6">
            Learn More
          </Button>
        </div>

        <div className="mt-20 flex justify-evenly px-24">
          <div className="div">
            <h1 className="text-[#FF6B35] text-2xl font-bold">100+</h1>
            <p>Countries</p>
          </div>
          <div className="div">
            <h1 className="text-[#FF6B35] text-4xl font-bold">10k+</h1>
            <p>Member</p>
          </div>
          <div className="div">
            <h1 className="text-[#FF6B35] text-4xl font-bold">500+</h1>
            <p>Projects</p>
          </div>
          <div className="div">
            <h1 className="text-[#FF6B35] text-2xl font-bold">$2M+</h1>
            <p>Managed</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-orange-50/40">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-10 text-black">
            Comprehensive NGO Management Platform
          </h3>
           <CardNgo/>
     
        </div>
      </section>


        {/* Features Section */}
      <section className="py-16 bg-orange-50/40">
         <ComprehensiveDataModel/>
      </section>

     

      {/* About Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h3 className="text-3xl font-bold text-orange-700 mb-6">
          About WHV CRM
        </h3>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          The World Hindu Vision CRM system is built to empower organizations to
          streamline their administrative tasks, manage temples and volunteers,
          and store media securely. It bridges tradition and technology to make
          temple and NGO operations more effective and transparent.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-orange-600 text-white py-8 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} World Hindu Vision. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default CRMLandingPage;

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition rounded-2xl border border-orange-100 bg-white">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex justify-center">{icon}</div>
        <h4 className="text-xl font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600 text-sm">{desc}</p>
      </CardContent>
    </Card>
  );
};
