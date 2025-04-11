<template>
  <nav class="footer-nav">
    <router-link to="/" class="nav-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </router-link>
    <router-link to="/lotto" class="nav-item">
      <i class="fas fa-ticket-alt"></i>
      <span>Lotto</span>
    </router-link>
    <router-link to="/about" class="nav-item">
      <i class="fas fa-info-circle"></i>
      <span>About</span>
    </router-link>
    <router-link to="/contact" class="nav-item">
      <i class="fas fa-envelope"></i>
      <span>Contact</span>
    </router-link>
    <router-link to="/results" class="nav-item">
      <i class="fas fa-list"></i>
      <span>Results</span>
    </router-link>
    <router-link to="/cancellation" class="nav-item">
      <i class="fas fa-times"></i>
      <span>Cancel</span>
    </router-link>
    <router-link to="/checkout" class="nav-item">
      <i class="fas fa-shopping-cart"></i>
      <span>Checkout</span>
    </router-link>
  </nav>
</template>

<style scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 0.8rem;
}

.nav-item i {
  font-size: 1.4rem;
  margin-bottom: 4px;
  color: #666;
}

.nav-item.router-link-active {
  color: #1976d2;
}

.nav-item.router-link-active i {
  color: #1976d2;
}
</style>
