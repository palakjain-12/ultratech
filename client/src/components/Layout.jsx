import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
        <div className="font-semibold">UltraTech Hirmi – Maintenance Module</div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Role: {user?.role || "Guest"}</span>
          {user && (
            <button onClick={logout} className="bg-brand hover:bg-brand-dark px-3 py-1 rounded">
              Logout
            </button>
          )}
        </div>
      </header>
      <div className="flex">
        <nav className="w-64 bg-white border-r p-4 space-y-2">
          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/equipment" className="block px-3 py-2 rounded hover:bg-gray-100">Equipment</Link>
          <Link to="/maintenance" className="block px-3 py-2 rounded hover:bg-gray-100">Maintenance Logs</Link>
          <Link to="/spares" className="block px-3 py-2 rounded hover:bg-gray-100">Spare Parts</Link>
          <Link to="/reports" className="block px-3 py-2 rounded hover:bg-gray-100">Reports</Link>
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

