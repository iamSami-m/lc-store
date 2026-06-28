import * as Yup from 'yup'

const ChangePasswordSchema=Yup.object({
    currentPassword:Yup.string()
    .required("رمز فعلی الزامی است"),

    newPassword:Yup.string()
    .min(8, "رمز جدید باید حداقل 8 کاراکتر باشد")
    .notOneOf(
        [Yup.ref("currentPassword")],
        "رمز جدید نباید با رمز فعلی یکسان باشد"
    )
    .required("رمز جدید الزامی است"),


    confirmPassword:Yup.string()
    .oneOf(
        [Yup.ref("newPassword")],
        "تکرار رمز عبور مطابقت ندارد"
    )
    .required("تکرار رمز عبور الزامی است"),
})
export default ChangePasswordSchema