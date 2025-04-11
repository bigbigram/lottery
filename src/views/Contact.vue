<template>
  <div class="contact-container">
    <div class="contact-header">
      <h1>Contact Us</h1>
      <p>We're here to help and answer any questions you might have</p>
    </div>

    <div class="contact-wrapper">
      <!-- Contact Info Cards -->
      <div class="contact-info">
        <div class="info-card">
          <i class="fas fa-map-marker-alt"></i>
          <h3>Location</h3>
          <p>Thimphu, Bhutan</p>
        </div>
        <div class="info-card">
          <i class="fas fa-phone"></i>
          <h3>Phone</h3>
          <p>+975-17919999</p>
        </div>
        <div class="info-card">
          <i class="fas fa-envelope"></i>
          <h3>Email</h3>
          <p>indoagent2022@gmail.com</p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="contact-form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Name</label>
            <input 
              type="text" 
              v-model="form.name"
              :class="{ 'error': errors.name }"
              placeholder="Your Name"
            >
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              v-model="form.email"
              :class="{ 'error': errors.email }"
              placeholder="Your Email"
            >
          </div>

          <div class="form-group">
            <label>Subject</label>
            <input 
              type="text" 
              v-model="form.subject"
              placeholder="Subject"
            >
          </div>

          <div class="form-group">
            <label>Message</label>
            <textarea 
              v-model="form.message"
              :class="{ 'error': errors.message }"
              placeholder="Your Message"
              rows="5"
            ></textarea>
          </div>

          <button type="submit" class="submit-btn">
            <i class="fas fa-paper-plane"></i>
            Send Message
          </button>
        </form>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="toast" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'Contact',
  setup() {
    const form = reactive({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    const errors = reactive({})
    const showToast = ref(false)
    const toastMessage = ref('')
    const toastType = ref('success')

    const validateForm = () => {
      errors.name = !form.name ? 'Name is required' : ''
      errors.email = !form.email ? 'Email is required' : 
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Invalid email' : ''
      errors.message = !form.message ? 'Message is required' : ''

      return !Object.values(errors).some(error => error)
    }

    const showNotification = (message, type = 'success') => {
      toastMessage.value = message
      toastType.value = type
      showToast.value = true
      setTimeout(() => showToast.value = false, 3000)
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      try {
        // Add your form submission logic here
        showNotification('Message sent successfully!')
        Object.keys(form).forEach(key => form[key] = '')
      } catch (error) {
        showNotification('Failed to send message', 'error')
      }
    }

    return {
      form,
      errors,
      showToast,
      toastMessage,
      toastType,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.contact-header {
  text-align: center;
  margin-bottom: 40px;
  color: #1976d2;
}

.contact-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card i {
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 10px;
}

.contact-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
}

.form-group .error {
  border-color: #dc3545;
}

.submit-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background: #1565c0;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 6px;
  color: white;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: #28a745;
}

.toast.error {
  background: #dc3545;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .contact-wrapper {
    grid-template-columns: 1fr;
  }

  .contact-info {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .info-card {
    flex: 1;
    min-width: 150px;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .toast {
    left: 20px;
    right: 20px;
    text-align: center;
  }
}
</style>
