import api from './api';

// Step 1: Request an OTP be sent to the given email.
// NOTE: the backend returns HTTP 200 regardless of whether the email is
// registered (to avoid leaking account existence via status code). Don't
// branch UI behavior on res.data.success for this call — see ForgotPassword.jsx.
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
        confirmPassword,
    });
};