"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useTheme } from "@/lib/theme";
import { clearStoredTokens } from "@/lib/admin-auth/adminAuthStorage";

export default function AdminTopbar() {
  const router = useRouter();
  const { primaryColor } = useTheme();

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  /* =====================================================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  ====================================================== */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =====================================================
     PROFILE
  ====================================================== */

  const handleProfile = () => {
    setProfileOpen(false);
    router.push("/admin/profile");
  };

  /* =====================================================
     LOGOUT
  ====================================================== */

  const handleSignOut = () => {
    clearStoredTokens();

    setProfileOpen(false);
    setSearchOpen(false);

    router.replace("/admin/login");
  };

  return (
    <header
      className="
        fixed
        top-0
        right-0
        z-30
        flex
        h-16
        w-full
        items-center
        border-b
        border-slate-200
        bg-white/95
        px-4
        shadow-sm
        backdrop-blur-xl

        sm:px-5
        md:h-[60px]
        md:px-6
        lg:h-[68px]
        lg:px-7
      "
      style={
        {
          "--primary-color": primaryColor,
        } as React.CSSProperties
      }
    >
      {/* =====================================================
          LEFT / SEARCH
      ====================================================== */}

      <div className="flex min-w-0 flex-1 items-center">
        {/* Desktop / Tablet Search */}
        <div
          className="
            relative
            hidden
            left-60
            w-full
            max-w-[300px]
            sm:block
            md:max-w-[270px]
            lg:max-w-[300px]
          "
        >
          <Search
            size={17}
            strokeWidth={1.8}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
            "
          />

          <input
            type="search"
            placeholder="Search anything..."
            aria-label="Search"
            className="
              h-10
              w-full
              rounded-lg
              border
              pl-10
              pr-4
              text-sm
              outline-none
              transition-all

              focus:border-[var(--primary-color)]
              focus:bg-white
              focus:ring-4
              focus:ring-[var(--primary-color)]/10
            "
          />
        </div>

        {/* =================================================
            MOBILE SEARCH BUTTON
        ================================================== */}

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label="Open search"
          aria-expanded={searchOpen}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            text-slate-500
            transition

            hover:bg-slate-100

            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-400
            dark:hover:bg-slate-800

            sm:hidden
          "
          style={{
            color: searchOpen ? primaryColor : undefined,
          }}
        >
          <Search size={18} strokeWidth={1.8} />
        </motion.button>

        {/* =================================================
            MOBILE SEARCH INPUT
        ================================================== */}

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{
                opacity: 0,
                width: 0,
              }}
              animate={{
                opacity: 1,
                width: "100%",
              }}
              exit={{
                opacity: 0,
                width: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                relative
                ml-2
                min-w-0
                overflow-hidden
                sm:hidden
              "
            >
              <Search
                size={16}
                strokeWidth={1.8}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  dark:text-slate-500
                "
              />

              <input
                type="search"
                autoFocus
                placeholder="Search..."
                aria-label="Search"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  pl-9
                  pr-3
                  text-sm
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none

                  focus:border-[var(--primary-color)]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[var(--primary-color)]/10

                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-200
                  dark:placeholder:text-slate-500
                "
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================================
          RIGHT ACTIONS
      ====================================================== */}

      <div
        className="
          ml-auto
          flex
          shrink-0
          items-center
          gap-1
          sm:gap-2
          md:gap-3
          lg:gap-4
        "
      >
        {/* =================================================
            NOTIFICATION
        ================================================== */}

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"
          className="
            relative
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-500
            transition-colors

            hover:bg-slate-100
            hover:text-[var(--primary-color)]

            dark:text-slate-400
            dark:hover:bg-slate-800

            sm:h-10
            sm:w-10
          "
        >
          <Bell size={18} strokeWidth={1.8} />

          {/* Notification Dot */}
          <span
            className="
              absolute
              right-1.5
              top-1.5
              h-2
              w-2
              rounded-full
              ring-2
              ring-white
              dark:ring-slate-950
            "
            style={{
              backgroundColor: primaryColor,
            }}
          />
        </motion.button>

        {/* Divider */}
        <div
          className="
            h-6
            w-px
            shrink-0
            bg-slate-200
            dark:bg-slate-700
            sm:h-7
          "
        />

        {/* =================================================
            PROFILE WRAPPER
        ================================================== */}

        <div ref={profileRef} className="relative shrink-0">
          {/* =================================================
              PROFILE BUTTON
          ================================================== */}

          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-label="Open administrator menu"
            aria-expanded={profileOpen}
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              px-1
              py-1
              transition

              hover:bg-slate-50

              dark:hover:bg-slate-900

              sm:gap-2
              md:gap-2.5
            "
          >
            {/* Avatar */}
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full

                sm:h-10
                sm:w-10
              "
              style={{
                backgroundColor: `${primaryColor}18`,
                color: primaryColor,
              }}
            >
              <ShieldCheck size={18} strokeWidth={1.9} />
            </div>

            {/* Profile Information */}
            <div
              className="
                hidden
                min-w-0
                text-left
                sm:block
              "
            >
              <p
                className="
                  max-w-[110px]
                  truncate
                  text-xs
                  font-semibold
                  leading-4
                  text-slate-800
                  dark:text-slate-100

                  md:max-w-[140px]
                  md:text-[13px]
                "
              >
                Super Admin
              </p>

              <p
                className="
                  max-w-[110px]
                  truncate
                  text-[10px]
                  leading-4
                  text-slate-400
                  dark:text-slate-500

                  md:max-w-[140px]
                  md:text-[11px]
                "
              >
                Administrator
              </p>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{
                rotate: profileOpen ? 180 : 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="shrink-0"
            >
              <ChevronDown
                size={15}
                strokeWidth={1.8}
                className="
                  text-slate-400
                  dark:text-slate-500
                "
              />
            </motion.div>
          </motion.button>

          {/* =================================================
              PROFILE DROPDOWN
          ================================================== */}

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-50
                  w-[190px]
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-1.5
                  shadow-xl

                  dark:border-slate-700
                  dark:bg-slate-900

                  sm:w-[200px]
                "
              >
                {/* =================================================
                    PROFILE MENU
                ================================================== */}

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProfile}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-medium
                    text-slate-700
                    transition-all

                    hover:bg-[var(--primary-color)]
                    hover:text-white

                    dark:text-slate-200
                    dark:hover:bg-[var(--primary-color)]
                    dark:hover:text-white
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-slate-100
                      transition-all

                      group-hover:bg-white/20

                      dark:bg-slate-800
                      dark:group-hover:bg-white/20
                    "
                  >
                    <User size={16} strokeWidth={1.8} />
                  </span>

                  <span>Profile</span>
                </motion.button>

                {/* =================================================
                    LOGOUT MENU
                ================================================== */}

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-medium
                    text-slate-700
                    transition-all

                    hover:bg-[var(--primary-color)]
                    hover:text-white

                    dark:text-slate-200
                    dark:hover:bg-[var(--primary-color)]
                    dark:hover:text-white
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-slate-100
                      transition-all

                      group-hover:bg-white/20

                      dark:bg-slate-800
                      dark:group-hover:bg-white/20
                    "
                  >
                    <LogOut size={16} strokeWidth={1.8} />
                  </span>

                  <span>Logout</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
