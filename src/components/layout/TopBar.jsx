import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  X,
  CheckCheck,
  Activity,
  Target,
  Moon,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  {
    name: "Dashboard",
    keywords: "dashboard home overview",
    path: "/dashboard",
  },
  {
    name: "Health Profile",
    keywords: "health profile personal information",
    path: "/health-profile",
  },
  {
    name: "Risk Prediction",
    keywords: "risk prediction assessment health risk",
    path: "/predict",
  },
  {
    name: "Explain My Risk",
    keywords: "explain risk factors why risk",
    path: "/explain",
  },
  {
    name: "What-if Simulator",
    keywords: "what if simulation simulate lifestyle",
    path: "/simulate",
  },
  {
    name: "Prevention Plan",
    keywords: "prevention prevent recommendations",
    path: "/prevent",
  },
  {
    name: "Track Progress",
    keywords: "track progress history health tracking",
    path: "/track",
  },
];

const defaultNotifications = [
  {
    id: 1,
    type: "health",
    title: "Health assessment updated",
    message: "Your latest health risk assessment is ready.",
    time: "10 min ago",
    read: false,
  },
  {
    id: 2,
    type: "goal",
    title: "Daily goal reminder",
    message: "You are 1,500 steps away from today's target.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "sleep",
    title: "Sleep goal",
    message: "You reached your recommended sleep target yesterday.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "progress",
    title: "Weekly progress",
    message: "Your health score improved this week.",
    time: "Yesterday",
    read: true,
  },
];

function getNotificationIcon(type) {
  switch (type) {
    case "goal":
      return <Target size={17} />;
    case "sleep":
      return <Moon size={17} />;
    case "progress":
      return <TrendingUp size={17} />;
    default:
      return <Activity size={17} />;
  }
}

export default function TopBar({
  title = "Dashboard",
  userName = "Alex",
}) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("vitalai_notifications");

      if (saved) {
        return JSON.parse(saved);
      }

      return defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  // Save notifications
  useEffect(() => {
    localStorage.setItem(
      "vitalai_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Escape closes dropdowns
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return navigationItems.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.keywords.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setSearchOpen(true);
  }

  function handleNavigate(path) {
    navigate(path);
    setSearch("");
    setSearchOpen(false);
  }

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-slate-200/70 bg-white/85 px-4 py-3 backdrop-blur-xl md:px-6">

      {/* LEFT */}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold text-slate-900 md:text-xl">
          {title}
        </h1>

        <p className="hidden text-xs text-slate-500 sm:block">
          Personalized health insights for {userName}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* SEARCH */}
        <div
          ref={searchRef}
          className="relative hidden w-64 md:block lg:w-80"
        >
          <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-100">
            <Search
              size={17}
              className="mr-2 shrink-0 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => {
                if (search) setSearchOpen(true);
              }}
              placeholder="Search VitalAI..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setSearchOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {searchOpen && search && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-0 right-0 top-12 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
              >
                {results.length > 0 ? (
                  results.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="flex w-full items-center rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                    >
                      <Search
                        size={16}
                        className="mr-3 text-cyan-500"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          Open {item.name}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center">
                    <Search
                      size={22}
                      className="mx-auto mb-2 text-slate-300"
                    />

                    <p className="text-sm font-medium text-slate-600">
                      No results found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try searching for dashboard, risk, track...
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MOBILE SEARCH */}
        <button
          onClick={() => {
            setSearchOpen((value) => !value);
            setNotificationOpen(false);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
          aria-label="Search"
        >
          <Search size={19} />
        </button>

        {/* NOTIFICATIONS */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => {
              setNotificationOpen((value) => !value);
              setSearchOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="absolute right-0 top-12 w-[350px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Notifications
                    </h3>

                    <p className="text-xs text-slate-400">
                      {unreadCount} unread
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
                    >
                      <CheckCheck size={14} />
                      Mark all
                    </button>
                  )}
                </div>

                {/* NOTIFICATIONS */}
                <div className="max-h-[390px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                        !notification.read ? "bg-cyan-50/40" : ""
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {notification.message}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="border-t border-slate-100 p-3 text-center">
                  <button
                    onClick={() => setNotificationOpen(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* USER */}
        <div className="hidden items-center gap-2 pl-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-slate-800">
              {userName}
            </p>

            <p className="text-[10px] text-slate-400">
              Health Member
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH PANEL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-3 right-3 top-[58px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:hidden"
          >
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search size={17} className="mr-2 text-slate-400" />

              <input
                autoFocus
                value={search}
                onChange={handleSearchChange}
                placeholder="Search VitalAI..."
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>

            {search && (
              <div className="mt-2">
                {results.length > 0 ? (
                  results.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50"
                    >
                      <Search size={15} className="text-cyan-500" />
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-center text-sm text-slate-400">
                    No results found
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}