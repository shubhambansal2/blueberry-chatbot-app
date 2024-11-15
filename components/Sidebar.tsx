"use client";

import Image from "next/image";
import { cn } from "../lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconHome2,
  IconSettings,
  IconTool,
  IconUserBolt,
  IconMessage2Code,
  IconApi,
  IconMenu2,
  IconMessages,
  IconRotate,
  IconX,
  IconArrowNarrowLeft,
  IconChecklist,
  IconRocket,
  IconBook,
  IconLogout,
  IconInbox,
  IconBook2,
  IconLink,
  IconNotebook,
  IconMailbox,
  IconInboxOff,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";



export function SidebarLayout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const primaryLinks = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome2 className="h-5 w-5 flex-shrink-0 text-black " />
      ),
    },
    {
      label: "Build New Chatbot",
      href: "/createchatbot",
      icon: (
        <IconTool className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Chatbots",
      href: "/testchatbot",
      icon: (
        <IconMessage2Code className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Deployment",
      href: "#",
      icon: (
        <IconRocket className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Inbox",
      href: "/chatbotmessages",
      icon: (
        <IconInbox  className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Resources",
      href: "#",
      icon: (
        <IconNotebook className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Integrations (Coming Soon)",
      href: "#",
      icon: (
        <IconApi className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
      ),
    }
  ];

  const [open, setOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState(() => "/");

  // Update currentPath when the component mounts
  React.useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <div className={cn(
      "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-primary/20 bg-tertiary/10 md:flex-row",
      "h-screen",
      className
    )}>
      <div className="h-full relative">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="flex flex-col h-full">
            {/* Top Section with Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <Logo showText={open} />
              <div className="mt-8 flex flex-col">
                {primaryLinks.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="absolute bottom-0 left-4 right-0 bg-inherit pb-4">
              <SidebarLink
                link={{
                  label: "Shubham Bansal",
                  href: "#",
                  icon: <IconUserBolt className="h-5 w-5 flex-shrink-0 text-neutral-700" />
                }}
              />
              <SidebarLink
                link={{
                  label: "Logout", 
                  href: "/logout",
                  icon: <IconLogout className="h-5 w-5 flex-shrink-0 text-neutral-700" />
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}



interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
  }: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    // Initialize state from localStorage
    const [openState, setOpenState] = useState(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sidebarState');
        return saved ? JSON.parse(saved) : true; // Default to true if no saved state
      }
      return true;
    });
  
    // Update localStorage when state changes
    useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarState', JSON.stringify(openState));
      }
    }, [openState]);
  
    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  
    return (
      <SidebarContext.Provider value={{ open, setOpen }}>
        {children}
      </SidebarContext.Provider>
    );
  };

export const Sidebar = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};
export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();

  return (
    <motion.div
      className={cn(
        "group/sidebar relative hidden h-full flex-shrink-0 rounded-xl px-4 py-4 bg-slate-150 md:flex md:flex-col",
        "border-r border-gray-200 shadow-lg", // Added border and shadow
        className
      )}
      onMouseEnter={() => setOpen(true)} // Expand on hover
      onMouseLeave={() => setOpen(false)} // Collapse when hover ends
      animate={{
        width: open ? "300px" : "70px",
      }}
      {...props}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="transition-opacity duration-500 ease-in-out"
          >
            {children}
          </motion.div>
        )}
        {!open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="transition-opacity duration-500 ease-in-out"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};



export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open } = useSidebar();
  const pathname = usePathname();
  
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      className={cn(
        "group/sidebar flex items-center justify-start gap-2 rounded-sm px-2 py-2 transition-colors duration-200",
        "hover:bg-secondary/50",
        "overflow-hidden",
        isActive && "bg-primary text-black",
        !isActive && "text-neutral-700",
        className,
      )}
      {...props}
    >
      <div className={cn(
        "flex-shrink-0 transition-colors",
        isActive ? "text-black" : "text-neutral-700",
        "group-hover/sidebar:text-black"
      )}>
        {link.icon}
      </div>

      <motion.div
        initial={false}
        animate={{
          width: open ? "auto" : 0,
          opacity: open ? 1 : 0
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
        className="flex items-center"
      >
        <span className={cn(
          "inline-block whitespace-nowrap text-sm",
          isActive ? "text-black" : "text-neutral-700",
          "group-hover/sidebar:text-black"
        )}>
          {link.label}
        </span>
      </motion.div>
    </Link>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <motion.div
      className={cn(
        "flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4  md:hidden",
      )}
      {...props}
    >
      <div className="z-20 flex w-full justify-end">
        <IconMenu2
          className="text-neutral-800 "
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-white p-10 ",
              className,
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children as React.ReactNode}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};




  // export function CollapsibleSidebar() {
  //   return (
  //     <SidebarLayout>
  //       <Dashboard />
  //     </SidebarLayout>
  //   );
  // }


// Dummy dashboard component with content
// const Dashboard = () => {
//   return (
//     <div className="m-2 flex flex-1">
//       <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-2  md:p-10">
//         <div className="flex gap-2">
//           {[...new Array(4)].map((_, i) => (
//             <div
//               key={"first-array" + i}
//               className="h-20 w-full animate-pulse rounded-lg bg-gray-100 "
//             ></div>
//           ))}
//         </div>
//         <div className="flex flex-1 gap-2">
//           {[...new Array(2)].map((_, i) => (
//             <div
//               key={"second-array" + i}
//               className="h-full w-full animate-pulse rounded-lg bg-gray-100 "
//             ></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// {
//   label: "Build New Chatbot",
//   href: "/createchatbot",
//   icon: (
//     <IconTool className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
//   ),
// },
// {
//   label: "Chatbots",
//   href: "/testchatbot",
//   icon: (
//     <IconMessage2Code className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
//   ),
// },
// {
//   label: "Deployment",
//   href: "#",
//   icon: (
//     <IconRocket className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
//   ),
// },
// {
//   label: "Inbox",
//   href: "/chatbotmessages",
//   icon: (
//     <IconInbox className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
//   ),
// },
// {
//   label: "Integrations",
//   href: "#",
//   icon: (
//     <IconApi className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
//   ),
// },

// {
//   label: "Resources",
//   href: "#",
//   icon: (
//     <IconBook className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
//   ),
// }