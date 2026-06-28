import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  LogIn,
  Search,
  Menu,
  User,
  X,
  Pointer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import {UserContext} from "../context/UserContext"

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const {user}=useContext(UserContext)
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue,setSearchValue]=useState("")
  const navigate=useNavigate()

  const categories = [
  { id: 1, title: "زنانه" },
  { id: 2, title: "مردانه" },
  { id: 3, title: "کیف" },
  { id: 4, title: "کفش" },
  { id: 5, title: "روسری" },
  { id: 6, title: "اکسسوری" },
];
  return (
    <nav
      className="sticky top-0 z-50 bg-[rgba(0,0,0,0.4)] text-white
      backdrop-blur-sm transition-all duration-300 pb-6 "
    >
      {/* TOP BAR */}
      <div className="container mx-auto flex items-center justify-between px-4 py-4">

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold">
          <Link to="/">LC Store</Link>
        </h1>
       

        {/* Search Desktop */}
        <div className="hidden lg:flex border border-white px-4 w-[500px] rounded-md">
          <div className="flex items-center w-full">
            <Search 
              className="cursor-pointer"
              onClick={()=>{
                if(!searchValue.trim()) return
                else{
                  navigate(`/products?search=${encodeURIComponent(searchValue)}`)
                  
                }
                setSearchValue("")
              }}/>
            <input
              type="text"
              value={searchValue}
              placeholder="جستجو"
              className="w-full px-3 py-2 bg-transparent outline-none"
              onChange={(e)=>setSearchValue(e.target.value)}
              onKeyDown={(e)=>{
                  if(e.key==="Enter"){
                    navigate(`/products?search=${encodeURIComponent(searchValue)}`)
                  
                  setSearchValue("")
                  }
              }}  
            />
          </div>
        </div>

        {/* Icons */}
        <ul className="flex items-center gap-4">
          {user? user.role==="user"?
            <li>
            <Link to="/dashboard">
              <User />
            </Link>
            </li>
            :
            <li>
            <Link to="/admindashboard">
              <User />
            </Link>
            </li>
          :
          <li>
            <Link to="/auth">
              <LogIn />
            </Link>
          </li>
          }
          

          <li>
            <NavLink to={'/Dashboard/WishList'}><Heart /></NavLink>
          </li>

          <li className="relative">
            <Link to="/cart">
              <ShoppingCart />

              {cart.length > 0 && (
                <span
                  className="
                  absolute
                  -top-2
                  -right-2
                  w-5
                  h-5
                  rounded-full
                  bg-red-600
                  text-xs
                  flex
                  items-center
                  justify-center"
                >
                  {cart.length}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden px-4 pb-4">
        <div className="flex items-center bg-white rounded-md px-3">
          <Search className="text-black" />
          <input
            type="text"
            placeholder="جستجو"
            className="w-full p-2 text-black outline-none"
          />
        </div>
      </div>

      {/* Desktop Categories */}
      <div className="hidden md:flex gap-6 hidden ">
        {categories.map((cat) => (
        
        <NavLink
        
          key={cat.id}
          to={`/products?categoryId=${cat.id}`}
          className={({isActive})=>
          `px-3 py-2 text-xl transition-all duration-300
          ${isActive?' font-bold':'hover:text-red-600'}`}          
        >
              {cat.title}
       
     
          
        </NavLink>
))}
      </div>
      

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden" >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />

          <div
            className="
            fixed
            top-0
            right-0
            h-full
            w-72
            w-full bg-[rgba(0,0,0,0.6)]
            text-white
            font-bold
            shadow-lg
            p-5
            z-50"
          >
            <div className="flex justify-between items-center mb-6 bg-[rgba(0,0,0,0.6)]">
              <h2 className="font-bold text-xl">
                دسته بندی ها
              </h2>

              <button
                className="text-white"
                onClick={() => setMenuOpen(false)}
              >
                <X />
              </button>
            </div>
            <div className=" flex flex-col gap-5 text-lg bg-[rgba(0,0,0,0.6)]">  
            {categories.map((cat)=>
              <NavLink 
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className={({isActive})=>
                `px-3 py-2 text-xl transition-all duration-300
                ${isActive?' font-bold':'hover:text-red-600'}`}  >
                {cat.title}

              </NavLink>
            )}
            </div>
            
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;