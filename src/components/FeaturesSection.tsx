import { ArrowRight, Globe, DollarSign, Briefcase, MessageSquare, BarChart2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Adjust path based on your Shadcn setup

// --- 1. FEATURE DATA ---

// Define the structure for a single feature
type Feature = {
  icon: any;
  iconColor: string;
  title: string;
  description: string;
  callout: string;
};

// Array of feature data mirroring the image
const features: Feature[] = [
  {
    icon: Globe,
    iconColor: 'text-blue-500', // Blue
    title: 'Multi-Country Operations',
    description:
      'Seamlessly manage NGO operations across 30+ countries, ensuring compliance and efficiency.',
    callout: '50+ Countries',
  },
  {
    icon: DollarSign,
    iconColor: 'text-green-500', // Green
    title: 'Financial Management',
    description:
      'Comprehensive accounting, expense tracking, and reporting with complete transparency.',
    callout: '$20M+ Managed',
  },
  {
    icon: Briefcase,
    iconColor: 'text-purple-500', // Purple
    title: 'Project Planning',
    description:
      'Advanced pooled management tool for activities, across all milestones and deliverables.',
    callout: '500+ Projects',
  },
  {
    icon: MessageSquare,
    iconColor: 'text-orange-500', // Orange
    title: 'Communication Hub',
    description:
      'Integrated mailing system and communication platform for seamless internal and external coordination.',
    callout: '10K+ Members',
  },
  {
    icon: BarChart2,
    iconColor: 'text-indigo-500', // Indigo/Dark Blue
    title: 'Analytics & Reporting',
    description:
      'Comprehensive reporting system, real-time analytics, and customizable dashboards for insights.',
    callout: 'Real-Time Data',
  },
  {
    icon: FileText,
    iconColor: 'text-emerald-500', // Teal/Emerald
    title: 'Document Management',
    description:
      'Secure document library, version control, and access rules for customizable organization.',
    callout: 'Secure Storage',
  },
];

// --- 2. FEATURE CARD COMPONENT ---

const FeatureCard = ({ icon: Icon, iconColor, title, description, callout }: Feature) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 border-gray-100">
    <CardHeader className="space-y-4 pb-4">
      {/* Icon Container with background color */}
      <div className={`p-3 w-fit rounded-lg bg-opacity-10 ${iconColor} bg-current`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      {/* Title */}
      <CardTitle className="text-lg font-semibold text-gray-800">
        {title}
      </CardTitle>
    </CardHeader>
    
    <CardContent className="space-y-4 pt-0">
      {/* Description - added min-height to help align card footers if descriptions vary in length */}
      <p className="text-sm text-gray-600 ">
        {description}
      </p>

      {/* Footer/Callout with Arrow */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-50/50">
        <span className="text-sm font-medium text-gray-500">
          {callout}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-500 hover:text-gray-900 transition-colors" />
      </div>
    </CardContent>
  </Card>
);

// --- 3. MAIN SECTION COMPONENT ---

export function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50"> {/* Added a slight background for contrast */}
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#E17100] mb-4">
            Comprehensive NGO Management Platform
          </h1>
          <p className="text-lg text-gray-600">
            Discover powerful features designed to streamline operations, enhance communication, and drive meaningful impact across Hindu communities.
          </p>
        </div>
        
        {/* Features Grid (3x2 layout on large screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}