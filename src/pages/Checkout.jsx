import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { Trash2, CirclePlus, CircleMinus } from 'lucide-react'
import { OrderContext } from '../context/OrderContext'
import { UserContext } from '../context/UserContext'
import {BASE_URL} from "../config.js"


const Checkout = () => {
  const { cart, removeFromCart, decreaseQty, addQty } = useContext(CartContext)
  const {setOrder}=useContext(OrderContext)
  const orderId=localStorage.getItem("orderId")

  const [provinces, setProvinces] = useState([])
  const [cities, setCities] = useState([])

  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCounty, setSelectedCounty] = useState("")

  const [addressText, setAddressText] = useState("")
  const [userAddresses, setUserAddresses] = useState([])

  const [loading,setLoading]=useState(false)

  const {user}=useContext(UserContext)
  const navigate=useNavigate()

  const provinceData = provinces.find(
 p => Number(p.id) === Number(selectedProvince)
)

const cityData= provinceData?.counties?.find(
 c => Number(c.id) === Number(selectedCounty)
)


  const { id, name, tel } = user || {}
  if (!cart?.length) return <Navigate to="/cart" />
  if (!user) return <Navigate to="/auth"/>

  // 🔥 مشترک برای لود استان + شهر
  const loadProvinceData = async (provinceId, countyId = null) => {
    const res = await fetch(`${BASE_URL}/provinces/${provinceId}`)
    const data = await res.json()
    
    setCities(data.counties)
    setSelectedProvince(provinceId)

    if (countyId) {
      setSelectedCounty(countyId)
    }
  }

  // 🔥 fetch اولیه
  useEffect(() => {

    // provinces list
    fetch(`${BASE_URL}/provinces`)
      .then(res => res.json())
      .then(data => setProvinces(data))
      
       if (!id) return;
    // user address
    fetch(`${BASE_URL}/addresses?userId=${id}`)
      .then(res => res.json())
      .then(async (data) => {
        setUserAddresses(data)

        if (data.length === 0) return

        const address = data[0]

        setAddressText(address.explanation || "")

        // load province + city
        loadProvinceData(
          address.provinceId,
          address.countyId
        )
      })

  }, [id])
 
  // 🔥 تغییر استان
  const handleProvinceChange = (e) => {
    const value = Number(e.target.value)
    loadProvinceData(value)
  }
  async function handleSubmitOrder() {

    setLoading(true)

    try {
      const itemsTotal = cart.reduce(
        (sum, item) => sum + (item.price * item.qty),
        0
      )

      const shippingCost = 50000
      const discount = 0

      const finalTotal = itemsTotal +
        shippingCost -
        discount
      //const orderId=await generateOrderId()
      const newOrder = {
        //id:orderId,
        //orderId:orderId,
        customer: {
          id: user.id,
          name,
          tel
        },

        items: cart,

        shippingAddress: {
          provinceId: selectedProvince,
          provinceName: provinceData?.name || "",
          countyId: selectedCounty,
          countyName: cityData?.name || "",
          address: addressText
        },

        pricing: {
          itemsTotal,
          shippingCost,
          discount,
          finalTotal
        },

        payment: {
          // method: "online",     // online | cod (در محل)
          status: "pending", // pending | paid | failed | refunded
          transactionId: null
        },
        //orderStatus: "draft", 
        // draft → pending → paid → processing → shipped → delivered → cancelled
        //createdAt: new Date().toISOString(),
        //updatedAt: new Date().toISOString()
      }
      console.log("cart",cart)
      if (!orderId) {
        const res = await fetch(`${BASE_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newOrder)
        })
        const savedData = await res.json()
        const orderId = savedData.id
        localStorage.setItem("orderId", orderId)
        setOrder(savedData)
        navigate(`/ordersummary/${orderId}?payment=true`)
      }
      else {
        const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newOrder)
        })
        if(res.ok){
          navigate(`/ordersummary/${orderId}?payment=true`)
        }
        
      } 
    } finally {
      setLoading(false)
    }
  }
useEffect(()=>{
  
},cart)
  
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 w-full h-screen'>

      {/* FORM */}
      <div className='bg-red-300 p-40'>

        <form>

          <div className='flex gap-2 mb-2'>
            <input
              type="text"
              placeholder="نام"
              defaultValue={name}
              className='bg-white py-2 px-2 rounded-sm w-4/12'
            />
            <input
              type="text"
              placeholder="نام خانوادگی"
              className='bg-white py-2 px-2 rounded-sm w-8/12'
            />
          </div>

          <input
            type="tel"
            placeholder="شماره تماس"
            defaultValue={tel}
            className='bg-white py-2 px-2 mb-2 rounded-sm w-full'
          />

          {/* PROVINCE */}
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className='w-full py-2 mb-2 bg-white'
          >
            <option value="">انتخاب استان</option>
            {provinces.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {/* COUNTY */}
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(Number(e.target.value))}
            className='w-full py-2 mb-2 bg-white'
          >
            <option value="">انتخاب شهر</option>
            {cities.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {/* ADDRESS */}
          <textarea
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            placeholder="آدرس دقیق خود را وارد کنید"
            className='bg-white w-full'
            rows={5}
          />
          {/* Load User Addresses */}
          {userAddresses?.map((item) => {

            const province = provinces.find(
              p => Number(p.id) === Number(item.provinceId)
            )

            const provinceName = province?.name || ""

            const city = province?.counties?.find(
              c => Number(c.id) === Number(item.countyId)
            )

            const cityName = city?.name || ""

            return (
              <label
                key={item.addressId}
                className="block border p-2 mb-2 rounded cursor-pointer bg-white"
              >

                <input
                  type="radio"
                  name="address"
                  value={item.addressId}
                  onChange={() => {

                    setSelectedProvince(item.provinceId)
                    setSelectedCounty(item.countyId)
                    setAddressText(item.explanation)

                    loadProvinceData(
                      item.provinceId,
                      item.countyId
                    )
                  }}
                />

                <span className="mr-2 font-bold">
                  {provinceName} - {cityName}
                </span>

                <div className="text-sm text-gray-600">
                  {item.explanation}
                </div>

              </label>
            )
          })}
        </form>
      </div>

      {/* CART */}
      <div className='bg-blue-300 py-40 px-15 flex flex-col items-center'>

        <table className="border-gray-200 rounded-lg overflow-hidden">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">تصویر</th>
              <th className="px-4 py-2 border-b">نام کالا</th>
              <th className="px-4 py-2 border-b">قیمت</th>
              <th className="px-4 py-2 border-b">تعداد</th>
              <th className="px-4 py-2 border-b">قیمت کل</th>
              <th className="px-4 py-2 border-b">حذف</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {cart.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 border-b-2">

                <td>
                  <img src={item.image} className="w-20 h-20 px-4 py-2" />
                </td>

                <td className="px-4 py-2">{item.title}</td>

                <td className="px-4 py-2">{item.price.toLocaleString()}</td>

                <td className="px-4 py-2 flex items-center justify-center gap-2">
                  <button 
                  type="button"
                  onClick={() => decreaseQty(item.id)}>
                    <CircleMinus />
                  </button>

                  {item.qty}

                  <button 
                  type="button"
                  onClick={() => addQty(item.id)}>
                    <CirclePlus />
                  </button>
                </td>

                <td className="px-4 py-2">
                  {(item.price * item.qty).toLocaleString()}
                </td>

                <td className="px-4 py-2">
                  <button
                   type="button"
                   onClick={() => removeFromCart(item.id)}>
                    <Trash2 />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        <button
          disabled={loading}
          onClick={handleSubmitOrder}
          className="border-2 w-100 mt-5 bg-red-500 py-2 px-2 text-center"
        >
          {loading ? "در حال ثبت سفارش..." : "ثبت سفارش"}
        </button>

      </div>

    </div>
  )
}

export default Checkout