import React, { useContext } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import UserProfile from './userprofile'
import Orders from './Orders'
import WishList from './WishList'
import UserAddresses from './UserAddresses'
import UserSettings from './UserSettings'
import { UserContext } from '../context/UserContext'


const Dashboard = () => {
  const {logout}=useContext(UserContext)
  
  return (
    <div>
      <div className='w-full h-30 bg-red-200'>
        <h1 className=" text-xl font-bold tracking-wide text-left pt-10 pl-10"><Link to="/">LC Store</Link></h1>
      </div>
      <div className='grid grid-rows md:grid-cols-4 w-full md:h-screen h-auto'>
        <div className='bg-red-300 md:col-span-1'>
          
          <aside className="flex  flex-row md:flex-col gap-6 justify-center py-10 px-6 md:text-xl text-lg">
            <NavLink to='/dashboard/userprofile'>پروفایل کاربر</NavLink>
            <NavLink to='/dashboard/orders/id'>سفارش‌ها</NavLink>
            <NavLink to='/dashboard/wishlist'>علاقه‌مندی‌ها (Wishlist)</NavLink>
            <NavLink to='/dashboard/useraddresses'>آدرس‌ها</NavLink>
            <NavLink to='/dashboard/usersettings'>تنظیمات</NavLink>
            <NavLink to="/" onClick={()=>logout()} >خروج از حساب کاربری</NavLink>
          </aside>
        </div>
        <main className=' md:col-span-3'>
          <Routes>
            <Route path='/userprofile' element={<UserProfile/>}/>
            <Route path='/orders/id' element={<Orders/>}/>
            <Route path='/wishlist' element={<WishList/>}/>
            <Route path='/useraddresses' element={<UserAddresses/>}/>
            <Route path='/usersettings' element={<UserSettings/>}/>
          </Routes>
        </main>
    </div>
    </div>
    
  )
}

export default Dashboard