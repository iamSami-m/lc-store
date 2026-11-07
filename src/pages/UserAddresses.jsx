import React, { useEffect, useState } from 'react'
import { MapPinCheckInside,Trash2,Pencil,Plus, Server } from 'lucide-react';
import {useAddresses,useCreateAddress,useDeleteAddress,useUpdateAddress} from '../services/address.services'
import AddressSchema from '../schemas/AddressSchema'
import {BASE_URL} from "../config.js"

const UserAddresses = () => {
  const {id}=JSON.parse(localStorage.getItem("user"))
  
  const [isNewOpen,setIsNewOpen]=useState(false)
  const [isEditOpen,setIsEditOpen]=useState(false)
  const [errors,setErrors]=useState({})
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
    console.log("وضعیت mutation",{
      isPending: CreateAddress.isPending,
      isSuccess: CreateAddress.isSuccess,
      isError:CreateAddress.isError,
      error:CreateAddress.error
    })
  },[
    CreateAddress.isPending,
    CreateAddress.isSuccess,
    CreateAddress.isError,
    CreateAddress.error,
  ])
  
  useEffect(()=>{
    fetch(`${BASE_URL}/provinces`)
    .then(res=>res.json())
    .then(data=>setAllProvinces(data))
  },[])

  
  const handleProvinceChange=async (e)=>{
    const provinceId=e.target.value
    setNewProvince(provinceId)

    const data=await fetch(`${BASE_URL}/provinces/${provinceId}`)
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
    try{
      const validatedData=await AddressSchema.validate(addressData,{abortEarly:false})
      setErrors({})
      if(edittingAddress)
      {
        UpdateAddress.mutate({
          id: edittingAddress.id,
          newAddress: validatedData

        },
        {
          onSuccess: ()=> {
            setErrors({})
            setIsNewOpen(false)
          }
        })
      }
      else{
        CreateAddress.mutate(validatedData,{
          onSuccess: ()=> {
            setNewProvince(""),
            setNewCounty("")
            setPostalCode("")
          setNewExplanation("")
          setErrors({})
          setIsNewOpen(false)
          },
          onError: (error)=>{
            console.log("خطای mutation",error)
          }
      })
      }
        
    }catch(error){
      
      console.log("ذخیره  نا موفق شد")
      if (error.name === "ValidationError") {
      const newErrors={};

      error.inner.forEach((item)=>{
        if(item.path){
          newErrors[item.path]=item.message;

        }
      });
      setErrors(newErrors)
  }
  }
  
  }

  const handleDeleteAddress=async (id)=>{
    try {
      await DeleteAddress.mutate(id);
    } catch (error) {
      console.error(error);
    }
  }

  const handleEditAddress = async (address) => {
  setEdittingAddress(address);

  setNewProvince(address.provinceId);
  setNewCounty(address.countyId);
  setNewExplanation(address.explanation);
  setPostalCode(address.postalCode);

  const data = await fetch(
    `${BASE_URL}/provinces/${address.provinceId}`
  ).then(res => res.json());
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
                {errors.provinceId && (
                  <p className='text-red-500 rext-sm'>
                    {errors.provinceId}
                  </p>
                )}
                {/*Counties*/}
                <select
                name='countyId'
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
                {errors.countyId && (
                  <p className='text-red-500 rext-sm'>
                    {errors.countyId}
                  </p>
                )}
                <textarea 
                  type="text"
                  name="explanation" 
                  value={newExplanation} 
                  onChange={(e)=>setNewExplanation(e.target.value)} 
                  placeholder="آدرس دقیق خود را وارد کنید"
                  className='bg-white w-full border-2'
                  rows={5}>
              
                </textarea>
                {errors.explanation && (
                  <p className='text-red-500 rext-sm'>
                    {errors.explanation}
                  </p>
                )}
                <input 
                name='postalCode'
                  type="text" 
                  value={postalCode}
                  placeholder='کد پستی خود را وارد کنید'
                  onChange={(e)=>setPostalCode(e.target.value)}
                  className='border-2'/>
                  {errors.postalCode && (
                  <p className='text-red-500 rext-sm'>
                    {errors.postalCode}
                  </p>
                )}
              <div className='flex gap-3'>
                <button type='submit' className='bg-green-500  py-2 px-3 text-black'>{edittingAddress?'ثبت تغییرات':'افزودن آدرس'}</button>
                <button type='button' onClick={()=>{setIsNewOpen(false); setErrors({})}} className='bg-red-500 py-2 px-3 text-black' >بستن</button>
              </div>
              
            </form>
          </div>
        )
      }
    </div>
  )
}

export default UserAddresses 