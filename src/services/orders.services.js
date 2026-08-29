import {useQuery,useMutation} from '@tanstack/react-query'
import {BASE_URL} from "../config.js"

export const useGetAllOrders=()=>{
    return useQuery({
        queryKey:['orders'],
        queryFn: async ()=>{
            const res=await fetch(`${BASE_URL}/orders`,{
                method:'GET'
            });
            if(!res.ok)
                throw new Error('Failed Get All Customers')
            return res.json()

        }
    })
}