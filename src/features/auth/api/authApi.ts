import { instance } from "@/common/instance"
import { LoginInputs } from "@/features/auth/lib/schemas"

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post("/login", payload)
  }
}