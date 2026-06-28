import * as Yup from 'yup'

const LoginSchema=Yup.object({
    name:Yup
    .string()
    .min(3,'نام باید بیشتر از 3 کاراکتر باشد')
    .required('نام الزامی است'),
    email: Yup
    .string()
    .email("ایمیل معتبر نیست")
    .required("ایمیل الزامی است"),
    tel: Yup.string()
    .required("شماره موبایل الزامی است")
    .matches(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
    password: Yup
    .string()
    .min(6, "حداقل ۶ کاراکتر")
    .required("پسورد الزامی است")


})
export default LoginSchema