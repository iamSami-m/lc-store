import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OrderContext } from "../context/OrderContext";

const PaymentPage = () => {
  const [ order, setOrder ] = useState([]);
  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")
  const navigate = useNavigate();

  useEffect(() => {
  fetch(`http://localhost:3000/orders/${id}`)
    .then(res => res.json())
    .then(data => setOrder(data))
}, [id])

console.log("id:", id)
console.log("order:", order)
  const handleSuccess = async () => {
    try {
      await fetch(`http://localhost:3000/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: "processing",
          payment: {
            ...order.payment,
            status: "paid",
          },
          updatedAt: new Date().toISOString(),
        }),
      });

      setOrder((prev) => ({
        ...prev,
        orderStatus: "processing",
        payment: {
          ...prev.payment,
          status: "paid",
        },
      }));

      navigate("/paymentsuccess");
    } catch (error) {
      console.log(error);
      alert("خطا در ثبت پرداخت");
    }
  };

  const handleFail = async () => {
    try {
      await fetch(`http://localhost:3000/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment: {
            ...order.payment,
            status: "failed",
          },
          updatedAt: new Date().toISOString(),
        }),
      });

      setOrder((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          status: "failed",
        },
      }));

      navigate("/paymentfail");
    } catch (error) {
      console.log(error);
      alert("خطا در ثبت وضعیت پرداخت");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg flex flex-col gap-5 w-96">

        <h1 className="text-2xl font-bold text-center">
          شبیه‌سازی درگاه پرداخت
        </h1>

        <div className="border rounded-lg p-4 bg-gray-50">
          <p>
            شماره سفارش:
            <span className="font-bold mr-2">
              {order?.orderId}
            </span>
          </p>

          <p className="mt-2">
            مبلغ:
            <span className="font-bold mr-2">
              {order?.pricing?.finalTotal?.toLocaleString()}
              {" "}
              تومان
            </span>
          </p>
        </div>

        <button
          onClick={handleSuccess}
          className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
        >
          پرداخت موفق
        </button>

        <button
          onClick={handleFail}
          className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition"
        >
          پرداخت ناموفق
        </button>

      </div>
    </div>
  );
};

export default PaymentPage;