// import api from './api';

// export const updatepassword = (email) =>{
//     api.patch(`auth/update-password/${email}`)
// }

// export const forgotpassword = (email) => {
//     api.post('auth/forgot-password',{email})
// }

// export const resetpassword = (email,password,otp) =>{
//     api.post('auth/reser-password',{email,password,otp})


import api from './api';

export const forgotPassword = (email) => {
    return api.post('auth/forgot-password', { email });
};

// Step 2: Reset password with OTP validation
export const resetPassword = (email, newPassword, otp) => {
    return api.post('auth/reset-password', { email, newPassword, otp });
};

// Step 3: Update password (when logged in)
export const updatePassword = (email, newPassword, confirmPassword) => {
    return api.patch(`auth/update-password/${email}`, { 
        newPassword, 
        confirmPassword 
    });
};