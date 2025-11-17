"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label"; // Assuming Label exists
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Import Lucide icons
import {
  School,
  MapPin,
  Users,
  User,
  Phone,
  Mail,
  Globe,
  Image,
  PlusCircle,
  Search,
} from "lucide-react";

// --- INTERFACES (Kept the same) ---
interface Country {
  id: string;
  countryName: string;
}

interface Province {
  id: string;
  name: string;
}

interface School {
  id: string;
  name: string;
  province?: Province;
  country?: Country;
  address?: string;
  studentCount?: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  photos?: string[];
  createdAt: string;
}
// --- END INTERFACES ---

// Helper to get initials for avatar placeholder
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Reusable component for detail panel items
const DetailItem = ({
  icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}) => (
  <div className={`space-y-1 ${fullWidth ? "col-span-2" : ""}`}>
    <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
      {icon} {label}
    </div>
    <p className="text-base font-semibold text-gray-900 break-words">
      {value}
    </p>
  </div>
);

// --- MAIN COMPONENT ---
export default function SchoolsPage() {
  // State for data
  const [schools, setSchools] = useState<School[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState<string | undefined>(undefined);
  const [provinceId, setProvinceId] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState("");
  const [studentCount, setStudentCount] = useState<number | undefined>();
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [photos, setPhotos] = useState<string>("");

  // Selected school for right panel
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // --- Data Fetching ---
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/schools`
      );
      setSchools(res.data.data);
      if (res.data.data.length > 0 && !selectedSchool) {
        setSelectedSchool(res.data.data[0]);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`
      );
      setCountries(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/province`
      );
      setProvinces(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchCountries();
    fetchProvinces();
  }, []);

  // --- Create School ---
  const resetForm = () => {
    setName("");
    setCountryId(undefined);
    setProvinceId(undefined);
    setAddress("");
    setStudentCount(undefined);
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setPhotos("");
  };

  const createSchool = async () => {
    if (!name || !countryId) {
      toast.error("School Name and Country are required");
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/schools`,
        {
          name,
          countryId,
          provinceId,
          address,
          studentCount:
            studentCount !== undefined ? Number(studentCount) : undefined,
          contactName,
          contactPhone,
          contactEmail,
          photos: photos
            ? photos
                .split(",")
                .map((p) => p.trim())
                .filter((p) => p.length > 0)
            : [],
        }
      );
      toast.success("School created successfully 🎉");
      resetForm();
      fetchSchools();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create school");
    }
  };

  // --- Filtering ---
  const filteredSchools = schools.filter((s) => {
    const key = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(key) ||
      s.country?.countryName?.toLowerCase().includes(key) ||
      s.province?.name?.toLowerCase().includes(key) ||
      s.address?.toLowerCase().includes(key)
    );
  });

  // --- UI Rendering ---
  return (
    <div className="flex min-h-screen bg-background antialiased ml-28">
      {/* Left Panel: Creation Form & List */}
      <div className="w-full max-w-md flex flex-col border-r bg-card shadow-xl">
        <h1 className="text-2xl font-bold p-4 pb-0 text-gray-800">
          🏫 School Management
        </h1>
        <p className="text-sm text-muted-foreground px-4 pb-4">
          Register new schools and browse the existing directory.
        </p>
        <Separator className="mb-4" />

        {/* Create School Form */}
        <ScrollArea className="flex-none h-[480px] p-4 bg-gray-50 border-b">
          <Card className="shadow-none border-dashed border-blue-300 bg-blue-50">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                <PlusCircle className="w-5 h-5" /> New Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  placeholder="e.g. Lincoln High School"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Location Group */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={countryId} onValueChange={setCountryId}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="province">Province</Label>
                  <Select value={provinceId} onValueChange={setProvinceId}>
                    <SelectTrigger id="province">
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Full Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="studentCount">Student Count</Label>
                  <Input
                    id="studentCount"
                    type="number"
                    placeholder="Capacity"
                    value={studentCount !== undefined ? studentCount : ""}
                    onChange={(e) =>
                      setStudentCount(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    placeholder="Contact Person"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    placeholder="Phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    placeholder="Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="photos">Photos (URLs)</Label>
                <Input
                  id="photos"
                  placeholder="Comma separated URLs"
                  value={photos}
                  onChange={(e) => setPhotos(e.target.value)}
                />
              </div>

              <Button
                onClick={createSchool}
                className="w-full font-semibold bg-blue-600 hover:bg-blue-700 shadow-md"
                disabled={!name || !countryId}
              >
                <School className="w-4 h-4 mr-2" /> Register School
              </Button>
            </CardContent>
          </Card>
        </ScrollArea>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools by name, country, or province..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Schools List (Modern Cards) */}
        <ScrollArea className="flex-1 p-4 bg-white">
          {loading ? (
            <div className="text-center p-6 text-gray-500">
              Loading schools...
            </div>
          ) : filteredSchools.length > 0 ? (
            <div className="space-y-3">
              {filteredSchools.map((s) => (
                <Card
                  key={s.id}
                  onClick={() => setSelectedSchool(s)}
                  className={`
                    cursor-pointer transition-all duration-200 hover:shadow-lg
                    ${
                      selectedSchool?.id === s.id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-primary/50"
                    }
                  `}
                >
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Avatar Placeholder */}
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
                          {getInitials(s.name)}
                        </div>
                        <p className="font-bold text-lg text-gray-900 truncate">
                          {s.name}
                        </p>
                      </div>
                      {s.studentCount && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 font-medium flex-shrink-0"
                        >
                          <Users className="w-3 h-3 mr-1" />{" "}
                          {s.studentCount}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
                      {s.country && (
                        <Badge className="bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200">
                          <Globe className="w-3 h-3 mr-1" />{" "}
                          {s.country.countryName}
                        </Badge>
                      )}
                      {s.province && (
                        <Badge variant="outline" className="text-gray-600 border-gray-300 bg-white hover:bg-gray-100">
                          <MapPin className="w-3 h-3 mr-1" /> {s.province.name}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="p-4 text-center text-gray-500 italic">
              No matching schools found.
            </p>
          )}
        </ScrollArea>
      </div>

      {/* Right Panel: School Details (Clean and Structured) */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
        {selectedSchool ? (
          <div className="bg-white rounded-xl shadow-2xl p-8 space-y-8 border border-gray-200">
            {/* Header */}
            <div className="border-b pb-4">
              <h1 className="text-4xl font-extrabold text-blue-700 mb-2 flex items-center gap-3">
                <School className="w-8 h-8" /> {selectedSchool.name}
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                School ID:{" "}
                <span className="font-mono text-sm bg-gray-100 p-1 rounded">
                  {selectedSchool.id}
                </span>
              </p>
            </div>

            {/* Location & Capacity Card */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50 border-b p-4">
                <CardTitle className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" /> Location & General Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 gap-6">
                <DetailItem
                  icon={<Globe className="w-4 h-4 text-purple-600" />}
                  label="Country"
                  value={selectedSchool.country?.countryName || "N/A"}
                />
                <DetailItem
                  icon={<MapPin className="w-4 h-4 text-purple-600" />}
                  label="Province"
                  value={selectedSchool.province?.name || "N/A"}
                />
                <DetailItem
                  icon={<Users className="w-4 h-4 text-purple-600" />}
                  label="Student Count"
                  value={
                    selectedSchool.studentCount !== undefined
                      ? selectedSchool.studentCount.toLocaleString()
                      : "N/A"
                  }
                />
                <DetailItem
                  icon={<School className="w-4 h-4 text-purple-600" />}
                  label="Registered On"
                  value={new Date(
                    selectedSchool.createdAt
                  ).toLocaleDateString()}
                />
                <DetailItem
                  icon={<MapPin className="w-4 h-4 text-purple-600" />}
                  label="Full Address"
                  value={selectedSchool.address || "N/A"}
                  fullWidth={true}
                />
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50 border-b p-4">
                <CardTitle className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 gap-6">
                <DetailItem
                  icon={<User className="w-4 h-4 text-green-600" />}
                  label="Contact Name"
                  value={selectedSchool.contactName || "N/A"}
                />
                <DetailItem
                  icon={<Mail className="w-4 h-4 text-green-600" />}
                  label="Contact Email"
                  value={selectedSchool.contactEmail || "N/A"}
                />
                <DetailItem
                  icon={<Phone className="w-4 h-4 text-green-600" />}
                  label="Contact Phone"
                  value={selectedSchool.contactPhone || "N/A"}
                />
              </CardContent>
            </Card>

            {/* Photos Section */}
            {selectedSchool.photos && selectedSchool.photos.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                  <Image className="w-5 h-5 text-orange-600" /> Gallery (
                  {selectedSchool.photos.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedSchool.photos.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                    >
                      <Image className="w-4 h-4 mr-2" /> View Photo {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 text-2xl h-full bg-white border border-dashed rounded-xl shadow-sm p-8">
            <School className="w-16 h-16 mb-4 text-gray-300" />
            <p className="font-semibold mb-2 text-gray-500">
              School Details Viewer
            </p>
            <p className="text-lg text-gray-500 text-center">
              Select a school from the left panel to view its complete profile
              here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}