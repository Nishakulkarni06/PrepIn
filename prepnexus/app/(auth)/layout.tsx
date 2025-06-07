import {ReactNode}from "react";

const AuthLayout = ({children}:{children:ReactNode})=>{
   const isUserAuthenticated = await isAuthenticated();
if (!isUserAuthenticated) redirect('/sign-in');
return(
  <div className="auth-layout">{children}</div>
)
}

export default AuthLayout; 
