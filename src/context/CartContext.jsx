import { createContext,useState,useEffect } from "react";

export const CartContext=createContext();

export default function CartProvider({children})
{
    const [cart,setCart]=useState([]);

    useEffect(()=>{
        const saved=localStorage.getItem("cart");
        if(saved) setCart(JSON.parse(saved))
    },[])

    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cart))
    },[cart])

    const addToCart=(product)=>{
        setCart((prev)=>{
            const exist=prev.find(p=>p.id===product.id)

            if(exist){
                return prev.map((p)=>p.id===product.id?{...p,qty:p.qty+1}:p)
            }
                return [...prev,{...product,qty:1}]
        })
    }

        const removeFromCart=(id)=>{
            setCart((prev) =>
                prev.map((item) =>
                    item.id === id? { ...item, qty: item.qty - 1 }: item
                )
                .filter((item) => item.qty > 0)
    );
    }

   
        

    const decreaseQty = (id) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;

                return item.qty > 1
                ? { ...item, qty: item.qty - 1 }
                : null;
            })
            .filter(item => item !== null)
        );
};
const addQty = (id) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;

                return { ...item, qty: item.qty + 1 }
                
            })
        );
};
    const clearCart=()=>setCart([])

    return (
        <CartContext.Provider value={{cart,addToCart,removeFromCart,clearCart,decreaseQty,addQty}}>
            {children}
        </CartContext.Provider>
    )
}