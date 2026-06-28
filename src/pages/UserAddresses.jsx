import React, { useEffect, useState } from 'react'
import { MapPinCheckInside,Trash2,Pencil,Plus } from 'lucide-react';
import {useAddresses,useCreateAddress,useDeleteAddress,useUpdateAddress} from '../services/address.services'
import AddressSchema from '../schemas/AddressSchema'

const UserAddresses = () => {
  const {id}=JSON.parse(localStorage.getItem("user"))
  
  const [isNewOpen,setIsNewOpen]=useState(false)
  const [isEditOpen,setIsEditOpen]=useState(false)
  const [edittingAddress,setEdittingAddress]=useState(null)
  const [newProvince,setNewProvince]=useState("")
  const [newCounty,setNewCounty]=useState("")
  const [postalCode,setPostalCode] = useState("");
  const [allProvinces,setAllProvinces]=useState([])
  const [allCounties,setAllCounties]=useState([])
  const [newExplanation,setNewExplanation]=useState("")
  const { data: addresses = [], isLoading } = useAddresses(id);
  const CreateAddress=useCreateAddress()
  const DeleteAddress=useDeleteAddress()
  const UpdateAddress=useUpdateAddress()

  
  
  useEffect(()=>{
    fetch("http://localhost:3000/provinces")
    .then(res=>res.json())
    .then(data=>setAllProvinces(data))
  },[])

  
  const handleProvinceChange=async (e)=>{
    const provinceId=e.target.value
    setNewProvince(provinceId)
    console.log("newprovince:",newProvince)

    const data=await fetch(`http://localhost:3000/provinces/${provinceId}`)
    .then(res=>res.json())
    
    setAllCounties(data.counties)
  }

  const handleNewAddressSubmit=async (e)=>{
     e.preventDefault();
     const addressData = {
        userId: id,
        stateId: 1,
        provinceId: newProvince,
        countyId: newCounty,
        explanation: newExplanation,
        postalCode: postalCode,
      };
      console.log("addressdata",addressData)
    try{
      const validatedData=await AddressSchema.validate(addressData,{abortEarly:false})
      if(edittingAddress)
      {
        UpdateAddress.mutate({
          id: edittingAddress.id,
          newAddress: validatedData

        })
      }
      else
        CreateAddress.mutate(validatedData)
    }catch(error){
      if (error.name === "ValidationError") {
      console.log(error.errors);
  }
  }
  setNewCounty(""),
  setNewCounty("")
  setPostalCode("")
  setNewExplanation("")
  setEdittingAddress(null)
  setIsNewOpen(false)
  }

  const handleDeleteAddress=(id)=>{
    DeleteAddress.mutate(id)
  }

  const handleEditAddress = async (address) => {
  setEdittingAddress(address);

  setNewProvince(address.provinceId);
  setNewCounty(address.countyId);
  setNewExplanation(address.explanation);
  setPostalCode(address.postalCode);

  const data = await fetch(
    `http://localhost:3000/provinces/${address.provinceId}`
  ).then(res => res.json());
  console.log("provinceId:",address.provinceId)
  setAllCounties(data.counties);

  setIsNewOpen(true);
};
  return (
    <div className='grid grid-cols-12 gap-6 m-6 '>
      {addresses.map((address)=>
        <div key={address.id} className='col-span-12 md:col-span-6 border-2 p-3 rounded-lg'>
          <span>{address.explanation}</span>
          <div className='flex justify-baseline gap-3 my-2'>
            <MapPinCheckInside />
            <span>{address.provinceName}</span>
            <span>{address.countyName}</span>
          </div>
          <div className='flex justify-end gap-2'>
            <button className='p-1 rounded-lg border-2' onClick={()=>handleDeleteAddress(address.id)}><Trash2 className='text-red-300'/></button>
            <button className='p-1 rounded-lg border-2' onClick={()=>handleEditAddress(address)}><Pencil className='text-red-300'/></button>
            
          </div>

        </div>

      )}
      <div className='col-span-12 border-2 p-15 border-dotted flex justify-center items-center'> 
        
          <button className='flex' onClick={()=>{
              setIsNewOpen(!isNewOpen)
                setNewProvince("");
                setNewCounty("");
                setAllCounties([]);
                }}>
            <span>افزودن آدرس جدید</span>
            <Plus/>
          </button>
        
      </div>
      {
        ( isNewOpen) && (
          <div className='w-full h-screen bg-black/50 fixed inset-0 flex justify-center items-center'>
            
            <form onSubmit={handleNewAddressSubmit} className='bg-white p-6 rounded-xl flex flex-col gap-2 w-full m-5 lg:w-1/4'>
              <h2 className="text-xl font-bold">
                {edittingAddress ? "ویرایش آدرس" : "افزودن آدرس جدید"}
              </h2>
              {/* PROVINCE */}
              <select 
                name='provinceId'
                className='border-2'
                value={newProvince}
                onChange={handleProvinceChange}>
                  <option value="">انتخاب استان</option>
                  {
                    allProvinces.map((province)=>(
                      <option value={province.id}  key={province.id} >
                        {province.name}
                      </option>
                    ))
                  }
                </select>
                {/*Counties*/}
                <select
                  value={newCounty}
                  className='border-2'
                  onChange={(e)=>setNewCounty(e.target.value)}>
                  <option value="">انتخاب شهرستان</option>
                  {
                    allCounties.map((county)=>(
                      <option key={county.id} value={county.id}>
                        {county.name}
                      </option>
                    ))
                  }
                </select>
                <textarea 
                  type="text"
                  name="explanation" 
                  value={newExplanation} 
                  onChange={(e)=>setNewExplanation(e.target.value)} 
                  placeholder="آدرس دقیق خود را وارد کنید"
                  className='bg-white w-full border-2'
                  rows={5}>
              
                </textarea>
                <input 
                  type="text" 
                  value={postalCode}
                  placeholder='کد پستی خود را وارد کنید'
                  onChange={(e)=>setPostalCode(e.target.value)}
                  className='border-2'/>
              <div className='flex gap-3'>
                <button type='submit' className='bg-green-500  py-2 px-3 text-black'>{edittingAddress?'ثبت تغییرات':'افزودن آدرس'}</button>
                <button type='button' onClick={()=>setIsNewOpen(false)} className='bg-red-500 py-2 px-3 text-black' >بستن</button>
              </div>
              
            </form>
          </div>
        )
      }
    </div>
  )
}

export default UserAddresses 