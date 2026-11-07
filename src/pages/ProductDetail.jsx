import { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import {BASE_URL} from "../config.js"
import {
  Heart,
} from "lucide-react";
import { UserContext } from "../context/UserContext.jsx";

export default function ProductDetails() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const heart = searchParams.get("heart");
  const userWishId = searchParams.get("wishId");
  const curentUser=JSON.parse(localStorage.getItem("user"))
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [isFaviorite,setIsFavorite]=useState(false)
  const [wishId,setWishId]=useState(null)
  const navigate=useNavigate()

  useEffect(() => {
    if (!productId) return;

    fetch(`${BASE_URL}/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));

      setIsFavorite(heart)
      setWishId(userWishId)
  }, [productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">در حال بارگذاری...</p>
      </div>
    );
  }
  const handleAddToWishlist=async (productId)=>{
    
    if(isFaviorite){
      const res=await fetch(`${BASE_URL}/wishlists/${wishId}`,{
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json"
        }
      })
       const data=await res.json()
        
      
        setWishId(null)
        setIsFavorite(false)
    

      
      }
    else{
      if(!curentUser){
        navigate('/Auth')
      }
      const curentUserId=curentUser.id
      const res=await fetch(`${BASE_URL}/wishlists`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          curentUserId,
          productId
        })
      })
      const data=await res.json()

        setIsFavorite(true);
        setWishId(data.wishId)
      
      
      
    }
    
    
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          
          {/* تصویر محصول */}
          <div className="relative flex justify-center items-center ">
          <Heart className={` absolute right-10 top-10 ${isFaviorite ? "text-red-500" : "test-gray-400" }`} onClick={()=>handleAddToWishlist(productId)}/>
             
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