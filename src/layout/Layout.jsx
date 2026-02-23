import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Layout() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed");
      return;
    }

    toast.success("Logout successful");
    navigate("/");
  };

  return (
    <div
      className={`
        flex min-h-screen transition-colors duration-300
        ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white"
            : "bg-gray-100 text-gray-900"
        }
      `}
    >
      {/* Sidebar */}
      <Sidebar
        isDark={isDark}
        theme={theme}
        setTheme={setTheme}
        onLogout={() => setShowLogoutModal(true)}
      />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
          <div
            className={`
              w-[90%] max-w-md p-8 rounded-3xl shadow-2xl
              transition-all duration-300 animate-scaleIn
              ${isDark ? "bg-slate-800" : "bg-white"}
            `}
          >
            <h3 className="text-xl font-semibold mb-4">
              Confirm Logout
            </h3>

            <p className="mb-6 opacity-70">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`
                  px-4 py-2 rounded-lg transition
                  ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 pt-16 px-5 sm:px-6 md:p-10 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;