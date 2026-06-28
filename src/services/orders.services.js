import {useQuery,useMutation} from '@tanstack/react-query'

export const useGetAllOrders=()=>{
    return useQuery({
        queryKey:['orders'],
        queryFn: async ()=>{
            const res=await fetch('http://localhost:3000/orders',{
                method:'GET'
            });
            if(!res.ok)
                throw new Error('Failed Get All Customers')
            return res.json()

        }
    })
}