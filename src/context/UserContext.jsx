import {createContext,useState} from "react"

export const UserContext=createContext()

export default function UserProvider({children}){

    const [user,setUser]=useState(()=>{
        const storedUser=localStorage.getItem("user")
        return storedUser?JSON.parse(storedUser):null
})

    const login=(user)=>{
        localStorage.setItem("user",JSON.stringify(user))
        setUser(user)
    }

    const logout=()=>{
        localStorage.removeItem("user")
        setUser(null)
    }

    
    return(
        <UserContext.Provider
            value={{
                user,
                login,
                logout
            }}
            >
                {children}
        </UserContext.Provider>
    )
}