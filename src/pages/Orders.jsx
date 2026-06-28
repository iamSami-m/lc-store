import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;

  useEffect(() => {
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((data) => {
        const userOrders = data.filter(
          (order) => order.customer?.id === id
        );
        setOrders(userOrders);
      });
  }, [id]);

  const handleShowOrder = (orderId) => {
    navigate(`/orderSummary/${orderId}?payment=false&admin=false`);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        سفارش‌های من
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow">
          سفارشی یافت نشد
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">شماره سفارش</th>
                  <th className="p-4">تاریخ</th>
                  <th className="p-4">مشتری</th>
                  <th className="p-4">مبلغ</th>
                  <th className="p-4">نوع پرداخت</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">عملیات</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t text-center hover:bg-gray-50"
                  >
                    <td className="p-4">{item.orderId}</td>

                    <td className="p-4">
                      {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                    </td>

                    <td className="p-4">
                      {item.customer?.name || "-"}
                    </td>

                    <td className="p-4">
                      {item.pricing?.finalTotal?.toLocaleString()} تومان
                    </td>

                    <td className="p-4">
                      {item.payment?.method}
                    </td>

                    <td className="p-4">
                      {item.orderStatus}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleShowOrder(item.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        مشاهده
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Cards */}
          <div className="grid gap-4 lg:hidden">
            {orders.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-bold">شماره سفارش</span>
                  <span>{item.orderId}</span>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="font-bold">تاریخ</span>
                  <span>
                    {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="font-bold">مبلغ</span>
                  <span>
                    {item.pricing?.finalTotal?.toLocaleString()} تومان
                  </span>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="font-bold">پرداخت</span>
                  <span>{item.payment?.method}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="font-bold">وضعیت</span>
                  <span>{item.orderStatus}</span>
                </div>

                <button
                  onClick={() => handleShowOrder(item.id)}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  مشاهده سفارش
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;