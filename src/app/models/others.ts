export interface LoginCredential {
  // User email address already linked to an account
  email: string, 
  // Password associated to existing account
  password: string
}

export interface SigninCredential {
  // Email address provided for account creation
  signinEmail: string, 
  // Password to assign to the account for login
  signinPassword: string, 
  // Pseudo to assign on the newly created account
  signinNickName: string
}