<!-- filepath: d:\xamp\htdocs\lottery\src\App.vue -->
<template>
  <div id="app">
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <img src="@/assets/companylogo.png" alt="Bhutan Lottery">
        </router-link>
        
        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <router-link to="/" class="nav-link">
            <i class="fas fa-home"></i> Home
          </router-link>
          <router-link to="/results" class="nav-link">
            <i class="fas fa-trophy"></i> Results
          </router-link>
          <router-link to="/lotto" class="nav-link">
            <i class="fas fa-ticket-alt"></i> Lotto
          </router-link>
          <router-link to="/about" class="nav-link">
            <i class="fas fa-info-circle"></i> About
          </router-link>
          <router-link to="/contact" class="nav-link">
            <i class="fas fa-envelope"></i> Contact
          </router-link>
        </nav>
      </div>
    </header>
    <div class="app-wrapper">
      <router-view></router-view>
      <footer-nav></footer-nav>
    </div>
    <footer>
      <p class="desktop-footer">
        &copy; 2025 Indo Lottery. All rights reserved. 
        <router-link to="/terms-and-conditions">Terms & Conditions</router-link> | 
        <router-link to="/privacy-policy">Privacy Policy</router-link>
        <router-link to="/cancellation">Cancellation</router-link>
      </p>
      
      <!-- Mobile Bottom Navigation -->
      <nav class="mobile-nav">
        <router-link to="/" class="nav-item">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/results" class="nav-item">
          <i class="fas fa-trophy"></i>
          <span>Results</span>
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
      </nav>
    </footer>
  </div>
</template>

<script>
import FooterNav from './components/FooterNav.vue'
import companyLogo from './assets/companylogo.png'

export default {
  name: 'App',
  components: {
    FooterNav
  }
}
</script>

<style scoped>
/* Header Styles */
.header {
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  height: 35px;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #1976d2;
}

@media (max-width: 768px) {
  .header {
    padding: 10px 15px;
    height: 60px;
  }

  .header-content {
    justify-content: center;
    padding: 0.5rem;
  }

  .logo img {
    height: 35px;
  }

  .nav-menu {
    display: none; /* Hide top navigation on mobile */
  }
}

/* Adjust main content to accommodate top header */
#app {
  padding-top: 70px; /* Reduced from 90px to match new header height */
  padding-left: 0;
  padding-bottom: 60px; /* Add padding for footer */
}

/* Add padding to main content to prevent header overlap */
main {
  padding-top: 65px; /* Adjust based on your header height */
}

@media (max-width: 768px) {
  main {
    padding-top: 60px; /* Slightly smaller padding for mobile */
  }

  .nav-menu {
    padding-top: 80px; /* Adjust mobile menu padding to account for fixed header */
    top: 0;
    position: fixed;
    height: 100%;
  }
}

/* Footer Styles */
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  color: white;
  padding: 10px;
  text-align: center;
  z-index: 999;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.nav-item.router-link-active {
  color: white;
}

/* Mobile View Styles */
@media (max-width: 600px) {
  .header {
    padding: 10px 15px;
    height: 60px;
  }

  .header .logo {
    width: auto;
    padding: 10px 0;
    border-bottom: none;
  }

  .header .logo-image {
    height: 30px;
  }

  .header .nav-menu {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 5px;
    background-color: #0066cc;
    padding: 10px;
    display: none;
  }

  .header .nav-menu.show {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }

  .header .nav-menu a {
    text-align: center;
    padding: 15px;
    margin: 2px 0;
  }

  .header .nav-menu a:hover {
    transform: none;
    background-color: rgba(255, 255, 255, 0.2);
  }

  .desktop-footer {
    display: none;
  }

  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98));
    backdrop-filter: blur(10px);
    padding: 12px 10px;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 2px; /* Reduced padding to fit 5 items */
    color: #666;
    text-decoration: none;
    font-size: 0.7rem; /* Slightly smaller font */
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
  }

  .nav-item i {
    font-size: 1.1rem; /* Slightly smaller font */
    margin-bottom: 3px;
    background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.7;
    transition: all 0.3s ease;
  }

  .nav-item span {
    color: #666;
    transition: color 0.3s ease;
  }

  .nav-item.router-link-active {
    color: #1a1a4e;
  }

  .nav-item.router-link-active i {
    opacity: 1;
    transform: translateY(-2px);
  }

  .nav-item.router-link-active span {
    color: #1a1a4e;
    font-weight: 600;
  }

  .nav-item::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 100%;
    height: 3px;
    background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
    transition: transform 0.3s ease;
  }

  .nav-item.router-link-active::after {
    transform: translateX(-50%) scaleX(0.4);
  }

  /* Adjust main content padding for mobile */
  #app {
    padding-bottom: 70px;
  }

  /* Hide mobile menu button and top navigation */
  .header .menu-button,
  .header .nav-menu {
    display: none;
  }

  footer {
    left: 0; /* Reset left position for mobile */
  }
}

/* Page Loading Styles */
.page-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.view-wrapper {
  width: 100%;
  min-height: calc(100vh - 130px);
}

.desktop-footer a {
  color: white;
  text-decoration: none;
  padding: 0 10px;
  opacity: 0.8;
  font-size: 0.9rem;
}

.desktop-footer a:hover {
  opacity: 1;
  text-decoration: underline;
}

/* Desktop Navigation Styles */
.desktop-nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.desktop-nav .nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: all 0.3s ease;
  opacity: 0.9;
}

.desktop-nav .nav-link:hover,
.desktop-nav .nav-link.router-link-active {
  color: white;
  opacity: 1;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer-desktop {
  margin-top: auto;
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .footer-desktop {
    position: fixed;
  }
}
</style>