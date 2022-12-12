export const logout = () => {
    localStorage.removeItem('token');
  };
  
export const isLogin = () => {
return !!localStorage.getItem('token');
};
  