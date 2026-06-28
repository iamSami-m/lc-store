import { Link } from 'react-router-dom'


const PaymentFailed=()=>{

 return(

 <div className="h-screen flex flex-col justify-center items-center">

   <h1 className="text-red-600 text-3xl">
    پرداخت ناموفق
   </h1>

   <p>
    تراکنش انجام نشد
   </p>

   <Link to="/ordersummary">
    بازگشت و تلاش مجدد
   </Link>

 </div>

 )

}
export default PaymentFailed