<template>
  <div class="customer-layout">
    <NavbarComponent :isAdmin="false" />
    
    <main class="main-content">
      <RouterView />
    </main>

    <FooterComponent />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavbarComponent from '../components/NavbarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
</script>

<style scoped>
.customer-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #121212;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
