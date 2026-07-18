"use client";

import { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiPackage,
  FiFolder,
  FiShoppingBag,
  FiMessageSquare,
  FiFileText,
  FiImage,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiList,
  FiHome,
  FiVideo,
} from "react-icons/fi";

interface AdminNavContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isMobile: boolean;
}

const AdminNavContext = createContext<AdminNavContextType>({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => {},
  isMobile: false,
});

export function useAdminNav() {
  return useContext(AdminNavContext);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  if (typeof window !== "undefined") {
    setIsMobile(window.innerWidth < 768);
  }

  return isMobile;
}

const navItems = [
  { href: "/admin/dashboard", icon: FiGrid, label: "Dashboard" },
  { href: "/admin/products", icon: FiPackage, label: "Products" },
  { href: "/admin/categories", icon: FiFolder, label: "Categories" },
  { href: "/admin/collections", icon: FiShoppingBag, label: "Collections" },
  { href: "/admin/orders", icon: FiShoppingBag, label: "Orders" },
  { href: "/admin/inquiries", icon: FiMessageSquare, label: "Inquiries" },
  { href: "/admin/blog", icon: FiFileText, label: "Blog" },
  { href: "/admin/videos", icon: FiVideo, label: "Videos" },
  { href: "/admin/homepage/section-management", icon: FiHome, label: "Homepage Sections" },
  { href: "/admin/media", icon: FiImage, label: "Media" },
  { href: "/admin/settings", icon: FiSettings, label: "Settings" },
];

const bottomNavItems = [
  { href: "/admin/dashboard", icon: FiGrid, label: "Home" },
  { href: "/admin/products", icon: FiPackage, label: "Products" },
  { href: "/admin/orders", icon: FiShoppingBag, label: "Orders" },
  { href: "/admin/homepage/section-management", icon: FiSettings, label: "Sections" },
  { href: "/admin/settings", icon: FiSettings, label: "More" },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-[#1a1308] border-t border-white/10">
        <div className="flex justify-around py-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  isActive ? "text-[#d8a928]" : "text-gray-400"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function AdminSidebar({ admin, onClose, isMobile = false }: { admin: any; onClose?: () => void; isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {isMobile && onClose && (
        <div 
          className="fixed inset-0 z-40 bg-black/50" 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
        />
      )}
      <motion.aside
        initial={isMobile ? { x: -280 } : false}
        animate={{ x: 0 }}
        className={isMobile 
          ? "fixed left-0 top-0 z-50 h-screen w-64 bg-[#1a1308] text-white"
          : "h-full w-64 bg-[#1a1308] text-white"
        }
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex-1">
            <Link href="/admin/dashboard" className="text-lg font-bold text-[#d8a928]">
              MM Laptop Center Admin
            </Link>
          </div>
          {isMobile && onClose && (
            <div onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 rounded-lg hover:bg-white/10 cursor-pointer">
              <FiX className="h-5 w-5 cursor-pointer" />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onClose) onClose();
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#d8a928]/20 text-[#d8a928]"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8a928] text-sm font-bold text-[#0a0a0a]">
              {admin?.name?.[0] || admin?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{admin?.name || admin?.email || "Admin"}</p>
              <p className="truncate text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/profile"
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose();
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
            >
              <FiUser className="h-4 w-4" />
              Profile
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export function AdminMobileHeader({ admin }: { admin: any }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getTitle = () => {
    if (pathname === "/admin/dashboard") return "Dashboard";
    if (pathname?.startsWith("/admin/products")) return "Products";
    if (pathname?.startsWith("/admin/categories")) return "Categories";
    if (pathname?.startsWith("/admin/collections")) return "Collections";
    if (pathname?.startsWith("/admin/orders")) return "Orders";
    if (pathname?.startsWith("/admin/inquiries")) return "Inquiries";
    if (pathname?.startsWith("/admin/blog")) return "Blog";
    if (pathname?.startsWith("/admin/media")) return "Media";
    if (pathname?.startsWith("/admin/settings")) return "Settings";
    if (pathname?.startsWith("/admin/profile")) return "Profile";
    return "Admin";
  };

  return (
    <>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#d8a928]/20 bg-[#fcf5e8]/80 px-4 md:hidden backdrop-blur">
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center justify-center p-2"
        >
          <FiMenu className="h-6 w-6 text-[#0a0a0a]" />
        </button>
        
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-[#0a0a0a]">{getTitle()}</h1>
        </div>

        <Link
          href="/admin/profile"
          className="flex items-center justify-center p-2"
        >
          <FiUser className="h-5 w-5 text-[#0a0a0a]" />
        </Link>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 bg-[#1a1308] text-white"
            >
              <AdminSidebar admin={admin} onClose={() => setIsMenuOpen(false)} isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function ResponsiveAdminLayout({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: any;
}) {
  return (
    <div className="min-h-screen bg-[#fcf5e8]">
      <div className="hidden md:block fixed left-0 top-0 w-64 h-screen">
        <AdminSidebar admin={admin} />
      </div>
      
      <div className="md:ml-64">
        <div className="hidden md:block sticky top-0 z-30">
          <AdminTopbarSimple admin={admin} />
        </div>
        
        <AdminMobileHeader admin={admin} />
        
        <main className="px-3 sm:px-6 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      
      <AdminMobileNav />
    </div>
  );
}

function AdminTopbarSimple({ admin }: { admin: any }) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-[#d8a928]/20 bg-[#fcf5e8]/80 px-6 backdrop-blur">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-[#0a0a0a]">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/admin/profile"
          className="inline-flex items-center gap-2 rounded-lg border border-[#d8a928]/25 bg-white px-3 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-[#fcf5e8]"
        >
          <FiUser className="h-4 w-4" />
          <span>Profile</span>
        </Link>

        <Link
          href="/api/auth/signout"
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-500/30"
        >
          <FiLogOut className="h-4 w-4" />
          <span>Logout</span>
        </Link>
      </div>
    </header>
  );
}
