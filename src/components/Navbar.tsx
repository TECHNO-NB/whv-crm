import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import logo from "../../public/logo2.jpg"
import Image from "next/image";
const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center min-w-full bg-white backdrop-blur-2xl mx-auto py-4 md:px-12 border-b border-amber-600 h-16 fixed top-0 z-50">
        <h1 className="text-2xl font-bold text-orange-700 flex gap-1 items-center justify-center">
          <Image src={logo} alt="logo" height={45} />  WHV CRM
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="rounded-xl">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
              Register as Volunteer
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
