import * as Yup from 'yup'

const LoginSchema=Yup.object({
    tel:Yup
    .string()
    .max(11,'شماره موبایل باید 11 رقم باشد')
    .min(11,'شماره موبایل باید 11 رقم باشد')
    .matches(/^09\d{9}$/, 'شماره موبایل معتبر نیست (باید با 09 شروع شود و 11 رقم باشد)'),
    password: Yup
    .string()
    .min(6, "حداقل ۶ کاراکتر")
    .required("پسورد الزامی است")


})
export default LoginSchema