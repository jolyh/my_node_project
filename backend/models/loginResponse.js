const loginResponse = {
    success: true,
    message: "Logged in successfully",
};

const successLoginResponse = {
    ...loginResponse,
    token: "some-jwt-token",
};

const failedLoginResponse = {
    success: false,
    message: "Invalid email or password",
};

const logoutResponse = {
    message: "Logged out successfully",
};

export { loginResponse, successLoginResponse, failedLoginResponse, logoutResponse };