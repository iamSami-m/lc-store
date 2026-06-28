import React, { useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { OrderContext } from '../context/OrderContext'

const PaymentSuccess = () => {
  const {order,setOrder}=useContext(OrderContext)
  console.log("order:",order)

  const saved=useRef(false)

  useEffect(()=>{
    if(!order)return
    if(saved.current)return
    saved.current=true
    const updatOrder={
      ...order,
      orderStatus:"پرداخت شده"
    }
    setOrder(updatOrder)
    fetch("http://localhost:3000/orders",{
          method:"Post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatOrder)
  })
  },[])
 return(

 <div className="h-screen flex flex-col justify-center items-center">

   <h1 className="text-green-600 text-3xl">
    پرداخت موفق بود
   </h1>

   <p>
    سفارش شما ثبت شد
   </p>

   <Link to="/dashboard">
    مشاهده سفارش‌ها
   </Link>

 </div>

 )
}

export default PaymentSuccess