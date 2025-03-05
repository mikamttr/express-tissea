<template>
    <div class="container">
        <div>
            <h2 class="mb-1">Login</h2>
            <form class="form" @submit.prevent="handleLogin">
                <input class="form-input" v-model="email" type="email" placeholder="Email" required />
                <input class="form-input" v-model="password" type="password" placeholder="Password" required />
                <button class="button-primary" type="submit">Login</button>
            </form>
            <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
        </div>
    </div>
</template>

<script>
import { login } from '@/services/authService';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
    setup() {
        const email = ref('');
        const password = ref('');
        const router = useRouter();

        const handleLogin = async () => {
            try {
                await login(email.value, password.value);
                router.push('/');
            } catch (error) {
                alert(error.response?.data?.message || 'Login failed');
            }
        };

        return { email, password, handleLogin };
    }
};
</script>