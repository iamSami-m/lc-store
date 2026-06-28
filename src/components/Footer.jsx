import React from "react";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaLinkedin,
  FaTwitter,
  FaYoutube
} from "react-icons/fa";
import { Link,NavLink } from "react-router-dom";

const Footer = () => {
  const categories = [
  { id: 1, title: "زنانه" },
  { id: 2, title: "مردانه" },
  { id: 3, title: "کیف" },
  { id: 4, title: "کفش" },
  { id: 5, title: "روسری" },
  { id: 6, title: "اکسسوری" },
];
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-red-500">
              LC Store
            </h2>

            <p className="text-gray-400 leading-7">
              فروشگاه آنلاین پوشاک، کیف، کفش و اکسسوری با بهترین قیمت و
              ارسال سریع به سراسر کشور.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              دسترسی سریع
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="/"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition"
                >
                  صفحه اصلی
                </Link>
              </li>

              <li>
                <Link
                  to="/products?categoryId=8"
                  onClick={()=>window.scrollTo(0,0)}
                  className="hover:text-white transition"
                >
                  محصولات
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  onClick={()=>window.scrollTo(0,0)}
                  className="hover:text-white transition"
                >
                  سبد خرید
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  onClick={()=>window.scrollTo(0,0)}
                  className="hover:text-white transition"
                >
                  حساب کاربری
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              دسته‌بندی‌ها
            </h3>

           <div className="md:flex flex-col hidden leading-7 text-gray-400 ">
                   {categories.map((cat) => (
                   
                   <NavLink
                   
                     key={cat.id}
                     to={`/products?categoryId=${cat.id}`}
                     className={({isActive})=>
                     `px-3 py-2 text-md transition-all duration-300 hover:text-white 
                     ${isActive?'font-bold':'hover:text-red-600'}`}          
                   >
                         {cat.title}
                  
                
                     
                   </NavLink>
           ))}
                 </div>
                 </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              ارتباط با ما
            </h3>

            <div className="space-y-4 text-gray-400">

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>021-12345678</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>info@lcstore.com</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>تهران، ایران</span>
              </div>

            </div>

            {/* Social */}
            <div className="flex gap-4 mt-6">

              <a
                href="#"
                className="hover:text-red-500 transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="hover:text-red-500 transition"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="hover:text-red-500 transition"
              >
                <FaYoutube />
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">
          © 2026 LC Store. تمامی حقوق محفوظ است.
        </div>

      </div>
    </footer>
  );
};

export default Footer;