import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query'


export const useGetAllCustomers=()=>{
    const queryClient=useQueryClient();


    return useQuery({
        queryKey:['customers'],
        queryFn: async ()=>{
            const res=await fetch('http://localhost:3000/users',{
                method:'GET'
            });
            if(!res.ok)
                throw new Error('Failed Get All Customers')
            return res.json()

        }
    })
}

export const useCreateCustomer=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:async (newCustomer)=>{
            const res=await fetch("http://localhost:3000/users",
                {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({
                        ...newCustomer,
                        isDone: false,})
                }
            )
            if(!res.ok){
                throw new Error("Failed to create customer");
            }
            return res.json()
        },
        onSuccess:()=>{
            // 🔥 refresh customers list
            queryClient.invalidateQueries({queryKey:['customers']})
        },
        onError:(error)=>{
            console.log(error.message)
        }
    })
}

export const useUpdateCustomer=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:async ({id,updatedCustomer})=>{
            const res=await fetch(`http://localhost:3000/users/${id}`,
                {
                    method:'PATCH',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(updatedCustomer)
                }
            )
            if(!res.ok){
                throw new Error("Failed to create customer");
            }
            return res.json()
        },
        onSuccess:(data)=>{
            // 🔥 refresh customers list
            queryClient.invalidateQueries({queryKey:['customers']})

            const currentUser=JSON.parse(localStorage.getItem("user"))

            if(currentUser?.id===data.id){
                const updatedUser = {
                    ...currentUser,
                    ...data,
                };
        localStorage.setItem("user",JSON.stringify(updatedUser))
            }
                
            
        },
        onError:(error)=>{
            console.log(error.message)
        }
    })

}
 export  const useUpdatePassword=()=>{
        const queryClient=useQueryClient()
        return useMutation({
            mutationFn:async ({id,updatedPassword})=>{
                const res=await fetch(`http://localhost:3000/users/${id}`,{
                    method:'PATCH',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(updatedPassword)

                })
                if(!res.ok)
                {
                    throw new Error("Failed to update password");
                }
                
                return res.json()
            },
            onSuccess:(data)=>{ 
                // 🔥 refresh customers list
                queryClient.invalidateQueries({queryKey:['customers']})
                 //خطا: json را بزرگ ننوشته بودم
                const currentUser=JSON.parse(localStorage.getItem("user"))
                if (currentUser?.id === data.id) {
                    const updatedUser = {
                    ...currentUser,
                    ...data,
                    };

                    localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                    )
                    }
                    
                 alert("رمز عبور با موفقیت تغییر کرد");
            },
            onError:(error)=>{
                 if (error.name === "ValidationError") {
                    console.log(error.errors);
                }
            }
        })
    }

