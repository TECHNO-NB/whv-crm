import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import logo from "../../public/logo2.jpg"
import Image from "next/image";
const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center min-w-full bg-white backdrop-blur-2xl mx-auto py-4 md:px-46 border-b-4 border-amber-600 h-18 fixed top-0 z-50">
        <h1 className="text-2xl font-bold text-orange-700 flex gap-1 items-center justify-center">
          <Image src={logo} alt="logo" height={45} />  WHV CRM
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="outline" className="rounded-xl">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
              Register
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
