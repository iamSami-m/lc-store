import {useMutation,useQueryClient, useQuery, Mutation} from '@tanstack/react-query'


export const useAddresses = (userId) => {
  return useQuery({
    queryKey: ["addresses", userId],

    queryFn: async () => {
      const addresses = await fetch(
        `http://localhost:3000/addresses?userId=${userId}`
      ).then((res) => res.json());

      const provinces = await fetch(
        "http://localhost:3000/provinces"
      ).then((res) => res.json());

      const userAddresses = addresses.map((address) => {
        const province = provinces.find(
          (province) =>
            String(province.id) === String(address.provinceId)
        );

        const county = province?.counties?.find(
          (county) =>
            String(county.id) === String(address.countyId)
        );

        return {
          ...address,
          provinceName: province?.name,
          countyName: county?.name,
        };
      });

      return userAddresses;
    },
  });
};
export const useUpdateAddress=()=>{
  const queryClient=useQueryClient();

  return useMutation({
    mutationFn:async ({id,newAddress})=>{
      const res=await fetch(`http://localhost:3000/addresses/${id}`,
        {
          method:"PATCH",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(newAddress)
        }
      )
      if(!res.ok){
        throw new Error("Failed to create customer");
      }
      return res.json()
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['addresses']})
    }
  })
}
export const useCreateAddress = () => { 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAddress) => {
      const res = await fetch(
        "http://localhost:3000/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newAddress,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create address");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },

    onError: (error) => {
      console.log(error.message);
    },
  });
};

export const useDeleteAddress=()=>{
  const queryClient =useQueryClient()

  return useMutation({
    mutationFn: async (id)=>{
      const res=await fetch(
        `http://localhost:3000/addresses/${id}`,{
          method:"DELETE",
          
        }
      )
      if(!res.ok){
         throw new Error("Failed to create address");
      }
      return res.json();
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
    onError: (error) => {
      console.log(error.message);
    },

  })
}