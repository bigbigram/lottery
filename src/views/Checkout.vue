<template>
  <div class="checkout">
    <div class="checkout-container">
      <!-- Left Column - Selected Numbers -->
      <div class="selected-numbers-section">
        <h3>Your Total Lottery</h3>
        <div class="numbers-grid">
          <div v-for="item in store.cartItems" :key="item.lottery_no" class="number-item">
            <div class="lottery-details">
              <span class="lottery-number">{{ item.lottery_no }}</span>
              <span class="lottery-type">{{ item.lottery_type }}</span>
              <span class="draw-date">Draw: {{ new Date(item.draw_date).toLocaleDateString() }}</span>
            </div>
            <button class="remove-btn" @click="removeItem(item)">×</button>
          </div>
        </div>
        <div class="total-amount">
          Total Amount: Nu. {{ totalAmount }}
        </div>
      </div>

      <!-- Right Column - Checkout Form -->
      <div class="checkout-form-section">
        <h3>Checkout Details</h3>
        <form @submit.prevent="handleSubmit" class="checkout-form">
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              required 
              autocomplete="off"
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <div class="phone-input">
              <span class="country-code">+975</span>
              <input 
                type="tel" 
                id="phone" 
                v-model="formData.phone"
                pattern="[0-9]{8}"
                required 
                autocomplete="off"
                placeholder="Enter 8 digit number"
                @input="validatePhone"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPhone">Confirm Phone Number *</label>
            <div class="phone-input">
              <span class="country-code">+975</span>
              <input 
                type="tel" 
                id="confirmPhone" 
                v-model="formData.confirmPhone"
                pattern="[0-9]{8}"
                required 
                autocomplete="off"
                placeholder="Re-enter phone number"
                @input="validatePhone"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="referralCode">Referral Code (Optional)</label>
            <input 
              type="text" 
              id="referralCode" 
              v-model="formData.referralCode"
              autocomplete="off"
              placeholder="Enter referral code if you have one"
              @input="validateReferralCode"
            />
            <p class="referral-message" :class="{ 'valid': isValidReferral, 'invalid': referralMessage.includes('Invalid') }">
              {{ referralMessage }}
            </p>
          </div>
          <p class="error-message" v-if="phoneError">{{ phoneError }}</p>

          <button 
            type="submit" 
            class="pay-button"
            :disabled="!isFormValid"
          >
            Pay Now Nu. {{ totalAmount }}
          </button>
        </form>
      </div>
    </div>
    <div class="more-lottery-section">
      <button @click="goToHome" class="more-lottery-btn">
        <i class="fas fa-ticket-alt"></i>
        Browse More Lottery
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useLotteryStore } from '../store/lotteryStore';
import { useRouter } from 'vue-router';

export default {
  name: 'Checkout',
  setup() {
    const router = useRouter();
    const store = useLotteryStore();
    let refreshInterval;
    const phoneError = ref('');
    const referralMessage = ref('');
    const isValidReferral = ref(false);
    const formData = ref({
      name: '',
      phone: '',
      confirmPhone: '',
      referralCode: ''
    });

    const totalAmount = computed(() => 
      store.cartItems.reduce((sum, item) => sum + parseInt(item.amount), 0)
    );

    const isFormValid = computed(() => {
      return formData.value.name && 
             formData.value.phone && 
             formData.value.confirmPhone && 
             formData.value.phone === formData.value.confirmPhone &&
             !phoneError.value;
    });

    const validatePhone = () => {
      const phone = formData.value.phone;
      const confirmPhone = formData.value.confirmPhone;
      
      if (phone && confirmPhone && phone !== confirmPhone) {
        phoneError.value = 'Phone numbers do not match';
      } else if (phone && !/^[0-9]{8}$/.test(phone)) {
        phoneError.value = 'Phone number must be 8 digits';
      } else {
        phoneError.value = '';
      }
    };

    const validateReferralCode = async () => {
      const code = formData.value.referralCode.trim();
      if (!code) {
        referralMessage.value = '';
        isValidReferral.value = false;
        return;
      }

      try {
        // Here you would typically make an API call to validate the referral code
        // For now, we'll simulate a check for demonstration
        if (code.length === 6 && /^[A-Z0-9]+$/.test(code)) {
          referralMessage.value = 'Valid referral code!';
          isValidReferral.value = true;
        } else {
          referralMessage.value = 'Invalid referral code format';
          isValidReferral.value = false;
        }
      } catch (error) {
        referralMessage.value = 'Error validating referral code';
        isValidReferral.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        const orderData = {
          amount: totalAmount.value,
          currency: 'Nu.',
          receipt: `receipt_${Date.now()}`,
          ...formData.value,
          tickets: store.cartItems
        };

        // Here you can implement your custom order processing logic
        console.log('Order submitted:', orderData);
        alert('Order placed successfully!');
        store.clearCart();
        router.push('/');
      } catch (error) {
        console.error('Order failed:', error);
        alert('Order failed. Please try again.');
      }
    };

    const goBack = () => {
      router.push('/');
    };

    const removeItem = (item) => {
      store.removeFromCart(item);
      if (store.cartItems.length === 0) {
        router.push('/');
      }
    };

    const goToHome = () => {
      router.push('/');
    };

    onMounted(() => {
      // Set up polling to check lottery availability
      refreshInterval = setInterval(() => {
        store.refreshLotteryList();
        // Redirect to home if cart becomes empty
        if (store.cartItems.length === 0) {
          router.push('/');
        }
      }, 2000);
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      store,
      formData,
      totalAmount,
      handleSubmit,
      goBack,
      removeItem,
      phoneError,
      validatePhone,
      isFormValid,
      referralMessage,
      isValidReferral,
      validateReferralCode,
      goToHome
    };
  }
};
</script>

<style scoped>
.checkout {
  padding: 20px 15px;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 0 15px;
}

.selected-numbers-section,
.checkout-form-section {
  padding: 15px;
  border-radius: 8px;
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 15px 0;
}

.number-item {
  font-size: 0.85rem;
  padding: 10px 6px;
}

/* Desktop styles */
@media (min-width: 769px) {
  .checkout {
    padding: 40px 20px;
  }

  .checkout-container {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 30px;
  }

  .selected-numbers-section,
  .checkout-form-section {
    padding: 25px;
    border-radius: 12px;
  }

  .numbers-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .number-item {
    font-size: 0.95rem;
    padding: 12px 10px;
  }
}

.number-item {
  background: linear-gradient(135deg, #0066cc, #0052a3);
  color: white;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  position: relative;
}

.lottery-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lottery-type {
  font-size: 0.8rem;
  opacity: 0.9;
}

.draw-date {
  font-size: 0.75rem;
  opacity: 0.8;
}

.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #dc3545;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.total-amount {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 1.2rem;
  font-weight: bold;
  color: #0066cc;
}

.checkout-form-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 12px; /* Reduced from 15px */
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 8px 12px; /* Reduced padding */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

textarea {
  height: 100px;
  resize: vertical;
}

.pay-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
}

.pay-button:hover {
  background: #218838;
}

.pay-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .checkout-container {
    grid-template-columns: 1fr;
    padding: 0 10px;
  }

  .numbers-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .number-item {
    font-size: 0.85rem;
    padding: 10px 6px;
  }

  .number-item .lottery-type {
    font-size: 0.7rem;
  }
}

.selected-numbers-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 15px 0;
}

.number-item {
  position: relative;
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  color: white;
  padding: 12px 8px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.number-item .lottery-number {
  font-size: 1rem;
  font-weight: 600;
}

.number-item .lottery-type {
  font-size: 0.7rem;
  opacity: 0.9;
}

.number-item .lottery-amount {
  font-size: 0.75rem;
  color: #a8ff78;
}

.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: white;
  border: none;
  color: #dc3545;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
  background: #dc3545;
  color: white;
}

@media (min-width: 769px) {
  .selected-numbers-section {
    padding: 25px;
    position: sticky;
    top: 90px;
  }

  .numbers-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  max-width: 100%;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
  max-height: 150px;
}

.pay-button {
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .checkout-container {
    padding: 0;
    width: 100%;
  }

  .selected-numbers-section,
  .checkout-form-section {
    border-radius: 0;
    padding: 15px 10px;
  }

  .numbers-grid {
    padding: 0 5px;
  }
}

.phone-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.country-code {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  color: #333;
  font-size: 0.95rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
}

.referral-message {
  font-size: 0.85rem;
  margin-top: 5px;
}

.referral-message.valid {
  color: #28a745;
}

.referral-message.invalid {
  color: #dc3545;
}

.more-lottery-section {
  margin: 30px 0;
  text-align: center;
}

.more-lottery-btn {
  background: linear-gradient(135deg, #0066cc, #0052a3);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 102, 204, 0.2);
}

.more-lottery-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.3);
  background: linear-gradient(135deg, #0052a3, #003d7a);
}

.more-lottery-btn i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.more-lottery-btn:hover i.fa-arrow-right {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .more-lottery-btn {
    width: 90%;
    max-width: 300px;
    justify-content: center;
    padding: 10px 20px;
    font-size: 0.95rem;
  }
}
</style>