import { useState, useEffect } from "react";
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  Sun,
  Moon,
  Home,
  BarChart3,
  Info,
  Phone,
  MoreHorizontal,
} from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileDropdown = document.getElementById("profile-dropdown");
      const profileButton = document.getElementById("profile-button");

      if (
        profileDropdown &&
        profileButton &&
        !profileDropdown.contains(event.target) &&
        !profileButton.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const themeClass = darkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-800";

  return (
    <div className={`${themeClass} transition-colors duration-300 ease-in-out`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-md flex items-center justify-center ${
                  darkMode ? "bg-blue-500" : "bg-blue-600"
                }`}
              >
                <span className="text-white font-bold">SW</span>
              </div>
              <span className="ml-2 text-xl font-semibold tracking-tight">
                StockWave
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div>
            <div className="ml-10 flex items-center space-x-6">
              <NavLink
                icon={<Home size={18} />}
                text="Home"
                href="/"
                active={true}
                darkMode={darkMode}
              />
              <NavLink
                icon={<BarChart3 size={18} />}
                text="Dashboard"
                href="/dashboard"
                darkMode={darkMode}
              />
              <NavLink
                icon={<Info size={18} />}
                text="About Us"
                href="/about"
                darkMode={darkMode}
              />
              <NavLink
                icon={<Phone size={18} />}
                text="Contact Us"
                href="/contact"
                darkMode={darkMode}
              />
              <NavLink
                icon={<MoreHorizontal size={18} />}
                text="More"
                href="/more"
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center">
            {/* Dark Mode Toggle */}
            <div className="mr-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button
                  id="profile-button"
                  className={`flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    darkMode ? "focus:ring-blue-500" : "focus:ring-blue-600"
                  }`}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div
                    className={`p-2 rounded-full flex items-center transition-colors duration-200 ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <User
                      size={20}
                      className={darkMode ? "text-gray-300" : "text-gray-600"}
                    />
                    <span className="ml-2 font-medium">Profile</span>
                    <ChevronDown
                      size={16}
                      className={`ml-1 transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Profile dropdown panel */}
              {profileOpen && (
                <div
                  id="profile-dropdown"
                  className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ${
                    darkMode
                      ? "bg-gray-800 ring-1 ring-gray-700"
                      : "bg-white ring-1 ring-gray-200"
                  } divide-y ${
                    darkMode ? "divide-gray-700" : "divide-gray-100"
                  } focus:outline-none z-10 transform opacity-100 scale-100 transition ease-out duration-200`}
                >
                  <div className="px-4 py-3">
                    <p className="text-sm">Signed in as</p>
                    <p
                      className={`text-sm font-medium truncate ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      user@stockwave.com
                    </p>
                  </div>
                  <div className="py-1">
                    <ProfileMenuItem
                      icon={<User size={16} />}
                      text="Your Profile"
                      href="/profile"
                      darkMode={darkMode}
                    />
                    <ProfileMenuItem
                      icon={<Settings size={16} />}
                      text="Settings"
                      href="/settings"
                      darkMode={darkMode}
                    />
                    <ProfileMenuItem
                      icon={<LogOut size={16} />}
                      text="Sign out"
                      href="/logout"
                      darkMode={darkMode}
                      isSignOut
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Desktop Navigation Link component
function NavLink({ icon, text, href, active = false, darkMode }) {
  return (
    <a
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform group ${
        active
          ? darkMode
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-800"
          : darkMode
          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span
        className={`mr-1.5 transition-transform duration-200 group-hover:scale-110 ${
          active ? "text-current" : ""
        }`}
      >
        {icon}
      </span>
      {text}
    </a>
  );
}

// Profile dropdown menu item component
function ProfileMenuItem({ icon, text, href, isSignOut = false, darkMode }) {
  return (
    <a
      href={href}
      className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
        isSignOut
          ? darkMode
            ? "text-red-400 hover:bg-gray-700"
            : "text-red-600 hover:bg-gray-100"
          : darkMode
          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span
        className={`mr-2 ${
          isSignOut ? (darkMode ? "text-red-400" : "text-red-600") : ""
        }`}
      >
        {icon}
      </span>
      {text}
    </a>
  );
}