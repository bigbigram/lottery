<template>
  <div class="home">
    <div class="hero-section">
      <h1>Welcome to Bhutan Lottery</h1>
      <p class="subtitle">Choose your lucky numbers and win big prizes!</p>
    </div>

    <div class="search-container">
      <select 
        v-model="selectedType" 
        class="form-select"
        @change="handleTypeChange"
      >
        <option value="">All Lottery Types</option>
        <option 
          v-for="type in uniqueLotteryTypes" 
          :key="type.iLotteryTypeId" 
          :value="type.iLotteryTypeId"
        >
          {{ type.lottery_name }}
        </option>
      </select>
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search By Lottery Number..." 
          class="form-select"
        >
      </div>
    </div>

    <div class="cart-preview" v-if="store.cartItems.length">
      <h3>Total Lottery: {{ store.cartItems.length }}</h3>
      <button @click="goToCheckout" class="checkout-btn">Proceed to Payment</button>
    </div>

    <div v-if="store.isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading lottery numbers...</p>
    </div>
    <div v-else-if="store.error" class="error">{{ store.error }}</div>
    <div v-else-if="filteredResults.length === 0 && searchQuery" class="no-results">
      This Lottery Number is not Available
    </div>
    <div v-else class="lottery-grid">
      <div 
        v-for="lottery in filteredResults" 
        :key="lottery.id" 
        class="lottery-box"
        :class="{ 'selected': isSelected(lottery) }"
        @click="toggleSelection(lottery)"
      >
        <div class="lottery-inner">
          <span class="lottery-number">{{ lottery.lottery_no }}</span>
          <div class="lottery-details">
            <span class="lottery-name">{{ lottery.lottery_name }}</span>
            <span class="lottery-price">Nu.{{ lottery.amount }}</span>
          </div>
          <span class="cart-text">{{ isSelected(lottery) ? '' : '' }}</span>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import { useLotteryStore } from "../store/lotteryStore";
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: "Home",
  setup() {
    const store = useLotteryStore();
    const router = useRouter();
    const searchQuery = ref('');
    const showToast = ref(false);
    const toastMessage = ref('');
    const toastType = ref('success');
    const selectedType = ref('');
    let refreshInterval;

    const showNotification = (message, type = 'success') => {
      toastMessage.value = message;
      toastType.value = type;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 2000);
    };

    const filteredResults = computed(() => {
      let results = selectedType.value 
        ? store.filterByType(selectedType.value)
        : store.lotteryNumbers;

      if (searchQuery.value) {
        return results.filter(lottery => 
          lottery.lottery_no.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return results;
    });

    const isSelected = (lottery) => {
      return store.cartItems.some(item => item.lottery_no === lottery.lottery_no);
    };

    const totalAmount = computed(() => {
      return store.cartItems.reduce((sum, item) => sum + parseInt(item.amount), 0);
    });

    const toggleSelection = (lottery) => {
      if (isSelected(lottery)) {
        store.removeFromCart(lottery);
        showNotification('Lottery removed from cart', 'error');
      } else {
        store.addToCart(lottery);
        showNotification(`Lottery added to cart - Nu.${lottery.amount}`);
      }
    };

    const goToCheckout = () => {
      router.push('/checkout');
    };

    const uniqueLotteryTypes = computed(() => {
      const types = store.lotteryNumbers.reduce((acc, curr) => {
        if (!acc.some(type => type.iLotteryTypeId === curr.iLotteryTypeId)) {
          acc.push({
            iLotteryTypeId: curr.iLotteryTypeId,
            lottery_name: curr.lottery_name
          });
        }
        return acc;
      }, []);
      return types;
    });

    const handleTypeChange = async () => {
      searchQuery.value = ''; // Clear search query when type changes
      await store.fetchLotteryByType(selectedType.value);
    };

    onMounted(async () => {
      store.loadCartFromSession(); // Load cart from session first
      await store.fetchLotteryByType();
      
      // Set up polling every 3 seconds
      refreshInterval = setInterval(() => {
        store.refreshLotteryList();
      }, 2000);
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      store,
      searchQuery,
      filteredResults,
      isSelected,
      toggleSelection,
      goToCheckout,
      showToast,
      toastMessage,
      toastType,
      selectedType,
      uniqueLotteryTypes,
      handleTypeChange
    };
  }
};
</script>

<style scoped>
.home {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
  padding-bottom: 80px;
}

.hero-section {
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  padding: 40px 20px;
  text-align: center;
  color: white;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero-section h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-top: 10px;
}

.search-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
  max-width: 600px;
  margin: -50px auto 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;
}

.lottery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.lottery-box {
  background: white;
  border-radius: 12px;
  padding: 15px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 102, 204, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.lottery-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 102, 204, 0.15);
}

.lottery-box.selected {
  background: linear-gradient(145deg, #e3efff, #d4e6ff);
  border-color: #0066cc;
}

.lottery-number {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a4e;
  text-align: center;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lottery-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.lottery-name {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.lottery-price {
  font-size: 0.9rem;
  color: #28a745;
  font-weight: 600;
  background: rgba(40, 167, 69, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.cart-preview {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  color: rgb(116, 3, 3);
  padding: 15px 25px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1000;
}

.checkout-btn {
  background: white;
  color: #1a1a4e;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 30px 15px;
  }

  .hero-section h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .search-container {
    margin: -30px 15px 20px;
    padding: 15px;
  }

  .lottery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .lottery-number {
    font-size: 1.2rem;
  }
}

/* Base styles */
.home {
  text-align: center;
  margin-top: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  color: #850808;
  padding-bottom: 80px;
}

.lottery-grid {
  margin: 15px auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  max-width: 1200px;
  padding: 15px;
}

.lottery-box {
  position: relative;
  height: auto;
  min-height: 85px;
  background: linear-gradient(145deg, #ffe7b9, #ffd8c2);
  border: 1px solid rgba(0, 102, 204, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lottery-number {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a5f7a;
  text-align: center;
}

.lottery-details {
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 0 4px;
}

.lottery-name {
  font-size: 0.7rem;
  color: #666;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 4px;
}

.lottery-price {
  font-size: 0.75rem;
  color: #28a745;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
}

.cart-preview {
  position: fixed;
  bottom: 70px;
  left: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.checkout-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-container {
  margin: 20px auto;
  max-width: 600px;
  padding: 0 15px;
}

/* Animation for ripple effect */
@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.lottery-box:active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.6s linear;
}

@media (max-width: 768px) {
  .lottery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .lottery-box {
    min-height: 75px;
  }

  .cart-preview {
    bottom: 80px;
    width: 80%;
    max-width: 300px;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (min-width: 769px) {
  .lottery-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .lottery-box {
    min-height: 85px;
  }

  .cart-preview {
    left: auto;
    right: 20px;
    width: auto;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.lottery-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  animation: pulse 1s infinite;
}

.lottery-box.selected {
  background: linear-gradient(145deg, #e3efff, #d4e6ff);
  animation: none;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
  font-size: 1.2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #14c204;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 20px auto;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.cart-preview {
  position: fixed;
  bottom: 70px;
  left: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.checkout-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background: #1e7e34;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px auto;
  width: 100%;
  max-width: 280px;
  padding: 0 15px;
  box-sizing: border-box;
}

.form-select {
  width: 100%;
  height: 45px;
  padding: 10px 15px;
  line-height: 25px;
  box-sizing: border-box;
  appearance: none;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 102, 204, 0.2);
  border-radius: 25px;
  color: #1a1a4e;
  font-size: 0.95rem;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231a1a4e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
  padding-right: 40px;
  transition: all 0.3s ease;
}

.form-select:hover {
  border-color: rgba(0, 102, 204, 0.4);
  background-color: #ffffff;
}

.form-select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 2px 12px rgba(0, 102, 204, 0.1);
  background-color: #ffffff;
}

.form-select option {
  background: white;
  color: #1a1a4e;
  padding: 10px;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #1a1a4e;
  opacity: 0.5;
  font-size: 1rem;
}

.search-box input {
  padding-left: 40px;
}

.search-box input.form-select {
  height: 45px;
  padding: 10px 15px 10px 40px;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 12px;
  margin: 20px auto;
  max-width: 400px;
  font-weight: 500;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: linear-gradient(135deg, #28a745, #208838);
}

.toast.error {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

@keyframes slideIn {
  from {
    top: -50px;
    opacity: 0;
  }
  to {
    top: 20px;
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    gap: 10px;
    width: calc(100% - 40px);
    max-width: 280px;
    margin: 15px auto;
  }
  
  .form-select,
  .search-box input.form-select {
    height: 42px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .form-select {
    height: 40px;
    font-size: 0.9rem;
  }

  .search-box input.form-select {
    padding-left: 35px;
  }

  .search-icon {
    left: 12px;
    font-size: 0.9rem;
  }
  
  .lottery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .lottery-box {
    min-height: 75px; /* Reduced from 90px */
  }

  .lottery-number {
    font-size: 0.95rem;
  }

  .lottery-name {
    font-size: 0.65rem;
  }

  .lottery-price {
    font-size: 0.7rem;
  }

  .lottery-details {
    padding: 0 2px;
    gap: 2px;
  }
  
  .lottery-name {
    font-size: 0.65rem;
  }
  
  .lottery-price {
    font-size: 0.7rem;
  }

  .toast {
    width: 80%;
    font-size: 0.9rem;
  }

  .cart-preview {
    bottom: 80px; /* Increased from 20px to avoid footer overlap */
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 300px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .cart-preview h3 {
    font-size: 0.9rem;
    margin: 0;
  }

  .checkout-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}

/* Desktop styles */
@media (min-width: 769px) {
  .lottery-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    padding: 15px;
    max-width: 1200px;
  }

  .lottery-box {
    height: auto;
    min-height: 85px; /* Reduced from 100px */
  }

  .cart-preview {
    left: auto;
    right: 20px;
    width: auto;
  }

  .search-container {
    flex-direction: row;
    max-width: 600px;
    align-items: center;
  }

  select.form-select {
    width: 200px;
    flex-shrink: 0;
  }

  .search-box {
    flex: 1;
  }
}
</style>