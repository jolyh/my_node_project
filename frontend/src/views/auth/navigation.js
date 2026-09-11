
import router from '@/router/router.js';

const authNavigation = {
    goToLogin: () => router.push("/login"),
    goToLogout: () => router.push("/logout"),
    goToSignup: () => router.push("/signup"),
}

export default authNavigation