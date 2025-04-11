<template>
  <div class="about-container">
    <div class="about-header">
      <h1>About Bhutan Lottery</h1>
      <p class="subtitle">Your Trusted Online Lottery Platform</p>
    </div>

    <div class="content-section">
      <div class="info-card">
        <i class="fas fa-shield-alt icon"></i>
        <h2>Secure & Trusted</h2>
        <p>Licensed and regulated platform ensuring safe transactions and fair gameplay.</p>
      </div>

      <div class="info-card">
        <i class="fas fa-bolt icon"></i>
        <h2>Instant Results</h2>
        <p>Get real-time draw results and instant winning notifications.</p>
      </div>

      <div class="info-card">
        <i class="fas fa-clock icon"></i>
        <h2>24/7 Service</h2>
        <p>Round-the-clock customer support and lottery ticket purchases.</p>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-item">
        <span class="stat-number">5000+</span>
        <span class="stat-label">Happy Players</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">100%</span>
        <span class="stat-label">Secure Payments</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">24/7</span>
        <span class="stat-label">Support</span>
      </div>
    </div>

    <div class="contact-section">
      <h2>Contact Us</h2>
      <div class="contact-info">
        <p><i class="fas fa-envelope"></i> indoagent2022@gmail.com</p>
        <p><i class="fas fa-phone"></i> +975-17919999</p>
        <p><i class="fas fa-map-marker-alt"></i> Thimphu, Bhutan</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  mounted() {
    window.scrollTo(0, 0);
  }
}
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

.about-header {
  text-align: center;
  padding: 40px 0;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  border-radius: 12px;
  margin-bottom: 40px;
}

.about-header h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 600;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-top: 10px;
}

.content-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.info-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 2.5rem;
  color: #1976d2;
  margin-bottom: 15px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 40px 0;
  text-align: center;
}

.stat-item {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa, #e4e8eb);
  border-radius: 12px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #1976d2;
}

.stat-label {
  font-size: 1rem;
  color: #666;
}

.contact-section {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: 20px auto;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  font-size: 1.1rem;
}

.contact-info i {
  color: #1976d2;
}

@media (max-width: 768px) {
  .about-header {
    padding: 30px 15px;
  }

  .about-header h1 {
    font-size: 2rem;
  }

  .content-section {
    grid-template-columns: 1fr;
  }

  .info-card {
    padding: 20px;
  }

  .contact-section {
    padding: 20px;
  }
}
</style>
