import React, { useState } from 'react'
import {  Upload } from 'lucide-react';

const AddItem = ({data}) => {
  const [formData,setFormData]=useState({
    imageUrl:null,
    productName:"",
    productCat:"",
    productType:""
  })

  
  const handleChange=(e)=>{
    const {name,value,files,type}=e.target
    setFormData({
      ...formData,
      [name]:type==="file"?"/images/" + files[0].name:value
  })
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();

    const newProduct = {
    title: formData.productName,
    categoryId: formData.productCat,
    typeId: formData.productType,
    image: formData.imageUrl
  };

    await fetch("http://localhost:3000/products",
      {
        method:"POST",
        headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newProduct)
      }
    )
  }
  return (
    <div className='w-full min-h-screen '>
    <div  className='w-200 h-auto p-4 py-9'>
      <form className='p-8' onSubmit={handleSubmit} >
        
        
        <label  className=''>نام محصول :  </label>
        <input required type="text" name="productName" id='name' value={formData.productName} className='bg-white my-4 py-2 w-90' onChange={handleChange}/>
        
        <br />
        <label htmlFor="" className=' '>دسته بندی :  </label>
        <select required className=' bg-white my-4 w-40 p-3 rounded-md mr-3' name="productCat" value={formData.productCat} onChange={handleChange}>
          <option value={1}>زنانه</option>
          <option value={2}>مردانه</option>
          <option value={3}>کیف</option>
          <option value={1}>کفش</option>
        </select>
        
        <br/>
        <label htmlFor=""  className=''>نوع محصول :  </label>
        <select required className='  bg-white w-40 p-3 rounded-md ' name='productType' value={formData.productType} onChange={handleChange}>
          <option value={1}>تیشرت</option>
          <option value={2}>جین</option>
          <option value={3}>هودی</option>
          <option value={1}>تیشرت</option>
        </select>
        
      <br/>
        <input type='file' accept='image/*' 
        id="upload"
        className='hidden' 
        name='imageUrl'
        onChange={handleChange}/>
        <label htmlFor='upload'  className='flex items-center justify-center flex-col gap-2
          w-fit
          py-10 px-8
          mr-25
          mt-8
          border-2
          border-dotted
          cursor-pointer
          transition-all'>
          <Upload/>
          <span>آپلود تصویر</span>
        </label>
        <button type='submit' className='bg-white px-6 py-2 border-2 mt-8 w-90 mr-22'>ثبت</button>
      </form>
    </div>
    </div>
  )
}

export default AddItem