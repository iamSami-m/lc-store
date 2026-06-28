import React, { useEffect, useState } from 'react'

const WishList = () => {
  const [wishlist,setWishList]=useState([])
  const {id}=JSON.parse(localStorage.getItem("user"))

  useEffect(()=>{
    const loadWishes=async ()=>{
      const wishlistProductIds=await fetch(`http://localhost:3000/wishlists?userId=${id}`)
      .then(res=>res.json())
    

    const products=await fetch("http://localhost:3000/products")
      .then(res=>res.json())
      
    const wishListProducts=products.filter(product=>
      wishlistProductIds.some(wish=>wish.productId===product.id)
    ).map(product=>{
      const wish=wishlistProductIds.find(wish=>wish.productId===product.id)
      return {
        ...product,
        wishId:wish.id
      }
    }
      
    )
    setWishList(wishListProducts)
    }
  
   loadWishes()
    
  },[])

  const handleDelete=async(id)=>{
   await fetch(`http://localhost:3000/wishlists/${id}`,{
      method:"DELETE",
      headers:{'Content-Type':'application/json'},
    })
    setWishList((prev)=>
      prev.filter(item=>item.wishId!==id)
    )
    console.log("wishlist",wishlist)
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="flex flex-col border-2 p-5 rounded-lg"
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