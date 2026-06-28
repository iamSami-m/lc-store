import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (!productId) return;

    fetch(`http://localhost:3000/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }, [productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          
          {/* تصویر محصول */}
          <div className="flex justify-center items-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-full max-w-md rounded-xl object-cover"
            />
          </div>

          {/* اطلاعات محصول */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">
              {product.title}
            </h1>

            <div className="text-2xl font-bold text-yellow-600">
              {product.price.toLocaleString()} تومان
            </div>

            {product.description && (
              <div>
                <h2 className="font-semibold text-lg mb-2">
                  توضیحات محصول
                </h2>

                <p className="text-gray-600 leading-8">
                  {product.description}
                </p>
              </div>
            )}

            <button
              onClick={() => addToCart(product)}
              className="
                bg-green-500
                hover:bg-green-600
                text-white
                py-3
                rounded-xl
                font-bold
                transition
              "
            >
              افزودن به سبد خرید
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}