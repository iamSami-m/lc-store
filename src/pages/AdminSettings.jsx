import React, { useState } from "react";
import { useUpdateCustomer,useUpdatePassword } from "../services/customers.services";
import {
  User,
  Shield,
  Truck,
  CreditCard,
  Palette,
  Save,
} from "lucide-react";
import ChangePasswordSchema from '../schemas/ChangePasswordSchema'

const AdminSettings = () => {
  const [adminInfo,setAdminInfo]=useState(()=>{
    const user=localStorage.getItem("user")
    return user? JSON.parse(user): null
  })

  const updateCustomer=useUpdateCustomer()
  const updatePassword=useUpdatePassword()

  const [tab, setTab] = useState("profile");

   

  const tabs = [
    { id: "profile", label: "پروفایل", icon: User },
    { id: "security", label: "امنیت", icon: Shield },
    { id: "shipping", label: "ارسال", icon: Truck },
    { id: "payment", label: "پرداخت", icon: CreditCard },
    { id: "ui", label: "ظاهر", icon: Palette },
  ];

  const handleChange=(e)=>{
    const {name,value}=e.target

    setAdminInfo(prev=>({
      ...(prev || {}),
      [name]:value
    }))
  }

  const handleSubmit=(e)=>{
    e.preventDefault();

    updateCustomer.mutate({
      id:adminInfo.id,
      updatedCustomer:{
        name:adminInfo.name,
        email:adminInfo.email,
        tel:adminInfo.tel
      }
    })

  }

  const handlePasswordChange=(e)=>{
    const {name,value}=e.target

    setPasswordInfo((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const handlePasswordSubmit=async (e)=>{
    e.preventDefault()

    try{
      
      const validatedData=await ChangePasswordSchema.validate(passwordInfo,{ abortEarly: false })

      if (validatedData.currentPassword !== adminInfo.password) {
      alert("رمز فعلی اشتباه است");
      return;
    }
      updatePassword.mutate(
      {
        id: adminInfo.id,
        updatedPassword: {
          password: validatedData.newPassword,
        },
      },
    {
    onSuccess: (data) => {
      const updatedUser = {
        ...adminInfo,
        ...data,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setAdminInfo(updatedUser);
    },
  }
);

    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    }
    //خطا : Error داخل پرانتز ننوشته بودم
    catch(error){
      if (error.name === "ValidationError") {
      console.log(error.errors);
  }

    
  }
  }
  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">تنظیمات پنل ادمین</h1>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR TABS */}
        <div className="lg:w-1/4 w-full flex lg:flex-col gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition w-full
              ${
                tab === t.id
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <t.icon className="w-5 h-5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-white border rounded-2xl p-6 shadow-sm">

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">اطلاعات پروفایل</h2>
              <form onSubmit={handleSubmit}>
                  <input className="w-full border p-2 rounded" name="name" value={adminInfo.name} placeholder={adminInfo.name} onChange={handleChange}/>
                  <input className="w-full border p-2 rounded" name="email" value={adminInfo.email} placeholder={adminInfo.email} onChange={handleChange}/>
                  <input className="w-full border p-2 rounded" name="tel" value={adminInfo.tel} placeholder={adminInfo.tel} onChange={handleChange}/>

                  <button type="submit" className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded">
                    <Save className="w-4 h-4" />
                    ذخیره
                  </button>
              </form>
              
            </div>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">امنیت حساب</h2>

              <form action=""
                onSubmit={handlePasswordSubmit}>
                <input 
                type="password"
                name="currentPassword"
                value={passwordInfo.currentPassword}
                className="w-full border p-2 rounded" 
                placeholder="رمز فعلی"
                onChange={handlePasswordChange}/>
                <input 
                type="password"
                name="newPassword"
                value={passwordInfo.newPassword}
                className="w-full border p-2 rounded" 
                placeholder=" رمز جدید" 
                onChange={handlePasswordChange}/>
                <input 
                type="password"
                name="confirmPassword"
                value={passwordInfo.confirmPassword}
                className="w-full border p-2 rounded" 
                placeholder="تکرار رمز جدید"
                onChange={handlePasswordChange}/>
              <button 
                type="submit"
                disabled={updatePassword.isPending}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded">
                  {
                    updatePassword.isPending?"در حال به روزرسانی":"ذخیره"
                  }
              </button>
                </form>
            </div>
          )}

          {/* SHIPPING */}
          {tab === "shipping" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">تنظیمات ارسال</h2>

              <input className="w-full border p-2 rounded" placeholder="هزینه ارسال پیش فرض" />
              <input className="w-full border p-2 rounded" placeholder="ارسال رایگان از مبلغ" />

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                فعال بودن ارسال سریع
              </label>

              <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                <Save className="w-4 h-4" />
                ذخیره
              </button>
            </div>
          )}

          {/* PAYMENT */}
          {tab === "payment" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">تنظیمات پرداخت</h2>

              <select className="w-full border p-2 rounded">
                <option>زرین‌پال</option>
                <option>IDPay</option>
                <option>Stripe</option>
              </select>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                حالت تست فعال باشد
              </label>

              <button className="bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2">
                <Save className="w-4 h-4" />
                ذخیره
              </button>
            </div>
          )}

          {/* UI */}
          {tab === "ui" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">تنظیمات ظاهر</h2>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                حالت دارک مود
              </label>

              <input className="w-full border p-2 rounded" placeholder="رنگ اصلی (hex)" />

              <button className="bg-black text-white px-4 py-2 rounded flex items-center gap-2">
                <Save className="w-4 h-4" />
                ذخیره
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


export default AdminSettings;