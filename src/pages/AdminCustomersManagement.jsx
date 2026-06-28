import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Wallet,
} from "lucide-react";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useGetAllCustomers } from "../services/customers.services";
import { useGetAllOrders } from "../services/orders.services";

const AdminCustomersManagement = () => {
  const { data: customers = [] } = useGetAllCustomers();
  const { data: orders = [] } = useGetAllOrders();
  const navigate = useNavigate();

  /* ---------------- Stats ---------------- */
  const customerStats = useMemo(() => {
    return orders.reduce((acc, order) => {
      const customerId = order.customer.id;

      if (!acc[customerId]) {
        acc[customerId] = {
          sumOfOrders: 0,
          numberOfOrders: 0,
        };
      }

      acc[customerId].sumOfOrders += order.pricing.finalTotal;
      acc[customerId].numberOfOrders += 1;

      return acc;
    }, {});
  }, [orders]);

  /* ---------------- Merge Data ---------------- */
  const customersWithStats = useMemo(() => {
    return customers.map((customer) => ({
      ...customer,
      numberoforders:
        customerStats[customer.id]?.numberOfOrders || 0,
      sumoforders:
        customerStats[customer.id]?.sumOfOrders || 0,
    }));
  }, [customers, customerStats]);

  /* ---------------- Summary Cards ---------------- */
  const summaryCards = useMemo(() => {
    return {
      totalCustomers: customersWithStats.length,
      activeCustomers: customersWithStats.filter(
        (c) => c.numberoforders > 0
      ).length,
      passiveCustomers: customersWithStats.filter(
        (c) => c.numberoforders === 0
      ).length,
      salesTotal: customersWithStats
        .reduce((sum, c) => sum + c.sumoforders, 0)
        .toLocaleString(),
    };
  }, [customersWithStats]);

  /* ---------------- Columns ---------------- */
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "شماره مشتری" },
      { accessorKey: "name", header: "نام مشتری" },
      { accessorKey: "tel", header: "شماره تماس" },
      { accessorKey: "role", header: "نقش" },
      { accessorKey: "numberoforders", header: "تعداد سفارشات" },
      {
        accessorKey: "sumoforders",
        header: "مجموع خرید",
        cell: ({ getValue }) =>
          `${getValue().toLocaleString()} تومان`,
      },
      {
        id: "actions",
        header: "عملیات",
        cell: ({ row }) => (
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition"
              onClick={() =>
                navigate(
                  `/admindashboard/admindashboardorderlist?customerId=${row.original.id}`
                )
              }
            >
              سفارشات
            </button>

            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg text-sm transition"
              onClick={() =>
                navigate(
                  `/ordersummary/${row.original.id}?payment=false&admin=true`
                )
              }
            >
              جزئیات
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: customersWithStats,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">کل مشتریان</p>
              <h2 className="text-3xl font-bold">
                {summaryCards.totalCustomers}
              </h2>
            </div>
            <Users className="text-blue-500" />
          </div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">فعال</p>
              <h2 className="text-3xl font-bold text-green-600">
                {summaryCards.activeCustomers}
              </h2>
            </div>
            <UserCheck className="text-green-600" />
          </div>
        </div>

        {/* Passive */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">بدون سفارش</p>
              <h2 className="text-3xl font-bold text-amber-600">
                {summaryCards.passiveCustomers}
              </h2>
            </div>
            <UserX className="text-amber-600" />
          </div>
        </div>

        {/* Sales */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">مجموع فروش</p>
              <h2 className="text-2xl font-bold text-violet-600">
                {summaryCards.salesTotal}
              </h2>
            </div>
            <Wallet className="text-violet-600" />
          </div>
        </div>

      </div>

      {/* ===== Table ===== */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">

            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-sm font-semibold text-gray-700 border-b"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-center text-sm border-b whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminCustomersManagement;