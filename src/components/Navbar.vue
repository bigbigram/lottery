<template>
  <nav class="navbar">
    <div class="logo" @click="goToHome">
      <!-- existing logo content -->
    </div>
    <!-- existing code -->
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push('/');
    };

    return {
      goToHome
    };
  }
}
</script>

<style scoped>
/* existing styles */
.logo {
  cursor: pointer;
  transition: opacity 0.3s;
}

.logo:hover {
  opacity: 0.8;
}
/* existing styles */
</style>