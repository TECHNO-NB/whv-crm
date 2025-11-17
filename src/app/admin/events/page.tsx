"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  PaperclipIcon,
  PlusCircleIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// --- INTERFACES (Keep these the same) ---
interface User {
  id: string;
  fullName: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  organizerId?: string;
  organizer?: User;
  attendees?: any;
  location?: string;
  attachments?: string[];
  createdAt: string;
}
// --- END INTERFACES ---

export default function EventsPage() {
  // State for data
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state for Dialog
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [organizerId, setOrganizerId] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [attachments, setAttachments] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Selected event for right panel
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // --- API Handlers ---
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events`);
      setEvents(res.data.data);
      // Automatically select the first event if the list is not empty
      if (res.data.data.length > 0 && !selectedEvent) {
        setSelectedEvent(res.data.data[0]);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`);
      setUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  // --- CRUD Handlers ---
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartAt("");
    setEndAt("");
    setOrganizerId(undefined);
    setLocation("");
    setAttachments("");
  };

  const createEvent = async () => {
    if (!title || !startAt) {
      toast.error("Title and Start Date are required");
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events`, {
        title,
        description,
        startAt,
        endAt: endAt || null,
        organizerId,
        location,
        attachments: attachments ? attachments.split(",").map(a => a.trim()).filter(a => a.length > 0) : [],
      });
      toast.success("Event created successfully 🎉");
      resetForm();
      setIsDialogOpen(false); // Close the dialog
      fetchEvents();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create event");
    }
  };

  // --- Filtering ---
  const filteredEvents = events.filter((e) => {
    const key = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(key) ||
      e.description?.toLowerCase().includes(key) ||
      e.organizer?.fullName?.toLowerCase().includes(key) ||
      e.location?.toLowerCase().includes(key)
    );
  });

  // --- Sub-Components ---
  const EventCreationDialog = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          <PlusCircleIcon className="w-4 h-4 mr-2" /> Create New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a New Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input id="title" placeholder="Team Planning Meeting" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Agenda items, goals, etc." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startAt">Start Date/Time <span className="text-red-500">*</span></Label>
              <Input id="startAt" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endAt">End Date/Time</Label>
              <Input id="endAt" type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Organizer</Label>
            <Select onValueChange={setOrganizerId} value={organizerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Event Organizer" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Conference Room A / Zoom Link" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <Input id="attachments" placeholder="URL 1, URL 2, ..." value={attachments} onChange={(e) => setAttachments(e.target.value)} />
            <p className="text-xs text-muted-foreground">Comma separated URLs</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createEvent} disabled={!title || !startAt}>
            Confirm Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const EventListCard = ({ event }: { event: Event }) => (
    <Card
      key={event.id}
      onClick={() => setSelectedEvent(event)}
      className={`mb-2 cursor-pointer transition-all ${selectedEvent?.id === event.id ? "border-blue-500 bg-blue-50 shadow-md" : "hover:border-primary/50 hover:bg-gray-50"}`}
    >
      <CardContent className="p-4 space-y-1">
        <h3 className="font-semibold text-base truncate">{event.title}</h3>
        {event.organizer && (
          <p className="text-sm text-muted-foreground flex items-center">
            <UserIcon className="w-3 h-3 mr-1" />
            {event.organizer.fullName}
          </p>
        )}
        <div className="flex items-center text-xs text-gray-500">
          <ClockIcon className="w-3 h-3 mr-1" />
          {format(new Date(event.startAt), "MMM d, h:mm a")}
        </div>
      </CardContent>
    </Card>
  );

  const EventDetailsPanel = ({ event }: { event: Event }) => (
    <Card className="shadow-lg h-full overflow-hidden ">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-3xl font-extrabold text-primary">{event.title}</CardTitle>
        <p className="text-sm text-muted-foreground flex items-center">
          <CalendarIcon className="w-4 h-4 mr-1" />
          Created on {format(new Date(event.createdAt), "PPP")}
        </p>
      </CardHeader>
      <ScrollArea className="h-full p-6">
        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold border-b pb-1">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {event.description || "No detailed description provided."}
            </p>
          </div>

          <Separator />

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-blue-500" /> Start Time
              </h4>
              <p className="text-base font-semibold">{format(new Date(event.startAt), "PPpp")}</p>
            </div>
            {event.endAt && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2 text-red-500" /> End Time
                </h4>
                <p className="text-base font-semibold">{format(new Date(event.endAt), "PPpp")}</p>
              </div>
            )}
            {event.organizer && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-green-500" /> Organizer
                </h4>
                <p className="text-base">{event.organizer.fullName}</p>
              </div>
            )}
            {event.location && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-2 text-purple-500" /> Location
                </h4>
                <p className="text-base">{event.location}</p>
              </div>
            )}
          </div>

          {/* Attachments */}
          {event.attachments && event.attachments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center border-b pb-1">
                  <PaperclipIcon className="w-5 h-5 mr-2" /> Attachments
                </h3>
                <div className="flex flex-wrap gap-3">
                  {event.attachments.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <PaperclipIcon className="w-3 h-3 mr-1" />
                      Link {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Attendees placeholder */}
          {/* <Separator />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Attendees</h3>
            <p className="text-gray-500">Feature coming soon...</p>
          </div> */}
        </div>
      </ScrollArea>
    </Card>
  );

  // --- Main Layout ---
  return (
    <div className="flex min-h-screen bg-background antialiased ml-28">
      {/* Left Sidebar: Event List and Creation */}
      <div className="w-full max-w-md border-r bg-card flex flex-col p-4 shadow-xl">
        <h1 className="text-2xl font-bold mb-4">🗓️ Events Dashboard</h1>
        
        {/* Creation/Search */}
        <div className="mb-4 space-y-4">
          {EventCreationDialog}
          <Input
            placeholder="Search by title, organizer, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10"
          />
        </div>

        <Separator className="mb-4" />

        {/* Events List */}
        <ScrollArea className="flex-1 pr-2">
          {loading ? (
            <p className="p-4 text-center text-gray-500">Loading events...</p>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((e) => <EventListCard key={e.id} event={e} />)
          ) : (
            <div className="p-4 text-center text-gray-500">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
              <p>No events found matching your criteria.</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Panel: Event Details */}
      <div className="flex-1 p-8 bg-gray-50">
        {selectedEvent ? (
          <EventDetailsPanel event={selectedEvent} />
        ) : (
          <div className="flex items-center justify-center text-gray-400 text-xl h-full border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <CalendarIcon className="w-10 h-10 mx-auto mb-4" />
              <p className="font-semibold">Select an event from the left panel</p>
              <p className="text-base mt-1">to view its full details.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}