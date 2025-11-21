"use client";
/* eslint-disable */
import { addUser, userState } from "@/redux/userSlice";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function VerifyUser() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router=useRouter();
  useEffect(() => {
    setIsLoading(true);
    axios.defaults.withCredentials = true;
    const fetchUser = async () => {
      if (!userData || !userData.id) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`
          );
          if (res.data.success) {
            console.log("+++++++++++++userData", res.data.data);
            setIsLoading(false);
            const userData: userState = {
              id: res.data.data.id,
              countryId: res.data.data.country.id,
              fullName: res.data.data.fullName,
              email: res.data.data.email,
              role: res.data.data.role,
              countryName: res.data.data.country.countryName,
               code: res.data.data.country.code,
            };

            // if (res.data.data.role === "admin") {
            //   router.push("/admin/dashboard");
            // } else if (res.data.data.role === "country_manager") {
            //   router.push("/manager/dashboard");
            // } else if (res.data.data.role === "it") {
            //   router.push("/it/dashboard");
            // } else if (res.data.data.role === "finance") {
            //   router.push("/finance/dashboard");
            // }
            dispatch(addUser(userData));
            toast.success(`Welcome back ${res.data.data.fullName}`);
          }
        } catch (error) {
          console.log(error);
          toast.error("Login Now");
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, []);

  return null;
}
