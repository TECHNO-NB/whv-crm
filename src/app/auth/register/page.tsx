"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Eye,
  EyeOff,
  UploadCloud,
  CheckCircle,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import logo from "../../../../public/logo2.jpg";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Country {
  id: string;
  countryName: string;
  code: string;
}

interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  country: string;
  contactPhone: string;
  password: string;
  confirmPassword: string;
  avatarFile: File | null;
  avatarPreviewUrl: string | null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [formData, setFormData] = useState<UserRegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    contactPhone: "",
    password: "",
    confirmPassword: "",
    avatarFile: null,
    avatarPreviewUrl: null,
  });

  // ✅ Fetch Countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`
        );
        const data = await res.json();
        if (data.success) {
          setCountries(data.data);
        } else {
          console.error("Failed to fetch countries:", data.message);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, country: e.target.value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreviewUrl: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        avatarFile: null,
        avatarPreviewUrl: null,
      }));
    }
  };

  const getInitials = () => {
    const first = formData.firstName ? formData.firstName[0].toUpperCase() : "";
    const last = formData.lastName ? formData.lastName[0].toUpperCase() : "";
    return first + last || "U";
  };

  const isStep1Valid = () =>
    formData.firstName && formData.lastName && formData.email;
  const isStep2Valid = () =>
    formData.address && formData.country && formData.contactPhone;
  const isStep3Valid = () =>
    formData.password && formData.password === formData.confirmPassword;

  const handleNextStep = () => {
    if (step === 1 && !isStep1Valid())
      return toast.error("Please fill all required fields for Account Details.");
    if (step === 2 && !isStep2Valid())
      return toast.error("Please fill all required fields for Location & Contact.");
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  // ✅ Submit Registration to API
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isStep3Valid()) {
      toast.error("Please ensure passwords match and are provided.");
      return;
    }

    const form = new FormData();
    form.append("fullName", `${formData.firstName} ${formData.lastName}`);
    form.append("email", formData.email);
    form.append("address", formData.address);
    form.append("phone", formData.contactPhone);
    form.append("password", formData.password);
    form.append("countryId", formData.country);
    if (formData.avatarFile) form.append("avatar", formData.avatarFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();

      if (data.success) {
        router.push("/auth/login");
        toast.success("Registration complete!.");
      } else {
        toast.error(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong while registering. Please try again.");
    }
  };

  const stepTitle = () => {
    switch (step) {
      case 1:
        return "Account Details";
      case 2:
        return "Location & Contact";
      case 3:
        return "Security & Review";
      default:
        return "";
    }
  };

  const getCountryName = (id: string) => {
    const country = countries.find((c) => c.id === id);
    return country ? country.countryName : "";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl border-none">
        <CardHeader className="text-center space-y-4 pt-8 px-6">
          <div className="mx-auto w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            <Image
              src={logo}
              alt="logo"
              width={48}
              height={48}
              className="object-cover text-white"
            />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Create Your WHV Account
          </h2>
          <div className="flex justify-center items-center space-x-2 pt-4">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`h-2 w-8 rounded-full ${
                  step >= n ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-700 font-medium">
            Step {step} of 3: <strong>{stepTitle()}</strong>
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 pb-6">
            {/* --- Step 1 --- */}
            {step === 1 && (
              <>
                <div className="flex items-center space-x-4 pb-2">
                  <div className="flex-shrink-0">
                    <Avatar className="h-16 w-16 border-2 border-orange-300">
                      {formData.avatarPreviewUrl ? (
                        <AvatarImage
                          src={formData.avatarPreviewUrl}
                          alt="Avatar Preview"
                        />
                      ) : (
                        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xl">
                          {getInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 h-8 px-4 py-2 cursor-pointer border border-gray-300"
                    >
                      <UploadCloud className="h-4 w-4 mr-2" /> Upload Avatar
                    </label>
                    {formData.avatarFile && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {formData.avatarFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* --- Step 2 --- */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="text-sm font-medium text-gray-700"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={handleSelectChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    required
                  >
                    <option value="" disabled>
                      {loadingCountries ? "Loading..." : "Select your country"}
                    </option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contactPhone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* --- Step 3 --- */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
                  <h4 className="text-lg font-semibold text-orange-700 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-orange-500" />{" "}
                    Review Details
                  </h4>
                  <p className="text-sm text-gray-700 font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-gray-500" />{" "}
                    {formData.address}, {getCountryName(formData.country)}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-gray-500" />{" "}
                    {formData.contactPhone}
                  </p>
                  <p className="text-xs text-gray-600">
                    Email: {formData.email}
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Set Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {formData.password &&
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 pt-1">
                        Passwords do not match.
                      </p>
                    )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-orange-500 hover:underline">
                      Terms & Conditions
                    </a>
                  </label>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center pt-4 pb-8 px-6">
            {step > 1 ? (
              <Button type="button" onClick={handlePrevStep} variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
            ) : (
              <div /> // empty div to keep Next button aligned to right
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={
                  (step === 1 && !isStep1Valid()) ||
                  (step === 2 && !isStep2Valid())
                }
                className="bg-orange-500 hover:bg-orange-600 text-white ml-auto"
              >
                Next Step <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white ml-auto"
                disabled={!isStep3Valid()}
              >
                Register Account
              </Button>
            )}
          </CardFooter>
        </form>

        <div className="text-center text-sm text-gray-500 pb-6">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-orange-500 hover:underline font-medium"
          >
            Sign In
          </a>
        </div>
      </Card>
    </div>
  );
}
