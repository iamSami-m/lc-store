import React, { useState } from 'react'
import {useUpdateCustomer,useUpdatePassword} from '../services/customers.services'
import UpdateUserSchema from '../schemas/UpdateUserSchema'
import ChangePasswordSchema from '../schemas/ChangePasswordSchema'


const UserProfile = () => {
  //رشته است باید به json تبدیل بشه
  const currentUser=JSON.parse(localStorage.getItem("user"))
  const [newUser,setNewUser]=useState(
    currentUser||{
      firstName:"",
      lastName:"",
      email: "",
      tel: "",
      birthDate: "",
      gender: "",
    }
  )
  const [passwordInfo,setPasswordInfo]=useState({
    currentPassword:"",
    newPassword:"",
    confirmPassword:""
  })
  const [errors,setErrors]=useState([])
  const updateCustomer=useUpdateCustomer()
  const updatePassword=useUpdatePassword()

  const handleUserChange=(e)=>{
    const {name,value}=e.target
    setNewUser((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const handleUserSubmit=async (e)=>{
    e.preventDefault();

    try{
      const validatedData=await UpdateUserSchema.validate(newUser,{abortEarly:false})
      updateCustomer.mutate(
  {
    id: newUser.id,
    updatedCustomer: {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      tel: validatedData.tel,
      gender: validatedData.gender,
      email: validatedData.email,
    },
  },
  
);
    }catch(error){
      if (error.name === "ValidationError") {
      const validationErrors={};

      error.inner.forEach((err)=>{
        validationErrors[err.path]=err.message
      });

      setErrors(validationErrors)
  }

    
  }
   
    
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
    const validatedData=await ChangePasswordSchema.validate(passwordInfo,{abortEarly:false})

    if(validatedData.currentPassword!==currentUser.password)
    {
      alert("رمز فعلی اشتباه است");
      return;
    }
    updatePassword.mutate({
      id:currentUser.id,
      updatedPassword:{
        password:passwordInfo.newPassword
      }
    })
    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    }
    catch(error){
      if (error.name === "ValidationError") {
      console.log(error.errors);
  }}

    
  }
  return (
    <div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 lg:p-8" onSubmit={handleUserSubmit}>

        <div>
          <label>نام</label>
          <input className="w-full rounded-xl p-4 border" onChange={handleUserChange} name="firstName" value={newUser.firstName}/>
          {errors.firstName&&(
            <p className='text-red-500 text-sm'>
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label>نام خانوادگی</label>
          <input className="w-full rounded-xl p-4 border" onChange={handleUserChange} name="lastName" value={newUser.lastName}/>
           {errors.lastName&&(
            <p className='text-red-500 text-sm'>
              {errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label>تلفن همراه</label>
          <input className="w-full rounded-xl p-4 border" onChange={handleUserChange} name="tel" value={newUser.tel} disabled/>
        </div>

        <div>
          <label>ایمیل</label>
          <input className="w-full rounded-xl p-4 border" onChange={handleUserChange} name="email" value={newUser.email}/>
           {errors.email&&(
            <p className='text-red-500 text-sm'>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label>جنسیت</label>
          <select className="w-full rounded-xl p-4 border" onChange={handleUserChange} name="gender" value={newUser.gender}>
            <option value="femaile">زن</option>
            <option value="male">مرد</option>
          </select>
           {errors.gender&&(
            <p className='text-red-500 text-sm'>
              {errors.gender}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-yellow-400 px-8 py-4 rounded-2xl w-full md:w-auto"
          >
            ثبت اطلاعات
          </button>
        </div>

      </form>
      <h1 className='font-extrabold mx-6 md:mx-8 lg:mx-10 text-xl'>تغییر کلمه عبور</h1>
      <form action="" onSubmit={handlePasswordSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 lg:p-8'>
        <div>
          <label htmlFor="">کلمه عبور فعلی</label>
          <input type="text" name='currentPassword' value={passwordInfo.currentPassword} onChange={handlePasswordChange} className="w-full rounded-xl p-4 border"/>
        </div>
        <div>
          <label htmlFor="">کلمه عبور جدید</label>
          <input type="text" name='newPassword' value={passwordInfo.newPassword} onChange={handlePasswordChange} className="w-full rounded-xl p-4 border"/>
        </div>
        <div>
          <label htmlFor="">تایید کلمه عبور جدید</label>
          <input type="text" name='confirmPassword' value={passwordInfo.confirmPassword} onChange={handlePasswordChange} className="w-full rounded-xl p-4 border"/>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-yellow-400 px-8 py-4 rounded-2xl w-full md:w-auto"
            >تغییر کلمه عبور
          </button>
        </div>
      </form>
      
    </div>
  )
}

export default UserProfile