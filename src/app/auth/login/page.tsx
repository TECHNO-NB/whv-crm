// @ts-nocheck

"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Lock, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import logo from "../../../../public/logo2.jpg";
import Image from "next/image";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { addUser, userState } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

// Corrected FeatureBadge component to properly display the icon
const FeatureBadge = ({
  text,
  icon: Icon,
}: {
  text: string;
  icon: React.ElementType;
}) => (
  <div className="flex items-center space-x-1 text-gray-500">
    <Icon className="w-3 h-3 text-orange-500" />
    <span className="text-xs">{text}</span>
  </div>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router=useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password!");
      return;
    }

    const loginToast = toast.loading("Logging in...");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        const userData: userState = {
          id: res.data.data.id,
          countryId: res.data.data.country.id,
          fullName: res.data.data.fullName,
          email: res.data.data.email,
          role: res.data.data.role,
          countryName: res.data.data.country.countryName,
        };
        dispatch(addUser(userData));
        if(res.data.data.role==="admin"){
          router.push("/admin/dashboard")
        }else if(res.data.data.role==="country_manager"){
          router.push("/manager/dashboard")
        }else if(res.data.data.role==="it"){
          router.push("/it/dashboard")
        }else if(res.data.data.role==="finance"){
           router.push("/finance/dashboard")
        }
        toast.success("Login successful!", { id: loginToast });

        console.log("User Data:", res.data.data);
      } else {
        toast.error(res.data.message || "Login failed", { id: loginToast });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: loginToast,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Toaster position="top-right" />
      <Card className="w-full max-w-sm rounded-2xl shadow-2xl border-none">
        <CardHeader className="text-center space-y-2 pt-8 px-6">
          <div className="mx-auto w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            <Image
              height={48}
              width={48}
              src={logo}
              alt="World Hindu Vision Logo"
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to your **World Hindu Vision** account
            <br />
            Access your NGO management dashboard
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-12 border-gray-300 focus:border-orange-500 focus-visible:ring-orange-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 border-gray-300 focus:border-orange-500 focus-visible:ring-orange-500 pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold transition-colors shadow-lg shadow-orange-200/50"
            >
              Sign In
            </Button>
          </CardContent>

          <div className="text-center text-sm text-gray-500 pb-2 mt-4">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="text-orange-500 hover:underline font-medium"
            >
              Register
            </a>
          </div>
        </form>

        <CardFooter className="flex flex-col items-center pt-4 pb-10 px-6 space-y-4">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <FeatureBadge text="Secure authentication" icon={Lock} />
            <FeatureBadge text="Role-based access" icon={Users} />
            <FeatureBadge text="Session management" icon={Clock} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
