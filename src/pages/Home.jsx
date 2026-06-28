import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  
  const [category,setCategory]=useState([]);
  const Navigate=useNavigate();

  useEffect(()=>{
    fetch("http://localhost:3000/categories")
      .then((res)=>res.json())
      .then((data)=>setCategory(data))
  },[])

  console.log("categories",category)
  const getProductByCategoryId=(categoryId)=>{
    if(categoryId===8)
      Navigate("/products")
    else
      Navigate(`/products?categoryId=${categoryId}`)
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-2" >

      {
        category.map((cat)=>
        
          <button className="flex justify-center flex-col cursor-pointer items-center "  key={cat.id}
            onClick={()=>getProductByCategoryId(cat.id)} >
            <img className="h-[300px] w-[250px]"  src={cat.img} alt="" />
            <h1>{cat.name}</h1>
          </button>

        )
       }
      


    </div>
  )
}