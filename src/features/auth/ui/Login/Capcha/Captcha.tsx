import { useGetCaptchaQuery } from "@/features/auth/api/authApi.ts"

export const Captcha = () => {
  const { data } = useGetCaptchaQuery()
  //debugger
  return (
    <div>
       <img src={data?.url || ""} alt={"captcha"} />
    </div>
  )
}