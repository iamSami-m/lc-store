import React, { useEffect, useState } from 'react'
import {BASE_URL} from "../config.js"
import { useNavigate } from 'react-router-dom'

const WishList = () => {
  const [wishlist,setWishList]=useState([])
  const {id}=JSON.parse(localStorage.getItem("user"))
  const navigate=useNavigate()

  useEffect(()=>{
    const loadWishes=async ()=>{
      const wishlistProductIds=await fetch(`${BASE_URL}/wishlists?userId=${id}`)
      .then(res=>res.json())
    const products=await fetch(`${BASE_URL}/products`)
      .then(res=>res.json())
      
    const wishListProducts=products.filter(product=>
      wishlistProductIds.some(wish=>Number(wish.productId)===Number(product.id))
    ).map(product=>{
      const wish=wishlistProductIds.find(wish=>Number(wish.productId)===Number(product.id))
      return {
        ...product,
        wishId:wish.wishId
      }
    }
      
    )
    setWishList(wishListProducts)
    }
  
   loadWishes()
    
  },[])

  const handleDelete=async(id)=>{
   await fetch(`${BASE_URL}/wishlists/${id}`,{
      method:"DELETE",
      headers:{'Content-Type':'application/json'},
    })
    setWishList((prev)=>
      prev.filter(item=>item.wishId!==id)
    )
  }

  const handleClick=(itemId,wishId)=>{
    navigate(`/products/productDetails?id=${itemId}&heart=true&wishId=${wishId}`);
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="flex flex-col border-2 p-5 rounded-lg"
          onClick={()=>handleClick(item.id,item.wishId)}
        >
          <img src={item.image} alt="" className="w-full" />
          <h1>{item.title}</h1>
          <h1>{item.price.toLocaleString()} تومان</h1>

          <button onClick={() => handleDelete(item.wishId)}>
            حذف
          </button>
        </div>
      ))}
    </div>
  )
}

export default WishList