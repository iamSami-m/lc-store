import React, { useContext, useEffect, useState } from 'react'
import { OrderContext } from '../context/OrderContext'
import { Navigate, NavLink, useLocation, useNavigate,useParams, useSearchParams } from 'react-router-dom'

const OrderSummary = () => {

  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const showPayment = searchParams.get("payment") === "true"
  const adminRequest=searchParams.get("admin")==="true"
  const [order, setOrder] = useState(null)
  const [orderStatus,setOrderStatus]=useState("")
  const [paymentStatus,setPaymentStatus]=useState("") 

  const navigate=useNavigate()
  useEffect(()=>{
    fetch(`http://localhost:3000/orders/${id}`)
    .then(res=>res.json())
    .then(data=>{
        setOrder(data)
        setOrderStatus(data.orderStatus)
        setPaymentStatus(data.payment.status)
      })
  },[id])
  if (!order) {
    return <div>Loading...</div>
  }

  
  const handleBackToOrders=()=>{
    if(adminRequest)
    {
      navigate ("/admindashboard/admindashboardorderlist")
      return
    }
      
    navigate ("/dashboard/orders")
  }

  

  const handleOrderChanges=async ()=>{
    await fetch(`http://localhost:3000/orders/${id}`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        orderStatus,
        payment:{
          ...order.payment,
          status:paymentStatus
        }
      })
    })
    navigate('/admindashboard/admindashboardorderlist')
  }
  return (

    <div className='min-h-screen bg-gray-100 p-8'>

      <div
      id="invoice"
      className='max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-10'
      >

        {/* Header */}

        <div className='flex justify-between border-b pb-5'>

          <div>

            <h1 className='text-3xl font-bold'>
              فاکتور سفارش
            </h1>

            <p className='text-gray-500 mt-2'>
              شماره سفارش :
              {order.orderId || "ثبت نشده"}
            </p>

            <p className='text-gray-500'>
              تاریخ :
              {order.createdAt}
            </p>

          </div>

          <div>

            {!adminRequest&&<span
            className='bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full'
            >
              {order.orderStatus}
            </span>}
            {adminRequest&&
            <div>
              <span className="font-bold">وضعیت سفارش : </span>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className='bg-yellow-300 mr-6 border-2 p-2'
              >
                <option value="draft">Draft</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
             
            }

          </div>

            <div>

            {!adminRequest&&<span
            className='bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full'
            >
              {order.payment.status}
            </span>}
            {adminRequest&&
            <div>
              <span className="font-bold">وضعیت پرداخت : </span>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className='bg-yellow-300 mr-6 border-2 p-2'
              >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
              </select>
            </div>
             
            }

          </div>
        </div>


        {/* Customer */}

        <div className='grid grid-cols-2 gap-8 mt-8'>

          <div>

            <h2 className='font-bold mb-3 text-lg'>
              اطلاعات مشتری
            </h2>

            <div className='bg-gray-50 p-4 rounded'>

              <p>
                نام :
                {order.customer?.name}
              </p>

              <p>
                تلفن :
                {order.customer?.tel}
              </p>

            </div>

          </div>


          <div>

            <h2 className='font-bold mb-3 text-lg'>
              آدرس ارسال
            </h2>

            <div className='bg-gray-50 p-4 rounded'>

              <p>
                استان :
                {order.shippingAddress?.provinceName || "-"}
              </p>

              <p>
                شهر :
                {order.shippingAddress?.countyName || "-"}
              </p>

              <p>
                آدرس :
                {order.shippingAddress?.address}
              </p>

            </div>

          </div>

        </div>


        {/* Table */}

        <div className='mt-10'>

          <table
          className='w-full border border-gray-200'
          >

            <thead>

              <tr
              className='bg-gray-100'
              >

                <th className='p-3'>
                  تصویر
                </th>

                <th className='p-3'>
                  کالا
                </th>

                <th className='p-3'>
                  قیمت
                </th>

                <th className='p-3'>
                  تعداد
                </th>

                <th className='p-3'>
                  جمع
                </th>

              </tr>

            </thead>


            <tbody>

              {
                order?.items?.map(item => (

                  <tr
                  key={item.id}
                  className='border-t text-center'
                  >

                    <td className='p-3'>

                      <img
                      src={item.image}
                      alt=""
                      className='w-16 h-16 object-contain mx-auto'
                      />

                    </td>

                    <td>
                      {item.title}
                    </td>

                    <td>
                      {item.price.toLocaleString()}
                    </td>

                    <td>
                      {item.qty}
                    </td>

                    <td>

                      {
                        (
                          item.price *
                          item.qty
                        )
                        .toLocaleString()
                      }

                    </td>

                  </tr>

                ))
              }

            </tbody>

          </table>

        </div>


        {/* Total */}

        <div
        className='flex justify-end mt-8'
        >

          <div
          className='w-72 bg-gray-50 p-5 rounded'
          >

            <div
            className='flex justify-between'
            >

              <span>
                تعداد اقلام
              </span>

              <span>

                {
                  order?.items?.reduce(
                    (sum,item)=>
                    sum+item.qty,
                    0
                  )
                }

              </span>

            </div>


            <div
            className='flex justify-between mt-3 font-bold text-lg'
            >

              <span>
                جمع کل
              </span>

              <span>

                {
                  order.pricing?.finalTotal
                  .toLocaleString()
                }

                تومان

              </span>

            </div>

          </div>

        </div>


        {/* Buttons */}

        <div
        className='flex gap-4 mt-10'
        >

          {!adminRequest&&<button
          onClick={() =>
            window.print()
          }
          className='bg-black text-white px-6 py-3 rounded'
          >

            چاپ فاکتور

          </button>}


          {showPayment&&<button
          className='bg-green-600 text-white px-6 py-3 rounded'
          onClick={() => navigate(`/paymentpage?id=${id}`)}
          >

            پرداخت

          </button>}
          {!showPayment&&<button className='bg-green-600 text-white px-6 py-3 rounded' onClick={handleBackToOrders}>بازگشت به سفارش ها</button>}
          {adminRequest&&<button className='bg-red-600 text-white px-6 py-3 rounded' onClick={handleOrderChanges} >ذخیره تغییرات</button>}
        </div>

      </div>

    </div>

  )

}

export default OrderSummary

