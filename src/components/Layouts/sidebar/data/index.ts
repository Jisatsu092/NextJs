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

export const getNavData = (isLoggedIn: boolean): NavSection[] => [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/",
          },
        ],
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
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Icons.Calendar,
      //   items: [],
      // },
      // {
      //   title: "Profile",
      //   url: "/profile",
      //   icon: Icons.User,
      //   items: [],
      // },
      // {
      //   title: "Forms",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Form Elements",
      //       url: "/forms/form-elements",
      //     },
      //     {
      //       title: "Form Layout",
      //       url: "/forms/form-layout",
      //     },
      //   ],
      // },
      // {
      //   title: "Tables",
      //   url: "/tables",
      //   icon: Icons.Table,
      //   items: [
      //     {
      //       title: "Tables",
      //       url: "/tables",
      //     },
      //   ],
      // },
  //     {
  //       title: "Pages",
  //       icon: Icons.Alphabet,
  //       items: [
  //         {
  //           title: "Settings",
  //           url: "/pages/settings",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "OTHERS",
  //   items: [
      
      // {
      //   title: "Charts",
      //   icon: Icons.PieChart,
      //   items: [
      //     {
      //       title: "Basic Chart",
      //       url: "/charts/basic-chart",
      //     },
      //   ],
      // },
      // {
      //   title: "UI Elements",
      //   icon: Icons.FourCircle,
      //   items: [
      //     {
      //       title: "Alerts",
      //       url: "/ui-elements/alerts",
      //     },
      //     {
      //       title: "Buttons",
      //       url: "/ui-elements/buttons",
      //     },
      //   ],
      // },
      ...(!isLoggedIn
        ? [
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
        ]
        : []),
    ],
  },
];