import { useState,useContext } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetail'
import MainLayout from './layouts/MainLayout'
import Layout from './layouts/Layout'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import CartProvider,{CartContext} from './context/CartContext'
import UserProvider from './context/UserContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import Dashboard from './pages/Dashboard'
import Checkout from './pages/Checkout'
import OrderSummary from './pages/OrderSummary'
import OrderProvider from './context/OrderContext'
import PaymentPage from './pages/PaymentPage'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFail from './pages/PaymentFail'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import Orders from './pages/Orders'

function App() {
  const queryClient=new QueryClient()
  return (
    
    <div className='rtl'>
      
    <UserProvider>
    <QueryClientProvider client={queryClient}>
        <OrderProvider>
          <CartProvider>
              <BrowserRouter>
                <Routes>

                  {/* صفحات با Navbar و Footer */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    
                  </Route>

                  {/* صفحات بدون Navbar و Footer */}
                  <Route element={<Layout />}>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/checkout" element={<Checkout/>}/>
                    <Route path='/orders/:userid' element={<Orders/>}/>
                    <Route path='/ordersummary/:id' element={<OrderSummary/>}/>
                    <Route path='/paymentpage' element={<PaymentPage/>}/>
                    <Route path='/paymentsuccess' element={<PaymentSuccess/>}/>
                    <Route path='/paymentfail' element={<PaymentFail/>}/>
                    <Route path='/admindashboard/*' element={<ProtectedRoute role="admin">
                      <AdminDashboard/>
                      </ProtectedRoute>}/>
                    <Route path='/dashboard/*' element={<ProtectedRoute role="user">
                      <Dashboard/>
                      </ProtectedRoute>}/>
                  </Route>

                </Routes>
            </BrowserRouter>
          </CartProvider>
      
        </OrderProvider>
      </QueryClientProvider>
    </UserProvider>
      
    

      
     </div>
    
    
    
  )
}

export default App
