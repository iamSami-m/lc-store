import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const ProtectedRoute = ({children,role=null}) => {
  const navigate=useNavigate();
  const user=JSON.parse(localStorage.getItem("user"))
  console.log("protected route user:",user)

        if(!user)
          return <Navigate to="/auth" replace />;
        
        if(role && user?.role !== role)
          return <Navigate to="/" replace   />
        
        else
          return children
          
      
}

export default ProtectedRoute