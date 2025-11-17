// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import avatar from  "../../../../public/avatar.webp"
import Image from "next/image";

export default function MessagesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [messageCount, setMessageCount] = useState([]);

  // ✅ Logged-in user data from Redux
  const userData = useSelector((state: any) => state.user);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        { withCredentials: true }
      );
      setUsers(res.data.data);
      console.log("++++++++++users", res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMessageCount = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages/private-message-count`
      );
      setMessageCount(res.data.data);
      
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMessageCount();
  }, []);

  const showCount = (id: any) => {
    let count = 0;
    messageCount.map((val: any) => {
      if (val.fromUserId === id) count++;
    });

    return count;
  };

  // ✅ Remove My Own Account
  const userList = users.filter((u) => u.id !== userData.id);

  // ✅ Search filter
  const filteredUsers = userList.filter((u) => {
    const key = search.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(key) ||
      u.countryName?.toLowerCase().includes(key) ||
      u.role.toLowerCase().includes(key)
    );
  });

  return (
    <div className="h-screen flex bg-white ml-28">
      {/* Left Sidebar */}
      <div className="w-full max-w-sm border-r bg-gray-50 flex flex-col">
        {/* Search Bar */}
        <div className="p-4">
          <Input
            placeholder="Search name, country or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User List */}
        <ScrollArea className="flex-1">
          {filteredUsers.map((u) => (
            <Link
              key={u.id}
              href={`/admin/messages/${u.id}`}
              className="flex items-center gap-3 p-4 hover:bg-gray-200 cursor-pointer border-b"
            >
              <div className=" flex">
                <div>
                    <div className="flex gap-2">

                  <Image
                  alt="avatar"
                  width={100}
                  height={100}
                  quality={100}
                  src={u.avatarUrl || avatar}
                  className="w-12 h-12 rounded-full object-cover border-2 border-black"
                  />
                  
                  <div>
        <div className="flex flex-col">
                    <p className="font-semibold">{u.fullName}</p>
                     <p className="w-fit mt-0">{u.countryName}</p>
                    <span className="text-sm text-gray-600">
                      {u.email || "Unknown"}
                    </span>
                    <Badge className="w-fit mt-1">{u.role}</Badge>
                  </div>
                  </div>
                  </div>
                </div>

                {showCount(u.id) > 0 ? (
                  <div className=" relative">
                    <p className="bg-red-500 absolute rounded-full w-4 h-4 text-center flex items-center justify-center text-white">
                      {showCount(u.id)}
                    </p>
                    <Bell color="red" />
                  </div>
                ) : null}
              </div>
            </Link>
          ))}

          {filteredUsers.length === 0 && (
            <p className="p-4 text-gray-500">No users found...</p>
          )}
        </ScrollArea>
      </div>

      {/* Right Side (Empty State) */}
      <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">
        Select a user to start chat
      </div>
    </div>
  );
}
