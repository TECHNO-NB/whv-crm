// @ts-nocheck

"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import avatar from "../../../../../public/avatar.webp";
import Image from "next/image";
import { RotateCcw } from "lucide-react";  // <-- ADDED

export default function ChatPage() {
  const params = useParams();
  const partnerId = params.id as string;

  const [partner, setPartner] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false); // <-- ADDED

  const userData = useSelector((state: any) => state.user);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  const fetchUser = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${partnerId}`
    );
    setPartner(res.data.data);
  };

  const fetchMessages = async () => {
    setLoading(true);   // <-- ADDED
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages`
    );

    const filtered = res.data.data
      .filter(
        (m: any) =>
          (m.fromUserId === partnerId && m.toUserId === userData.id) ||
          (m.toUserId === partnerId && m.fromUserId === userData.id)
      )
      // @ts-ignore
      .sort((a: any, b: any) => new Date(a.createdAt) - new Date(b.createdAt));

    setMessages(filtered);
    scrollToBottom();
    setLoading(false);  // <-- ADDED
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages`, {
      fromUserId: userData.id,
      toUserId: partnerId,
      body: text,
      channel: "internal",
    });

    setText("");
    fetchMessages();
  };

  useEffect(() => {
    if (!partnerId || !userData?.id) return;
    fetchUser();
    fetchMessages();
  }, [partnerId, userData]);

  return (
    <div className="h-screen flex flex-col ml-28 bg-gradient-to-br from-gray-100 to-gray-200">
      
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white/70 backdrop-blur-lg flex items-center justify-between shadow-sm z-10">
        
        {/* LEFT SIDE: Avatar + Name */}
        <div className="flex items-center gap-3">
          <Image
            alt="avatar"
            height={100}
            width={100}
            src={partner?.avatarUrl || avatar}
            className="h-12 w-12 rounded-full border-2 border-black"
          />
          <div>
            <p className="text-lg font-semibold">{partner?.fullName}</p>
            <p className="text-xs text-gray-500">{partner?.role}</p>
          </div>
        </div>

        {/* RIGHT SIDE: RELOAD BUTTON */}
        <button
          onClick={fetchMessages}
          className="p-2 rounded-full hover:bg-gray-200 transition active:scale-90"
        >
          <RotateCcw
            className={`w-6 h-6 text-gray-600 ${
              loading ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-5 space-y-3 overflow-y-auto">
        {messages.map((msg: any) => {
          const isMine = msg.fromUserId === userData.id;
          return (
            <div
              key={msg.id}
              className={`flex w-full ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm transition-all ${
                  isMine
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white rounded-bl-none border"
                }`}
              >
                {msg.body}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t bg-white sticky bottom-0 flex gap-3 items-center backdrop-blur-lg">
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 shadow-inner">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="border-none bg-transparent focus-visible:ring-0"
          />
        </div>

        <Button
          onClick={sendMessage}
          className="rounded-full px-6 shadow-md hover:shadow-lg transition"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
