import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import {
  Trash2,
  CirclePlus,
  CircleMinus,
  ShoppingBasket,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, decreaseQty, addQty } = useContext(CartContext);

  const shippingCost = 1200000;

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const finalPrice = totalPrice + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col justify-center items-center gap-6">
        <ShoppingBasket className="w-32 h-32 text-gray-400" />

        <h2 className="text-2xl font-bold">
          سبد خرید شما خالی است
        </h2>

        <p className="text-gray-500">
          هنوز محصولی به سبد خرید اضافه نکرده‌اید.
        </p>

        <Link
          to="/"
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-medium"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 font-bold bg-gray-100">
          <div className="col-span-2">تصویر</div>
          <div className="col-span-4">محصول</div>
          <div className="col-span-2 text-center">قیمت</div>
          <div className="col-span-2 text-center">تعداد</div>
          <div className="col-span-1 text-center">مجموع</div>
          <div className="col-span-1 text-center">حذف</div>
        </div>

        {cart.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 items-center p-4 border-b"
          >
            <div className="col-span-12 md:col-span-2 flex justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-xl"
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <h3 className="font-medium">{item.title}</h3>
            </div>

            <div className="col-span-4 md:col-span-2 text-center">
              {item.price.toLocaleString()} تومان
            </div>

            <div className="col-span-4 md:col-span-2 flex justify-center items-center gap-2">
              <button onClick={() => decreaseQty(item.id)}>
                <CircleMinus />
              </button>

              <span>{item.qty}</span>

              <button onClick={() => addQty(item.id)}>
                <CirclePlus />
              </button>
            </div>

            <div className="col-span-3 md:col-span-1 text-center font-bold">
              {(item.price * item.qty).toLocaleString()}
            </div>

            <div className="col-span-1 flex justify-center">
              <button onClick={() => removeFromCart(item.id)}>
                <Trash2 className="text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            مجموع سفارش
          </h2>

          <div className="flex justify-between py-3 border-b">
            <span>جمع کالاها</span>
            <span>{totalPrice.toLocaleString()} تومان</span>
          </div>

          <div className="flex justify-between py-3 border-b">
            <span>هزینه ارسال</span>
            <span>{shippingCost.toLocaleString()} تومان</span>
          </div>

          <div className="flex justify-between py-4 font-bold text-lg">
            <span>مبلغ قابل پرداخت</span>
            <span>{finalPrice.toLocaleString()} تومان</span>
          </div>

          <Link
            to="/checkout"
            className="block text-center bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 mt-4 transition"
          >
            ثبت سفارش
          </Link>
        </div>
      </div>
    </div>
  );
}