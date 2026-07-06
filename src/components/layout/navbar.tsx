'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiLogOut, FiUser, FiPackage, FiHelpCircle, FiPhone } from 'react-icons/fi';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import Logo from '../ui/Logo';
import CartIcon from '../CartIcon';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navLinkClass = (href: string) =>
    pathname === href
      ? "text-orange-600 font-semibold text-sm"
      : "text-slate-500 hover:text-orange-600 font-semibold text-sm";

  const {
    isLoggedIn,
    userRole,
    initials,
    logout
  } = useAuth();

  const dashboardLink =
    userRole === "ADMIN"
      ? "/admin/users"
      : "/user-dashboard";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast("! Please login or register first to view your profile", {
        className: "!bg-white/50 !text-red-600 font-semibold m-5"
      });
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const isAdmin = userRole === "ADMIN";
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isAuthPage = isLoginPage || isSignupPage;

  return (
   <header className="bg-white border-b border-slate-200 sticky top-0 z-[100]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div>
          <Logo variant="dark" href="/" />
        </div>

        {/* DESKTOP CENTER LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {!isAuthPage && (
            <>
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>

              {!isAdmin && (
                <>
                <Link href="/user-dashboard/products" className={navLinkClass("/user-dashboard/products")}>
                  Products
                </Link>
                </>
                
              )}

              {isAdmin && (
                <Link href={dashboardLink} className={navLinkClass(dashboardLink)}>
                  Dashboard
                </Link>
              )}

              {isLoggedIn && !isAdmin && (
                <Link 
                  href="/user-dashboard" 
                  className={navLinkClass("/user-dashboard")}
                >
                  Dashboard
                </Link>
              )}
            </>
          )}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-5">
          {!isAuthPage && !isAdmin && 
          <div className="flex items-center gap-4">
              <Link 
                href="/user-dashboard/contact" 
                className={`transition ${pathname === "/user-dashboard/contact" ? "text-orange-600" : "text-slate-500 hover:text-orange-600"}`}
                title="Contact Support"
              >
                <FiPhone size={20} />
              </Link>
          <CartIcon />
          </div>}


          {/* SIGN IN & REGISTER (Shown when NOT logged in, placed right after CartIcon) */}
          {!isLoggedIn && !isAuthPage && (
            <div className="flex items-center gap-3">
              <Link href="/login" className={navLinkClass("/login")}>
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* If on Login page, show Home & Register links on the right */}
          {isLoginPage ? (
            <>
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600"
              >
                Register
              </Link>
            </>
          ) : isSignupPage ? (
            /* If on Register page, show Home & Sign In links on the right */
            <>
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>
              <Link href="/login" className={navLinkClass("/login")}>
                Sign In
              </Link>
            </>
          ) : isLoggedIn ? (
            /* PROFILE DROPDOWN CONTAINER */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={handleProfileClick}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition cursor-pointer ${
                pathname === "/user-dashboard/profile"
                ? "border-orange-600 bg-orange-100 text-orange-600"
                : "border-orange-500 text-orange-500 hover:bg-orange-100"
                }`}
              >
                {initials}
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      { "user Profile"}
                    </p>
                  </div>

                  <Link
                    href="/user-dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    <FiUser size={16} /> Profile
                  </Link>

                  {!isAdmin && (
                    <>
                      <Link
                        href="/user-dashboard/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <FiPackage size={16} /> Orders
                      </Link>
                      <Link
                        href="/user-dashboard/contact"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <FiHelpCircle size={16} /> Contact Support
                      </Link>
                    </>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center gap-4">
          {!isAuthPage && !isAdmin && <CartIcon />}
          
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="text-slate-700 cursor-pointer"
          >
            {open ? <HiX size={28}/> : <HiMenu size={28}/>}
          </button>
        </div>

      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col gap-4">
          {isSignupPage ? (
            <>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={navLinkClass("/")}
              >
                Home
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={navLinkClass("/login")}
              >
                Sign In
              </Link>
            </>
          ) : isLoginPage ? (
            <>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={navLinkClass("/")}
              >
                Home
              </Link>
             <Link
               href="/signup"
               className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 text-center"
             >
               Register
             </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={navLinkClass("/")}
              >
                Home
              </Link>

              {!isAdmin && (
                <>
                <Link
                  href="/user-dashboard/products"
                  onClick={() => setOpen(false)}
                  className={navLinkClass("/user-dashboard/products")}
                >
                  Products
                </Link>
                <Link href="/user-dashboard/contact" className={navLinkClass("/user-dashboard/contact")}>
                   Contact Support
                </Link>
                </>
                
              )}

              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboardLink}
                    onClick={() => setOpen(false)}
                    className={navLinkClass(dashboardLink)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/user-dashboard/orders"
                    onClick={() => setOpen(false)}
                    className={navLinkClass("/user-dashboard/orders")}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/user-dashboard/contact"
                    onClick={() => setOpen(false)}
                    className={navLinkClass("/user-dashboard/contact")}
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/user-dashboard/profile"
                    onClick={() => setOpen(false)}
                    className={navLinkClass("/user-dashboard/profile")}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 font-semibold text-red-600 text-left pt-2 cursor-pointer"
                  >
                    <FiLogOut size={16}/>
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={(e) => {
                      setOpen(false);
                      handleProfileClick(e);
                    }}
                    className="text-slate-500 hover:text-orange-600 font-semibold text-sm text-left cursor-pointer"
                  >
                    Profile
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={navLinkClass("/login")}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
   </header>
  );
}