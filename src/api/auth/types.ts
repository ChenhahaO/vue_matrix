/**
 * 登录表单类型声明
 */
export interface LoginForm {
  account: string
  password: string
}

/**
 * 登录响应类型声明
 */
export interface LoginResult {
  access_token: string
  token_type: string
}

/**
 * 验证码类型声明
 */
export interface VerifyCode {
  verifyCodeImg: string
  verifyCodeKey: string
}
