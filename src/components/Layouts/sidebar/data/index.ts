import * as Icons from "../icons";

export interface NavItem {
  title: string;
  icon: React.ComponentType;
  url?: string;
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const getNavData = (isLoggedIn: boolean): NavSection[] => {
  const mainSection: NavSection = {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "Rooms",
        url: "/rooms/",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Bookings",
        url: "/bookings",
        icon: Icons.Calendar,
        items: [],
      },
    ],
  };

  const authSection: NavSection = {
    label: "AUTHENTICATION",
    items: [
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  };

  return isLoggedIn ? [mainSection] : [mainSection, authSection];
};