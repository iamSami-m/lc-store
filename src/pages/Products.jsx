import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [productsList, setProductList] = useState([]);

  const categoryId = searchParams.get("categoryId");
  const search=searchParams.get("search")
  console.log("search:",search)
  const navigate = useNavigate();
console.log("categoryId",categoryId)
  useEffect(() => {
  const fetchProducts=async ()=>{
    const products=await fetch("http://localhost:3000/products")
    .then(res=>res.json())

    let result = products
    if(categoryId && categoryId!=="8")
      result=products.filter(product=>String(product.categoryId)===categoryId)
    
    if(search)
    {
      result=result.filter(product=>product.title.includes(search))
    }

    setProductList(result)
  }

  fetchProducts()


}, [categoryId, search])

  const showProductDetails = (itemId) => {
    navigate(`productDetail?id=${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">
        محصولات
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsList.length > 0 ? (
          productsList.map((item) => (
            <div
              key={item.id}
              onClick={() => showProductDetails(item.id)}
              className="
                bg-white
                rounded-xl
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
                cursor-pointer
                overflow-hidden
                hover:-translate-y-1
                flex justify-center items-center flex-col
              "
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-fit  h-64 object-cover"
              />

              <div className="p-4 flex flex-col gap-3">
                <h2 className="font-semibold text-gray-800 line-clamp-2 min-h-[48px]">
                  {item.title}
                </h2>

                <div className="text-yellow-600 font-bold text-lg">
                  {item.price.toLocaleString()} تومان
                </div>

                <button
                  className="
                    
                    bg-yellow-400
                    hover:bg-yellow-500
                    transition
                    rounded-lg
                    py-2
                    font-medium
                  "
                >
                  مشاهده محصول
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 text-lg">
            محصولی در این دسته‌بندی یافت نشد
          </div>
        )}
      </div>
    </div>
  );
}