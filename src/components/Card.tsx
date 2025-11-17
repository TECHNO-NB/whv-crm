import React from "react";
import {
  Earth,
  Users,
  HandHeart,
  Building,
  Image,
  BarChart3,
  MoveRight,
} from "lucide-react";

interface CardData {
  title: string;
  desc: string;
  icon: React.ReactNode;
  stat: string;
  bg: string;
}

const CardNgo = () => {
  const cards: CardData[] = [
    {
      title: "Multi-Country Operations",
      desc: "Manage NGO activities across 50+ countries with centralized control and local autonomy.",
      icon: <Earth className="w-6 h-6" />,
      stat: "50+ Countries",
      bg: "bg-blue-500",
    },
    {
      title: "Volunteer Management",
      desc: "Track and coordinate thousands of volunteers efficiently across multiple regions.",
      icon: <Users className="w-6 h-6" />,
      stat: "10K+ Volunteers",
      bg: "bg-green-500",
    },
    {
      title: "Donation Tracking",
      desc: "Monitor donations and contributions in real-time with full transparency.",
      icon: <HandHeart className="w-6 h-6" />,
      stat: "100K+ Donors",
      bg: "bg-pink-500",
    },
    {
      title: "Temple Management",
      desc: "Manage temples, events, and staff across the globe using one centralized system.",
      icon: <Building className="w-6 h-6" />,
      stat: "1K+ Temples",
      bg: "bg-yellow-500",
    },
    {
      title: "Gallery & Media",
      desc: "Upload, organize, and showcase temple photos, event videos, and community highlights.",
      icon: <Image className="w-6 h-6" />,
      stat: "5K+ Media",
      bg: "bg-purple-500",
    },
    {
      title: "Reports & Analytics",
      desc: "Generate powerful insights with automated reports and dashboards.",
      icon: <BarChart3 className="w-6 h-6" />,
      stat: "Real-time Data",
      bg: "bg-orange-500",
    },
  ];

  return (
    <section className="py-0 px-2 min-w-full ">
    

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-14">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-full bg-white/70 backdrop-blur-md border border-orange-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            {/* Icon */}
            <div
              className={`${card.bg} rounded-md w-14 h-14 flex items-center justify-center text-white mb-4 text-4xl`}
            >
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>

            {/* Description */}
            <p className="text-gray-600 mb-4 text-sm">{card.desc}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <p className="text-orange-600 text-sm font-medium">{card.stat}</p>
              <MoveRight className="text-orange-600 w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CardNgo;
