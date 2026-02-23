import { useLocation } from "react-router-dom";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ isDark, theme, setTheme, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Settings", path: "/settings" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
      onClick={() => setOpen(true)}
      className="
        md:hidden
        fixed top-4 left-4
        p-2 rounded-lg
        bg-white/80 dark:bg-slate-800
        text-dark
        backdrop-blur-md
        shadow-md
        z-50
      "
    >
      ☰
    </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative
        top-0 left-0 h-full w-64 p-8 flex flex-col
        transform transition-all duration-300 ease-in-out z-50
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${
          isDark
            ? "bg-gradient-to-b from-slate-800 to-slate-900"
            : "bg-white border-r"
        }
      `}
      >
        <h2 className="text-2xl font-bold mb-10 text-emerald-400">
          💰 Cash Tracker
        </h2>

        {/* MENU */}
        <ul className="space-y-2 flex-1">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`
                relative block px-5 py-3 rounded-xl
                transition-all duration-300
                ${
                  isActive
                    ? "text-emerald-400"
                    : isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-700"
                    : "text-gray-600 hover:text-black hover:bg-gray-200"
                }
              `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-r-full transition-all duration-300" />
                )}
                {item.name}
              </NavLink>
            );
          })}
        </ul>

        {/* ===== BOTTOM SECTION ===== */}
        <div className="space-y-4 pt-6">

          {/* DARK MODE TOGGLE */}
          <div
  className={`
    w-full flex items-center justify-between
    px-4 py-3 rounded-xl transition-all duration-300
    ${isDark ? "bg-slate-700" : "bg-gray-200"}
  `}
>
  <span className="font-medium">
    {isDark ? "Dark Mode" : "Light Mode"}
  </span>

  <button
    onClick={toggleTheme}
    className={`
      relative w-14 h-7 rounded-full transition-all duration-300
      ${isDark ? "bg-emerald-500" : "bg-gray-400"}
    `}
  >
    <span
      className={`
        absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md
        transition-all duration-300 ease-in-out
        ${isDark ? "translate-x-7" : "translate-x-0"}
      `}
    />
  </button>
          </div>

          {/* LOGOUT */}
          <button
            onClick={onLogout}
            className="w-full px-5 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
          >
            🚪 Logout
          </button>

        </div>
      </div>
    </>
  );
}

export default Sidebar;