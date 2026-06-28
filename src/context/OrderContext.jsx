import {  createContext, useState } from "react";

export const OrderContext=createContext()

export default function OrderProvider({children}){

    const [order,setOrder]=useState(null)

    {/*draft       -> کاربر هنوز نهایی نکرده
    pending     -> ثبت شده، منتظر پرداخت
    paid        -> پرداخت موفق
    processing  -> در حال آماده‌سازی
    shipped     -> ارسال شده
    delivered   -> تحویل شده
    cancelled   -> لغو شده
    failed      -> پرداخت ناموفق*/}
    return(
        <OrderContext.Provider
            value={{
                order,
                setOrder
            }}
            >
                {children}
        </OrderContext.Provider>
    )
}