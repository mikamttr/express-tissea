<template>
    <div>
        <h2>Sign Up</h2>
        <form @submit.prevent="handleSignup">
            <input v-model="username" type="text" placeholder="Username" required />
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
</template>

<script>
import { signup } from '@/services/authService';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
    setup() {
        const username = ref('');
        const email = ref('');
        const password = ref('');
        const router = useRouter();

        const handleSignup = async () => {
            try {
                await signup(username.value, email.value, password.value);
                router.push('/');
            } catch (error) {
                alert(error.response?.data?.message || 'Signup failed');
            }
        };

        return { username, email, password, handleSignup };
    }
};
</script>