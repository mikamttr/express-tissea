<template>
  <div>
    <h2>Welcome to Home Page</h2>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { logout } from '@/services/authService';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const handleLogout = () => {
      logout();
      router.push('/login');
    };

    return { handleLogout };
  }
};
</script>
