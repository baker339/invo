import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  FiHome,
  FiSettings,
  FiFolder,
  FiFileText,
  FiLogOut,
  FiUser,
  FiCreditCard,
} from "react-icons/fi"; // Icons
import { useAuth } from "../hooks/useAuth"; // Import useAuth

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout(); // Call the logout function
  };

  return (
    <div className="flex h-screen bg-background text-neutral">
      {/* Sidebar */}
      <div
        className={`bg-primary  fixed top-0 left-0 h-full transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } flex flex-col justify-between`}
      >
        {/* Sidebar Toggle */}
        <div className="flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
          >
            {isOpen ? "❮" : "❯"}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 mt-4 ">
          <Link
            href="/"
            className="flex items-center px-4 py-2 hover:bg-secondary transition duration-300 "
          >
            <FiHome className="text-2xl" />
            {isOpen && <span className="ml-4 text-lg">Dashboard</span>}
          </Link>
          <Link
            href="/manage"
            className="flex items-center px-4 py-2 hover:bg-secondary transition duration-300"
          >
            <FiFolder className="text-2xl" />
            {isOpen && <span className="ml-4 text-lg">Manage</span>}
          </Link>
          <Link
            href="/invoices"
            className="flex items-center px-4 py-2 hover:bg-secondary transition duration-300 "
          >
            <FiFileText className="text-2xl" />
            {isOpen && <span className="ml-4 text-lg">Invoices</span>}
          </Link>
          <Link
            href="/receipts/upload"
            className="flex items-center px-4 py-2 hover:bg-secondary transition duration-300 "
          >
            <FiCreditCard className="text-2xl" />
            {isOpen && <span className="ml-4 text-lg">Receipts</span>}
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 hover:bg-secondary transition duration-300 "
          >
            <FiSettings className="text-2xl" />
            {isOpen && <span className="ml-4 text-lg">Settings</span>}
          </Link>
        </nav>

        {user && (
          <>
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 hover:bg-secondary transition duration-300 "
            >
              <FiUser className="text-2xl" />
              {isOpen && <span className="ml-4 text-lg">Profile</span>}
            </Link>
            <div className="flex items-center justify-center p-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2  hover:bg-red-100 transition duration-300"
              >
                <FiLogOut className="text-2xl" />
                {isOpen && <span className="ml-4 text-lg">Logout</span>}
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="p-4">
          {isOpen && <p className="text-sm text-lightNeutral">© 2024 Invo</p>}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
