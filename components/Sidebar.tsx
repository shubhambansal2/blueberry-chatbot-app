"use client";

import Image from "next/image";
import { cn } from "../lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect, useCallback } from "react";
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
  IconUserPlus,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { debounce } from "lodash";

// Move the user email logic to a separate component
const UserEmailDisplay = () => {
  const [userEmail, setUserEmail] = useState("User");
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/test-auth/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        if (data.email) {
          setUserEmail(data.email);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  return userEmail;
};

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
      href: "/deploychatbot",
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
      label: "Leads",
      href: "/leads",
      icon: (
        <IconUserPlus  className="h-5 w-5 flex-shrink-0 text-neutral-700 " />
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   // Effect to prevent body scroll when mobile menu is open
   useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const MobileNav = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-slate-150 backdrop-blur-sm"
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-lg"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <Logo showText={true} />
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <IconX className="h-6 w-6" />
            </button>
          </div>
          
          <div className="relative flex flex-col h-[calc(100vh-64px)]">
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <nav className="space-y-2">
                {primaryLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-600">{link.icon}</span>
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="mt-auto border-t bg-white px-4 py-4">
              <div className="space-y-2">
                <Link
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <IconUserBolt className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium"><UserEmailDisplay /></span>
                </Link>
                <Link
                  href="/logout"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <IconLogout className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };



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
            <div className="md:hidden p-4 bg-slate-150 border-b">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-slate-150 rounded-md"
        >
          <IconMenu2 className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Navigation with Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && <MobileNav />}
      </AnimatePresence>


      {/* Desktop Sidebar */}
      <div className="h-full relative hidden md:block">
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
                  label: <UserEmailDisplay />,
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
  label: string | React.ReactNode;
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
  const [isHovered, setIsHovered] = useState(false);

  // Move the debounced function outside useCallback
  const debouncedOpenFn = (value: boolean) => {
    setOpen(value);
  };

  const debouncedOpen = useCallback(
    debounce(debouncedOpenFn, 500),
    [setOpen]
  );

  useEffect(() => {
    if (isHovered) {
      debouncedOpen(true);
    }
    
    return () => {
      debouncedOpen.cancel();
    };
  }, [isHovered, debouncedOpen]);

  const handleMouseLeave = () => {
    debouncedOpen.cancel();
    setIsHovered(false);
    setOpen(false);
  };

  return (
    <motion.div
      className={cn(
        "group/sidebar relative hidden h-full flex-shrink-0 rounded-xl px-4 py-4 bg-slate-150 md:flex md:flex-col",
        "border-r border-gray-200 shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        width: open ? "300px" : "70px",
      }}
      transition={{
        duration: 0.8, // Slower width animation
        ease: [0.4, 0, 0.2, 1] // Smooth easing function
      }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6, // Slower opacity animation
              ease: "easeInOut"
            }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
        {!open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6, // Slower opacity animation
              ease: "easeInOut"
            }}
            className="w-full"
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
  ...props // Accept additional props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  // Move hooks to the top level - no conditional execution
  const context = useSidebar();
  const pathname = usePathname();
  
  // Handle case where context is missing
  if (!context) {
    console.error("SidebarLink must be used within a SidebarProvider");
    return null;
  }
  
  const { open } = context;
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
  return (
    <SidebarProvider>
      <MobileSidebarContent className={className} {...props}>
        {children}
      </MobileSidebarContent>
    </SidebarProvider>
  );
};

const MobileSidebarContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <motion.div
      className={cn(
        "flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 bg-slate-150 md:hidden",
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