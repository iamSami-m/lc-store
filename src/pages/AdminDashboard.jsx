import React, { useContext, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";

import AddItem from "./AddItem";
import ListItems from "./ListItems";
import AdminDashboardOrderList from "./AdminDashboardOrderList";
import AdminCustomersManagement from "./AdminCustomersManagement";
import AdminSettings from "./AdminSettings";
import {UserContext} from "./../context/UserContext"

import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const {logout}=useContext(UserContext)
  return (
    <div className="min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="h-16 bg-gray-200 flex items-center justify-between px-4">

        <h1 className="font-bold text-lg">Admin Panel</h1>

        {/* mobile menu button */}
        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>

      </header>

      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside
          className={`
            fixed lg:static top-16 left-0 z-50
            h-[calc(100vh-64px)]
            w-64 bg-yellow-300
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 "}
          `}
        >
          <div className="flex flex-col py-6 gap-3">

            <NavLink to="/admindashboard/add" className={navClass}>
              اضافه کردن آیتم جدید
            </NavLink>

            <NavLink to="/admindashboard/list" className={navClass}>
              لیست آیتم ها
            </NavLink>

            <NavLink to="/admindashboard/admindashboardorderlist" className={navClass}>
              سفارش ها
            </NavLink>

            <NavLink to="/admindashboard/admincustomersmanagement" className={navClass}>
              کاربران
            </NavLink>

            <NavLink to="/admindashboard/adminsettings" className={navClass}>
              تنظیمات
            </NavLink>

            <NavLink to="/" onClick={logout} className={navClass}>
              خروج از حساب کاربری
            </NavLink>

          </div>
        </aside>

        {/* OVERLAY (mobile) */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 lg:p-6 ml-0 lg:ml-64">

          <Routes>
            <Route path="/add" element={<AddItem />} />
            <Route path="/list" element={<ListItems />} />
            <Route path="/admindashboardorderlist" element={<AdminDashboardOrderList />} />
            <Route path="/admincustomersmanagement" element={<AdminCustomersManagement />} />
            <Route path="/adminsettings" element={<AdminSettings />} />
          </Routes>

        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;

/* helper class */
const navClass = ({ isActive }) =>
  `mx-4 p-3 rounded border transition ${
    isActive
      ? "bg-blue-500 text-white"
      : "bg-gray-100 hover:bg-gray-200"
  }`;