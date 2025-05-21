"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

interface UserData {
  name?: string;
  email?: string;
  img?: string;
}

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData: UserData = JSON.parse(storedUser);
          
          // Validasi data
          const validatedData = {
            name: userData?.name || 'Guest User',
            email: userData?.email || 'No email',
            img: userData?.img || '/images/user/user-03.png'
          };

          setUser(validatedData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Handle perubahan dari tab/window lain
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUserData();
      }
    };

    // Handle perubahan dari tab/window yang sama (custom event)
    const handleLocalUserChange = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-user-change', handleLocalUserChange);

    // Load data pertama kali
    loadUserData();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-user-change', handleLocalUserChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    window.location.href = '/auth/login';
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="hidden lg:block space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Link 
        href="/auth/login"
        className="text-primary hover:underline px-4 py-2 rounded-lg border border-primary"
      >
        Login
      </Link>
    );
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={user.img || '/images/user/user-03.png'}
            className="size-12 rounded-full object-cover border-2 border-primary"
            alt={`Avatar of ${user.name}`}
            width={48}
            height={48}
            priority
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span className="truncate max-w-[120px]">{user.name}</span>
            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={user.img || '/images/user/user-03.png'}
            className="size-12 rounded-full object-cover border-2 border-primary"
            alt={`Avatar of ${user.name}`}
            width={48}
            height={48}
            priority
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white truncate">
              {user.name}
            </div>
            <div className="leading-none text-gray-6 dark:text-dark-6 truncate">
              {user.email}
            </div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon className="size-5" />
            <span className="mr-auto text-base font-medium">View Profile</span>
          </Link>

          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon className="size-5" />
            <span className="mr-auto text-base font-medium">Settings</span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-5" />
            <span className="text-base font-medium">Log Out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}