"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component

// Helper for relative time (e.g., "5 minutes ago")
import TimeAgo from 'react-timeago'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import enStrings from 'react-timeago/lib/language-strings/en'

const formatter = buildFormatter(enStrings);

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Notification {
  id: string;
  userId?: string;
  user?: User;
  channel: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("internal");
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Selected notification for right panel
  const [selectedNotification, setSelectedNotification] = useState<
    Notification | null
  >(null);

  // --- Data Fetching ---

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/notifications`,
        { withCredentials: true }
      );
      setNotifications(res.data.data);
      if (res.data.data.length > 0 && !selectedNotification) {
        setSelectedNotification(res.data.data[0]); // Select first if none is selected
      } else if (selectedNotification) {
          // If a notification was already selected, try to re-select it after refresh
          // @ts-ignore
          const updatedSelected = res.data.data.find(n => n.id === selectedNotification.id);
          setSelectedNotification(updatedSelected || res.data.data[0] || null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch notifications");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`, {
        withCredentials: true,
      });
      setUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  // --- Create Notification ---

  const createNotification = async () => {
    if (!title || !body || !channel) {
      toast.error("Title, body, and channel are required");
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/notifications`,
        { title, body, channel, userId },
        { withCredentials: true }
      );
      toast.success("Notification created successfully");
      setTitle("");
      setBody("");
      setChannel("internal");
      setUserId(undefined);
      fetchNotifications();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create notification");
    }
  };

  // --- Filtering ---

  const filteredNotifications = notifications.filter((n) => {
    const key = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(key) ||
      n.body.toLowerCase().includes(key) ||
      n.user?.fullName?.toLowerCase().includes(key) ||
      n.channel.toLowerCase().includes(key)
    );
  });

  // Modern UI Rendering
  return (
    <div className="h-screen flex bg-gray-100 font-sans text-gray-900 ml-28">
      {/* Left Panel: Notification Management (Narrower and on a distinct background) */}
      <div className="w-full max-w-lg flex flex-col border-r border-gray-200 bg-white shadow-xl">
        
        {/* Create Notification Form */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🚀 Send New Notification</h2>
          
          <Input
            placeholder="Title (e.g., 'System Maintenance Alert')"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3 focus-visible:ring-blue-500"
          />
          <Textarea 
            placeholder="Body (e.g., 'The system will be down for 2 hours tonight...')"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mb-3 resize-none focus-visible:ring-blue-500"
            rows={3}
          />
          
          <div className="flex gap-3 mb-4">
            <Select onValueChange={setChannel} value={channel}>
              <SelectTrigger className="w-full focus:ring-blue-500">
                <SelectValue placeholder="Select Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal (In-App)</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setUserId} value={userId}>
              <SelectTrigger className="w-full focus:ring-blue-500">
                <SelectValue placeholder="Recipient (All Users)" />
              </SelectTrigger>
              <SelectContent>
                {/* @ts-ignore */}
                 <SelectItem value={undefined}>All Users</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={createNotification} className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            Create & Send
          </Button>
        </div>

        {/* Search Bar and List Header */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-gray-300 focus-visible:ring-blue-500"
          />
        </div>

        {/* Notifications List (Modern Scroll Area with Card-like items) */}
        <ScrollArea className="flex-1 p-4 bg-white">
          <div className="space-y-3"> {/* Gap between cards */}
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedNotification(n)}
                className={`
                  p-4 rounded-lg border transition-all duration-200 ease-in-out
                  ${selectedNotification?.id === n.id
                    ? "bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200" // Selected state
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-blue-300 cursor-pointer shadow-sm" // Modern hover state
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* User Avatar Placeholder / Icon */}
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                      {n.user ? n.user.fullName[0] : 'A'} {/* First letter of user or 'A' for All */}
                    </div>
                    <p className="font-semibold text-gray-800 text-base truncate max-w-[calc(100%-100px)]">
                      {n.title}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${
                        n.channel === 'internal' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        n.channel === 'email' ? 'bg-green-50 text-green-700 border-green-200' :
                        n.channel === 'sms' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        n.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {n.channel}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                  {n.body}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                   <span className="font-medium text-gray-500">
                    {n.user ? `To: ${n.user.fullName}` : 'To: All Users'}
                  </span>
                  {/* @ts-ignore */}
                  <TimeAgo date={n.createdAt} formatter={formatter} className="text-gray-400 text-xs"/>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <p className="p-6 text-center text-gray-500 italic">
                No notifications found. Try creating one!
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel: Notification Details (Clean and spacious) */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
        {selectedNotification ? (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
            
            {/* Header/Title Section */}
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                    {selectedNotification.title}
                </h1>
                 <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span>{selectedNotification.user ? selectedNotification.user.fullName : 'All Users'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>{new Date(selectedNotification.createdAt).toLocaleString()}</span>
                    </div>
                 </div>
            </div>

            {/* Body Section */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200">
                <p className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedNotification.body}
                </p>
            </div>

            {/* Metadata Section */}
            <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional Details</h3>
                 <div className="flex items-center gap-3 flex-wrap">
                    <Badge 
                        className={`capitalize text-sm font-medium px-3 py-1 rounded-full ${
                            selectedNotification.channel === 'internal' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' :
                            selectedNotification.channel === 'email' ? 'bg-green-500 hover:bg-green-600 text-white' :
                            selectedNotification.channel === 'sms' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                            selectedNotification.channel === 'whatsapp' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' :
                            'bg-gray-500 hover:bg-gray-600 text-white'
                        }`}
                    >
                        <span className="mr-1">#</span>{selectedNotification.channel}
                    </Badge>
                     {selectedNotification.user && (
                         <Badge 
                            variant="secondary" 
                            className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-19 4v7a2 2 0 002 2h16a2 2 0 002-2v-7"></path></svg>
                            {selectedNotification.user.email}
                        </Badge>
                     )}
                </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 text-2xl h-full bg-white border border-dashed rounded-xl shadow-sm p-8">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            <p className="font-semibold mb-2 text-gray-500">No Notification Selected</p>
            <p className="text-lg text-gray-500 text-center">
              Click on a notification on the left to view its full details here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}