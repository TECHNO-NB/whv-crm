// @ts-nocheck
"use client";
import { useRouter } from "next/navigation";
import React from "react";
import banner from "../../public/banner.jpeg";
import banner1 from "../../public/banner1.jpeg";
import Image from "next/image";
import Navbar from "./Navbar";
import { FeatureSection } from "./FeaturesSection";
const videoSrc = "./video.mp4";

// --- Icon Definitions (Using inline SVG for single file mandate) ---

const Users = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Building = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="2" width="18" height="20" rx="2" ry="2" />
    {/* Corrected lines to remove duplicate attributes */}
    <line x1="9" y1="18" x2="9" y2="6" />
    <line x1="15" y1="18" x2="15" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="3" y1="14" x2="21" y2="14" />
  </svg>
);

const Image2 = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const BarChart3 = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

// --- Simple UI Components (Recreating Shadcn/ui parts) ---

const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseStyle =
    "font-medium transition-all duration-300 rounded-xl shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variantStyle = "";

  if (variant === "primary") {
    variantStyle =
      "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/50";
  } else if (variant === "outline") {
    variantStyle =
      "bg-white border border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500";
  }

  return (
    <button
      className={`px-6 py-3 ${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`rounded-2xl border bg-white/80 shadow-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Link = ({ href, children, className = "", ...props }) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

// --- FeatureCard Component ---

const FeatureCard = ({ icon: IconComponent, title, desc }) => (
  <Card className="shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border-0 bg-white/90">
    <CardContent className="p-6 text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
          <IconComponent className="w-7 h-7 text-orange-600" />
        </div>
      </div>
      <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-600">{desc}</p>
    </CardContent>
  </Card>
);

const CardNgo = () => {
  const features = [
    {
      icon: Users,
      title: "Volunteer & Member Management",
      desc: "Profiles, roles, attendance, training records, and communication tools to keep communities connected.",
    },
    {
      icon: Building,
      title: "Temple & Institution Oversight",
      desc: "Manage temple details, facilities, calendars, and maintenance logs from a central registry.",
    },
    {
      icon: Image2,
      title: "Media & Asset Storage",
      desc: "Organize photos, documents, and sacred media with secure access controls and categorization.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      desc: "Impact dashboards, donation summaries, and audit-ready exports for transparency and governance.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((f, i) => (
        <FeatureCard key={i} {...f} />
      ))}
    </div>
  );
};


const DataModelNode = ({ title, children, color = "orange" }) => {
  // Tailwind dynamic color strings not directly evaluated -> use safe neutral styles while keeping color hints
  return (
    <div className="p-4 rounded-xl shadow-sm border bg-white">
      <h5 className="font-semibold text-[#E17100] mb-2">{title}</h5>
      <div className="text-sm text-slate-700 space-y-1">{children}</div>
    </div>
  );
};

const ComprehensiveDataModel = () => (
  <div className="max-w-6xl mx-auto px-6 py-8">
    <h3 className="text-4xl font-bold text-center mb-10 text-[#E17100]">
      Unified Global Data Architecture
    </h3>

    <div className="space-y-8">
      <div className="mx-auto max-w-3xl">
        <DataModelNode title="Central Management Core (WHV Global)">
          <p>• Global Hierarchy & Permissions</p>
          <p>• Multi-Currency Financial Ledger</p>
          <p>• Centralized configuration & country-level overrides</p>
        </DataModelNode>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataModelNode title="Member & Volunteer Hub">
          <p>• Profiles & Seva Role</p>
          <p>• Training & Certification</p>
          <p>• Communication history</p>
        </DataModelNode>

        <DataModelNode title="Temple & Asset Registry">
          <p>• Geo-location & address</p>
          <p>• Facility & deity details</p>
          <p>• Events & schedules</p>
        </DataModelNode>

        <DataModelNode title="Project & Financial Tracking">
          <p>• Budgets & milestones</p>
          <p>• Donation campaigns & receipts</p>
          <p>• Audit trails & exports</p>
        </DataModelNode>
      </div>
    </div>

    <p className="text-center text-sm text-slate-500 mt-8 italic">
      Designed for scalability and multi-country operational complexity — ensuring compliance and transparency.
    </p>
  </div>
);


// --- Main App Component (CRMLandingPage renamed to App) ---

const CRMLandingPage = () => {
  const router = useRouter();
  const backgroundImageUrl =
    typeof banner === "object" && banner.src ? banner.src : banner;
  return (
    <main className="min-h-screen  bg-linear-to-b from-orange-50 to-white text-gray-800 w-full font-sans">
      {/* Hero Section */}
      <Navbar />
      <section
        className="relative pt-20 pb-24 lg:pt-34 lg:pb-36 text-center shadow-xl mb-12"
        style={{
          backgroundImage: `url(${banner.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="w-full relative h-full  z-20">
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-geist  font-extrabold text-white leading-tight">
            World Hindu Vision <br />
            <span className="text-white rounded-2xl bg-orange-600  z-50 relative  inline-block mt-2 transform transition-transform duration-500 hover:scale-[1.05] ">
              NGO Management System
            </span>
          </h2>
        </div>
        <p className="mt-6 text-base relative sm:text-lg text-white max-w-3xl mx-auto px-4">
          Empowering global Hindu communities through comprehensive digital
          management, spiritual guidance, and unified organizational excellence
          across multiple countries.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full relative cursor-pointer sm:w-auto text-lg shadow-2xl shadow-white-500/10 border-2"
          >
            Get Started <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button
            onClick={() => router.push("/auth/login")}
            variant="outline"
            className="w-full relative cursor-pointer sm:w-auto text-lg border-2 border-white"
          >
            Log In
          </Button>
        </div>

        {/* Statistics Bar */}
        <div className="mt-20 relative text-white z-10  flex flex-wrap justify-center sm:justify-evenly gap-6 sm:gap-0 px-4">
          {[
            { value: "100+", label: "Countries" },
            { value: "10k+", label: "Members" },
            { value: "500+", label: "Projects" },
            { value: "$2M+", label: "Managed Funds" },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col relative items-center w-1/2 sm:w-auto min-w-[120px] p-2"
            >
              <h1 className="text-orange-600  relative text-3xl sm:text-5xl font-extrabold transition-colors duration-300 hover:text-orange-700">
                {stat.value}
              </h1>
              <p className="text-white relative mt-1 text-sm sm:text-base font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl sm:text-6xl font-extrabold text-center mb-14 text-[#E17100]">
            Platform Capabilities
          </h3>
          <CardNgo />
        </div>
      </section>

      <FeatureSection/>
      <section className="py-20 md:px-20  w-full min-h-screen bg-white">
        <Image
          src={banner1}
          width={420}
          height={420}
          alt="banner1"
          className=" object-cover w-full rounded-2xl shadow-2xl backdrop-blur-2xl hover:shadow-2xs border-4 border-amber-400 hover:border-8 transition-all"
        />
      </section>

      
      {/* Data Model Section */}
      <section className="py-20 bg-white">
        <ComprehensiveDataModel />
      </section>
      {/* Video Section (centered informational embed, autoplay removed) */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-3xl sm:text-6xl font-extrabold text-center mb-2 text-[#E17100]">
            Introductory Video
          </h4>
          <p className="text-sm text-slate-600 mb-6">
            A short informational clip about the World Hindu Vision CRM 
          </p>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <video className="w-full h-auto" autoPlay loop muted >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-14 px-6">
        <div className="max-w-6xl mx-auto bg-white/80 rounded-3xl shadow-xl border border-white/40 p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-[#E17100] mb-4">
                About WHV CRM
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                The World Hindu Vision CRM system is built to empower
                organizations to streamline administrative tasks, manage temples
                and volunteers, and store media securely. It bridges tradition
                and technology to make temple and NGO operations more effective
                and transparent.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border">
                  <div className="text-xs text-slate-500">Compliance</div>
                  <div className="font-semibold text-slate-800">
                    Audit-ready reports
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border">
                  <div className="text-xs text-slate-500">Security</div>
                  <div className="font-semibold text-slate-800">
                    Role-based access
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={banner1}
                alt="about visual"
                width={900}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

 {/* Footer */}
        <footer className="bg-[#E76A00] text-white py-4 mt-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="font-bold text-lg">World Hindu Vision</div>
              <div className="text-sm text-white/90">© 2009 — All rights reserved</div>
            </div>

            <div className="flex gap-4 items-center text-sm">
              <Link href="#" className="hover:underline">Privacy Policy</Link>
              <Link href="#" className="hover:underline">Terms</Link>
              <Link href="#" className="hover:underline">Contact</Link>
            </div>
          </div>
        </footer>
    </main>
  );
};

export default CRMLandingPage;
