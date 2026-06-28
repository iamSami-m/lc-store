import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import LoginSchema from '../schemas/LoginSchema'
import {UserContext} from './../context/UserContext'

export default function Auth() {
  const [userState, setUserState] = useState("Login")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")
  const {user,login}=useContext(UserContext)

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    tel: '',
    email: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setErrors({})

    try {
      const validatedData = await LoginSchema.validate(formData, { abortEarly: false })

      setLoading(true)

      // SIGN UP
      if (userState === "Sign Up") {

        // چک کاربر تکراری
        const check = await fetch(`http://localhost:5000/users?tel=${formData.tel}`)
        const existingUser = await check.json()

        if (existingUser.length > 0) {
          setMessage("این شماره قبلاً ثبت شده")
          setLoading(false)
          return
        }

        const res = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(validatedData)
        })

        const data = await res.json()

        setMessage("ثبت‌نام با موفقیت انجام شد ✅")
        console.log(data)

        setFormData({
          name: "",
          password: "",
          tel: '',
          email: ""
        })

        setUserState("Login")
      }

      // LOGIN
      else {
        const res = await fetch(
          `http://localhost:5000/users?tel=${formData.tel}&password=${formData.password}`
        )

        const data = await res.json()

        if (data.length > 0) {
          localStorage.setItem("user", JSON.stringify(data[0]))
          login(JSON.stringify(data[0]))
          setMessage("ورود موفق ✅")
          console.log("user =>", data[0])
        } else {
          setMessage("شماره یا رمز اشتباه است ❌")
        }
      }

    } catch (error) {
      if (error.inner) {
        const formattedErrors = {}
        error.inner.forEach(err => {
          formattedErrors[err.path] = err.message
        })
        setErrors(formattedErrors)
      }
    }

    setLoading(false)
  }

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <div className='w-100 h-auto bg-[rgba(0,0,0,0.4)] border-black border-2 rounded-2xl p-4 py-9'>

        <form onSubmit={handleSubmit}>

          {userState === "Sign Up" && (
            <>
              <input
                type='text'
                name="name"
                placeholder='نام'
                className='w-full bg-white rounded-2xl p-2'
                onChange={handleChange}
                value={formData.name}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}

              <input
                type="email"
                name="email"
                placeholder='ایمیل'
                className='w-full bg-white rounded-2xl p-2 mt-3'
                onChange={handleChange}
                value={formData.email}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </>
          )}

          <input
            type="tel"
            name="tel"
            placeholder='شماره تماس'
            className='w-full bg-white rounded-2xl p-2 mt-3'
            onChange={handleChange}
            value={formData.tel}
          />
          {errors.tel && <p className="text-red-500">{errors.tel}</p>}

          <input
            type="password"
            name="password"
            placeholder='رمز عبور'
            className='w-full bg-white rounded-2xl p-2 mt-3'
            onChange={handleChange}
            value={formData.password}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          <button
            className='w-full bg-[rgba(0,0,0,0.4)] hover:bg-white 
            border-2 border-transparent duration-300 rounded-2xl p-2 mt-3
            hover:border-black transition-all'
            type='submit'
            disabled={loading}
          >
            {loading
              ? "در حال پردازش..."
              : userState === "Login"
                ? "ورود"
                : "ایجاد اکانت جدید"}
          </button>

          {message && <p className="mt-2 text-center">{message}</p>}

          <div className='my-2'>
            <p>
              <input type="checkbox" required className='ml-2' />
              با <Link to="/Terms">شرایط و قوانین</Link> سایت موافقم.
            </p>
          </div>

          {userState === "Sign Up" ? (
            <p>
              اکانت دارم .
              <span
                onClick={() => setUserState("Login")}
                className="text-black font-bold cursor-pointer"
              >
                ورود
              </span>
            </p>
          ) : (
            <p>
              ساخت اکانت جدید؟
              <span
                onClick={() => setUserState("Sign Up")}
                className="text-black font-bold cursor-pointer"
              >
                کلیک کنید
              </span>
            </p>
          )}

        </form>
      </div>
    </div>
  )
}