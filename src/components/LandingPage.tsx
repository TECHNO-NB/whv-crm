// @ts-nocheck
"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

// --- Icon Definitions (Using inline SVG for single file mandate) ---

const Users = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const Building = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="2" width="18" height="20" rx="2" ry="2"/>
    {/* Corrected lines to remove duplicate attributes */}
    <line x1="9" y1="18" x2="9" y2="6"/>
    <line x1="15" y1="18" x2="15" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="3" y1="14" x2="21" y2="14"/>
  </svg>
);

const Image = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
);

const BarChart3 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

// --- Simple UI Components (Recreating Shadcn/ui parts) ---

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "font-medium transition-all duration-300 rounded-xl shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variantStyle = '';

  if (variant === 'primary') {
    variantStyle = 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/50';
  } else if (variant === 'outline') {
    variantStyle = 'bg-white border border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500';
  }

  return (
    <button className={`px-6 py-3 ${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }) => (
  <div className={`rounded-2xl border bg-white/80 shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Link = ({ href, children, className = '', ...props }) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

// --- FeatureCard Component ---

const FeatureCard = ({ icon, title, desc }) => {
  const IconComponent = icon;
  return (
    <Card className="shadow-2xl hover:shadow-orange-300/50 transition duration-500 transform hover:scale-[1.02] border-2 border-orange-100 h-full">
      <CardContent className="p-8 text-center space-y-4">
        <div className="flex justify-center">
          <IconComponent className="w-12 h-12 text-orange-600 bg-orange-100 p-2 rounded-full shadow-inner" />
        </div>
        <h4 className="text-xl font-bold text-gray-900">{title}</h4>
        <p className="text-gray-600 text-sm">{desc}</p>
      </CardContent>
    </Card>
  );
};

// --- CardNgo Component (Implemented) ---

const CardNgo = () => {
  const features = [
    {
      icon: Users,
      title: "Volunteer & Member Management",
      desc: "Track global members, manage volunteer duties, and foster community engagement with dedicated profiles and communication tools.",
    },
    {
      icon: Building,
      title: "Temple & Institution Oversight",
      desc: "Centralized management for temples and affiliated institutions, including facility status, event scheduling, and donation tracking.",
    },
    {
      icon: Image,
      title: "Media & Asset Storage",
      desc: "Securely store, categorize, and share spiritual content, event photos, and educational resources across the network.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics & Reporting",
      desc: "Gain deep insights into project impact, financial health, and community participation with real-time dashboards and custom reports.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};



const DataModelNode = ({ title, children, color }) => (
    <div className={`p-4 border-2 border-${color}-400 bg-${color}-50/70 rounded-xl shadow-lg transition-all hover:shadow-${color}-300 hover:scale-[1.03] text-sm md:text-base`}>
        <h5 className={`font-semibold text-${color}-800 mb-1 border-b pb-1 border-${color}-300`}>{title}</h5>
        <div className="text-gray-700 space-y-0.5">{children}</div>
    </div>
);


const ComprehensiveDataModel = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 pt-16">
            <h3 className="text-4xl font-bold text-center mb-12 text-black">
                Unified Global Data Architecture
            </h3>
            <div className="flex flex-col items-center space-y-8">
                {/* Central Core */}
                <DataModelNode title="Central Management Core (WHV Global)" color="orange">
                    <p>• Global Hierarchy & Permissions</p>
                    <p>• Multi-Currency Financial Ledger</p>
                </DataModelNode>

                {/* Branches - Responsive Layout */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 flex justify-center items-center">
                        {/* Connecting Line */}
                        {/* <div className="w-0.5 h-full bg-orange-300 transform -translate-y-1/2 "></div> */}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <DataModelNode title="Member & Volunteer Hub" color="amber">
                                <p>• Profile, Seva Role & Status</p>
                                <p>• Training & Certification Records</p>
                                <p>• Communication History</p>
                            </DataModelNode>
                        </div>
                        {/* Column 2 */}
                        <div className="space-y-6 md:mt-20">
                            <DataModelNode title="Temple & Asset Registry" color="red">
                                <p>• Location (Geo-data)</p>
                                <p>• Facility & Deity Details</p>
                                <p>• Event Calendar Integration</p>
                            </DataModelNode>
                        </div>
                        {/* Column 3 */}
                        <div className="space-y-6">
                            <DataModelNode title="Project & Financial Tracking" color="green">
                                <p>• Project Milestones & Budget</p>
                                <p>• Donation Campaigns & Receipts</p>
                                <p>• Audit Trails</p>
                            </DataModelNode>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-12 italic">
                Designed for scalability and multi-country operational complexity, ensuring compliance and transparency.
            </p>
        </div>
    );
};


// --- Main App Component (CRMLandingPage renamed to App) ---

const CRMLandingPage = () => {
  const router=useRouter();
  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 to-white text-gray-800 w-full font-sans">
      
      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 px-4 md:px-10 lg:px-40 border-b-4 border-amber-300 bg-white shadow-inner">
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
          World Hindu Vision <br />
          <span className="text-orange-600 inline-block mt-2 transform transition-transform duration-500 hover:scale-[1.05] hover:text-orange-700">
            NGO Management System
          </span>
        </h2>
        <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
          Empowering global Hindu communities through comprehensive digital
          management, spiritual guidance, and unified organizational excellence
          across multiple countries.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={()=>router.push("/auth/login")} className="w-full cursor-pointer sm:w-auto text-lg shadow-2xl shadow-orange-500/30">
             Get Started <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button onClick={()=>router.push("/auth/login")} variant="outline" className="w-full cursor-pointer sm:w-auto text-lg border-2">
            Log In
          </Button>
        </div>

        {/* Statistics Bar */}
        <div className="mt-20 flex flex-wrap justify-center sm:justify-evenly gap-6 sm:gap-0 px-4">
          {[
            { value: "100+", label: "Countries" },
            { value: "10k+", label: "Members" },
            { value: "500+", label: "Projects" },
            { value: "$2M+", label: "Managed Funds" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center w-1/2 sm:w-auto min-w-[120px] p-2">
              <h1 className="text-orange-600 text-3xl sm:text-5xl font-extrabold transition-colors duration-300 hover:text-orange-700">
                {stat.value}
              </h1>
              <p className="text-gray-700 mt-1 text-sm sm:text-base font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-center mb-14 text-gray-900">
            Platform Capabilities
          </h3>
          <CardNgo />
        </div>
      </section>


      {/* Data Model Section */}
      <section className="py-20 bg-white">
        <ComprehensiveDataModel />
      </section>


      {/* About Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center bg-white/70 rounded-3xl shadow-2xl border border-orange-100 mb-10">
        <h3 className="text-3xl font-bold text-orange-700 mb-6">
          About WHV CRM
        </h3>
        <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-lg">
          The World Hindu Vision CRM system is built to empower organizations to
          streamline their administrative tasks, manage temples and volunteers,
          and store media securely. It bridges tradition and technology to make
          temple and NGO operations more effective and transparent. Our vision is
          to provide a unified digital foundation for global Hindu outreach and service.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-orange-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm">
            © 2009 World Hindu Vision. All rights
            reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link href="#" className="hover:text-amber-200 transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-amber-200 transition">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-amber-200 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default CRMLandingPage;