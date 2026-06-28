import * as Yup from 'yup'

const UpdateUserSchema=Yup.object({
    firstName:Yup. string()
    .required('وارد کردن نام الزامی است')
    .min(3,'نام باید بیشتر از 3 کاراکتر باشد'),
    lastName:Yup. string()
    .required('وارد کردن نام الزامی است')
    .min(3,'نام خانوادگی باید بیشتر از 3 کاراکتر باشد'),
    email:Yup
    .string()
    .required('وارد کردن ایمیل اجباری است')
    .email('ایمیل معتبر نیست'),
    gender:Yup.string()
    .required("انتخاب جنسیت الزامی است")
    .oneOf(
        ["male","femaile"],
        "جنسیت معتبر نیست"
    )
})

export default UpdateUserSchema