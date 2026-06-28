import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const AdminDashboardOrderList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  //for stats we need all orders , orders get orders of one page and statistic cards don't contain trust values
  const [allOrders,setAllOrders]=useState([])
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams]=useSearchParams()
  const customerId=searchParams.get("customerId")

  const [search,setSearch]=useState("")
  const [debouncedSearch,setDebouncedSearch]=useState("")

  const pageSize = 5;

  useEffect(() => {
    let url = `http://localhost:3000/orders?_page=${page}&_per_page=${pageSize}`;

    if (activeTab !== "All") {
      url += `&orderStatus=${activeTab}`;
    }
    if(customerId){
      url += `&customer.id=${customerId}`
    }


    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        setOrders(result.data);
        setTotalPages(result.pages);
        
      })
      .catch((err) => console.error(err));

      let statsurl=`http://localhost:3000/orders?`

      if(customerId)
        statsurl += `&customer.id=${customerId}`
      fetch(statsurl)
      .then(res=>res.json())
      .then(data=>setAllOrders(data))

  }, [page,pageSize, activeTab, customerId]);


    useEffect(()=>{
      const timer=setTimeout(()=>{
        setDebouncedSearch(search)
      },500)

      return ()=>clearTimeout(timer)
    },[search])

    const customerInfo = useMemo(() => {
        if (!customerId || allOrders.length === 0) return null;

        const order = allOrders.find(
          order => order.customer.id === customerId
        );

        return order?.customer || null;
      }, [customerId, allOrders]);
    //تفاوتش با useEffect این است که useEffect مقداری بر نمیگرداند و useMemo اگر dependency (وابستگی) نکنند حتی اگر دوباره ساخته شوند 
    //ولی نسبت به قبل بدون تغییر باشند دوباره اجرا نمی شود
    const filteredOrder=useMemo(()=>{
      const q=debouncedSearch.toLowerCase()

      return orders.filter(order=>
        order.customer.name.toLowerCase().includes(q)||
        order.customer.tel.includes(q) ||
        order.orderId.toString().includes(q)
      )
    },[orders,debouncedSearch])

  // وقتی فیلتر عوض شد برگرد صفحه اول
  useEffect(() => {
    setPage(1);
  }, [activeTab]);
//codes for status cards
  const stats=useMemo(()=>{
    return{
      total:allOrders.length,
       processing:allOrders.filter(
      order=>order.orderStatus==="processing"
        ).length,
      delivered:allOrders.filter(
        order=>order.orderStatus===" delivered"
        ).length,
      cancelled:allOrders.filter(
        order=>order.orderStatus==="cancelled"
        ).length,

      }
  },[allOrders])

  const columns = useMemo(
    () => [
      {
        accessorKey: "orderId",
        header: "شماره سفارش",
      },
      {
        accessorKey: "customer.name",
        header: "نام مشتری",
      },
      {
        accessorKey: "customer.tel",
        header: "تلفن",
      },
      {
        accessorKey: "pricing.finalTotal",
        header: "مبلغ",
      },
      {
        accessorKey: "payment.status",
        header: "وضعیت پرداخت",
        cell:({getValue})=>{
          const status=getValue()

          const styles={
             pending: "bg-yellow-100 text-yellow-800",
            paid: "bg-green-100 text-green-800",
            failed: "bg-red-100 text-red-800",
            refunded: "bg-purple-100 text-purple-800",
          }
          const labels = {
            pending: "در انتظار",
            paid: "پرداخت شده",
            failed: "ناموفق",
            refunded: "بازگشت وجه",
          }

          return(
             <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  styles[status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {labels[status] || status}
              </span>
          )
        }
      },
      {
          accessorKey: "orderStatus",
          header: "وضعیت سفارش",
          cell: ({ getValue }) => {
            const status = getValue()

          const styles = {
            draft: "bg-gray-100 text-gray-800",
            processing: "bg-yellow-100 text-yellow-800",
            shipped: "bg-blue-100 text-blue-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
          }

          const labels = {
            draft: "پیش‌نویس",
            processing: "در حال پردازش",
            shipped: "ارسال شده",
            delivered: "تحویل شده",
            cancelled: "لغو شده",
          }
          
          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                styles[status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {labels[status] || status}
            </span>
          )
        }
      },
      {
        id: "actions",
        header: "عملیات",
        cell: ({ row }) => (
          <button
            className="bg-yellow-200 border p-2 rounded"
            onClick={() =>
              navigate(
                `/ordersummary/${row.original.id}?payment=false&admin=true`
              )
            }
          >
            View
          </button>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: filteredOrder,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
  <div className="p-4 sm:p-6 lg:p-8 space-y-6">

    {/* Customer Info */}
    {customerId && customerInfo && (
      <div className="bg-gray-50 border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">
            سفارشات مشتری: {customerInfo.name}
          </h2>

          <p className="text-sm text-gray-600">
            شناسه: {customerInfo.id}
          </p>

          <p className="text-sm text-gray-600">
            تلفن: {customerInfo.tel}
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/admindashboard/admindashboardorderlist")
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full sm:w-auto"
        >
          بازگشت
        </button>
      </div>
    )}

    {/* Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      {/* Total */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500">کل سفارشات</p>
        <h3 className="text-2xl font-bold mt-2">{stats.total}</h3>
      </div>

      {/* Processing */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500">در حال پردازش</p>
        <h3 className="text-2xl font-bold mt-2 text-yellow-600">
          {stats.processing}
        </h3>
      </div>

      {/* Delivered */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500">تحویل شده</p>
        <h3 className="text-2xl font-bold mt-2 text-green-600">
          {stats.delivered}
        </h3>
      </div>

      {/* Cancelled */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500">لغو شده</p>
        <h3 className="text-2xl font-bold mt-2 text-red-600">
          {stats.cancelled}
        </h3>
      </div>
    </div>

    {/* Search */}
    <input
      type="text"
      className="w-full sm:w-96 border p-2 rounded-lg"
      placeholder="جستجوی سفارش..."
      onChange={(e) => setSearch(e.target.value)}
    />

    {/* Tabs */}
    <div className="flex flex-wrap gap-2">
      {["All", "processing", "draft", "delivered", "cancelled"].map(
        (tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg border text-sm sm:text-base ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {tab}
          </button>
        )
      )}
    </div>

    {/* Table Wrapper (IMPORTANT FOR MOBILE) */}
    <div className="w-full overflow-x-auto border rounded-lg">

      <table className="w-full min-w-[700px] border-collapse">

        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2 text-sm">
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
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2 text-center text-sm">
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

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="px-4 py-2 border rounded-lg w-full sm:w-auto"
      >
        Prev
      </button>

      <span className="text-sm">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="px-4 py-2 border rounded-lg w-full sm:w-auto"
      >
        Next
      </button>
    </div>

  </div>
);
};

export default AdminDashboardOrderList;