// @ts-nocheck

"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Trash2,
  Users,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast from "react-hot-toast";

type UserRole =
  | "chairman"
  | "country_manager"
  | "finance"
  | "legal"
  | "hr"
  | "admin"
  | "it"
  | "councilor"
  | "volunteer"
  | "viewer";


interface Country {
  id: string;
  countryName: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  countryId: string;
  countryName?: string;
  avatarUrl: string;
}

const ALL_ROLES: UserRole[] = [
  "chairman",
  "country_manager",
  "finance",
  "legal",
  "hr",
  "admin",
  "it",
  "councilor",
  "volunteer",
  "viewer",
];




// Avatar + Name Cell
const UserCell: React.FC<{ user: User }> = ({ user }) => (
  <div className="flex items-center space-x-3">
    <Avatar className="h-9 w-9">
      <AvatarImage src={user.avatarUrl} alt={user.fullName} />
      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
    </Avatar>
    <div>
      <p className="font-medium text-sm">{user.fullName}</p>
      <p className="text-muted-foreground text-xs">{user.email}</p>
      <p className="text-xs text-muted-foreground">{user.countryName}</p>
    </div>
  </div>
);

// Role Badge
const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const getVariant = (r: UserRole) => {
    switch (r) {
      // @ts-ignore
      case "Country Manager":
        return "default";
         // @ts-ignore
      case "IT Head":
        return "secondary";
         // @ts-ignore
      case "Lawyer":
        return "outline";
         // @ts-ignore
      case "Admin":
        return "destructive";
         // @ts-ignore
      case "Volunteer":
        return "default";
      default:
        return "secondary";
    }
  };
  return <Badge variant={getVariant(role)}>{role}</Badge>;
};

// Action Menu
const ActionCell: React.FC<{
  user: User;
  onRoleChange: (user: User) => void;
  onDelete: (user: User) => void;
}> = ({ user, onRoleChange, onDelete }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onSelect={() => onRoleChange(user)}>
        <UserCheck className="mr-2 h-4 w-4" /> Change Role
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-red-600 focus:text-red-600 focus:bg-red-50"
        onSelect={() => onDelete(user)}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Delete User
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Role Dialog
interface RoleChangeDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, newRole: UserRole) => void;
}

const RoleChangeDialog: React.FC<RoleChangeDialogProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [newRole, setNewRole] = useState<UserRole | undefined>();

  useEffect(() => {
    setNewRole(user?.role);
  }, [user]);

  const handleSave = () => {
    if (user && newRole) {
      onSave(user.id, newRole);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Role for {user?.fullName}</DialogTitle>
          <DialogDescription>
            Update the system role for this user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              New Role
            </Label>
            <Select
              onValueChange={(value) => setNewRole(value as UserRole)}
              defaultValue={user?.role}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={newRole === user?.role}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Table
const UserTable: React.FC<{
  users: User[];
  onRoleChange: (user: User) => void;
  onDelete: (user: User) => void;
}> = ({ users, onRoleChange, onDelete }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">User</TableHead>
          <TableHead className="w-[150px]">Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <UserCell user={user} />
              </TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell className="text-right">
                <ActionCell
                  user={user}
                  onRoleChange={onRoleChange}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

// MAIN PAGE
const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedTab, setSelectedTab] = useState<UserRole | "All">("All");

  // Fetch countries
  useEffect(() => {
    axios.defaults.withCredentials=true;
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`);
        setCountries(res.data.data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      axios.defaults.withCredentials=true;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`);
      setUsers(res.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleSave = async (userId: string, newRole: UserRole) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}/role`, { role: newRole });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName}?`)) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${user.id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChangeClick = (user: User) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  // Filter users by country and role
  const filteredUsers = users.filter((user) => {
    const countryMatch = selectedCountry === "All" || user.countryId === selectedCountry;
    const roleMatch = selectedTab === "All" || user.role === selectedTab;
    return countryMatch && roleMatch;
  });

  return (
    <div className="flex flex-col space-y-6 p-8 ml-28">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold flex items-center">
          <Users className="h-8 w-8 mr-3 text-primary" /> User Management
        </h1>
       
      </header>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Label>Country:</Label>
        <Select
          onValueChange={(value) => setSelectedCountry(value)}
          defaultValue="All"
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.countryName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for roles */}
      <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as any)}>
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
          {ALL_ROLES.map((role) => (
            <TabsTrigger key={role} value={role}>{role}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <UserTable users={filteredUsers} onRoleChange={handleRoleChangeClick} onDelete={handleDeleteUser} />

      <RoleChangeDialog
        user={selectedUser}
        isOpen={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        onSave={handleRoleSave}
      />
    </div>
  );
};

export default UserManagementPage;
