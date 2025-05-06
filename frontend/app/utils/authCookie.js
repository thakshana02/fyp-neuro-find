import Cookies from 'js-cookie';

// Set auth cookie when user logs in
export const setAuthCookie = (user) => {
  if (user) {
    // Set a cookie that expires in 7 days
    Cookies.set('firebaseAuth', 'true', { expires: 7 });
  } else {
    // Remove the cookie when user logs out
    Cookies.remove('firebaseAuth');
  }
};