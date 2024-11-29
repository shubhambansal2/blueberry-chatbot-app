import { cn } from "../../lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
 
type DockItem = {
  title: string;
  details: string;
  icon: React.ReactNode;
  href: string;
  id: string;
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  selectedId,
  onSelect,
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) => {
  return (
    <>
      <FloatingDockDesktop 
        items={items} 
        className={desktopClassName} 
        selectedId={selectedId}
        onSelect={onSelect}
      />
      {/* <FloatingDockMobile 
        items={items} 
        className={mobileClassName}
        selectedId={selectedId}
        onSelect={onSelect}
      /> */}
    </>
  );
};
 
// const FloatingDockMobile = ({
//   items,
//   className,
//   selectedId,
//   onSelect,
// }: {
//   items: DockItem[];
//   className?: string;
//   selectedId?: string;
//   onSelect?: (id: string) => void;
// }) => {
//   const [open, setOpen] = useState(false);

//   const handleItemClick = (id: string, href: string, e: React.MouseEvent) => {
//     e.preventDefault();
//     onSelect?.(id);
//   };

//   return (
//     <div className={cn("relative block md:hidden", className)}>
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             layoutId="nav"
//             className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
//           >
//             {items.map((item, idx) => {
//               const isSelected = item.id === selectedId;
//               return (
//                 <motion.div
//                   key={item.title}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   exit={{
//                     opacity: 0,
//                     y: 10,
//                     transition: {
//                       delay: idx * 0.05,
//                     },
//                   }}
//                   transition={{ delay: (items.length - 1 - idx) * 0.05 }}
//                 >
//                   <Link
//                     href={item.href}
//                     key={item.title}
//                     className={cn(
//                       "flex flex-col items-center gap-1 p-2 rounded-lg",
//                       isSelected && "ring-2 ring-blue-500"
//                     )}
//                     onClick={(e) => handleItemClick(item.id, item.href, e)}
//                   >
//                     <div className={cn(
//                       "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
//                       isSelected 
//                         ? "bg-blue-100 dark:bg-blue-900" 
//                         : "bg-gray-50"
//                     )}>
//                       <div className={cn(
//                         "h-4 w-4",
//                         isSelected && "text-blue-600 dark:text-blue-400"
//                       )}>
//                         {item.icon}
//                       </div>
//                     </div>
//                     <span className={cn(
//                       "text-xs text-black dark:text-white",
//                       isSelected && "text-blue-600 dark:text-blue-400"
//                     )}>
//                       {item.title}
//                     </span>
//                   </Link>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <button
//         onClick={() => setOpen(!open)}
//         className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center"
//       >
//         <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
//       </button>
//     </div>
//   );
// };
const FloatingDockDesktop = ({
  items,
  className,
  selectedId,
  onSelect,
}: {
  items: DockItem[];
  className?: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex flex-col md:flex-row h-auto md:h-24 gap-3 md:gap-6 items-start rounded-2xl bg-white px-3 md:px-4 py-2 md:py-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer 
          mouseX={mouseX} 
          key={item.title} 
          {...item} 
          isSelected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
};
 
function IconContainer({
  mouseX,
  title,
  details,
  icon,
  href,
  id,
  isSelected,
  onSelect,
}: {
  mouseX: MotionValue;
  title: string;
  details: string;
  icon: React.ReactNode;
  href: string;
  id: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}) {
  let ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
 
  let widthTransform = useTransform(distance, [-150, 0, 150], [30, 60, 30]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [30, 60, 30]);
  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [15, 30, 15]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [15, 30, 15]);
  let scaleTransform = useTransform(distance, [-150, 0, 150], [0.9, 1, 0.9]);
 
  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
 
  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
 
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect?.(id);
  };
 
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center md:flex-col p-1.5 md:p-2 rounded-lg w-full md:w-auto",
        isSelected && "ring-2 ring-blue-500"
      )} 
      onClick={handleClick}
    >
      <div className="relative">
        <motion.div
          ref={ref}
          style={{ 
            width: isMobile ? 40 : width, 
            height: isMobile ? 40 : height 
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "aspect-square rounded-full flex items-center justify-center transition-colors",
            isSelected 
              ? "bg-blue-100 dark:bg-blue-900" 
              : "bg-gray-200 dark:bg-neutral-800"
          )}
        >
          <AnimatePresence>
            {hovered && !isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 2, x: "-50%" }}
                className="px-2 py-1.5 whitespace-pre rounded-lg bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-14 w-40 text-[10px] md:text-xs"
              >
                <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {details}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            style={{ 
              width: isMobile ? 20 : widthIcon,
              height: isMobile ? 20 : heightIcon
            }}
            className={cn(
              "flex items-center justify-center",
              isSelected && "text-blue-600 dark:text-blue-400"
            )}
          >
            {icon}
          </motion.div>
        </motion.div>
      </div>
      <motion.span 
        className={cn(
          "ml-2 md:ml-0 md:mt-2 text-xs md:text-sm font-medium text-black",
          isSelected && "text-blue-600 dark:text-blue-400"
        )}
        style={{
          scale: isMobile ? 1 : scaleTransform
        }}
      >
        {title}
      </motion.span>
    </Link>
  );
}