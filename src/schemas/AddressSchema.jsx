import * as Yup from 'yup'

const AddressSchema=Yup.object({
    provinceId:Yup.string()
    .required('.انتخاب استان الزامی است'),
    countyId:Yup.string()
    .required('انتخاب شهرستان ضروری است.'),
    explanation:Yup.string()
    .required('ورود جزئیات آدرس الزامی است.')
    .min(10, "آدرس خیلی کوتاه است"),
    postalCode: Yup.string()
    .required("کد پستی الزامی است")
    .matches(/^\d{10}$/, "کد پستی باید 10 رقم باشد"),
})

 export default AddressSchema