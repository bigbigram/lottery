<template>
  <div class="lotto-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Bhutan Lotto</h1>
        <p class="subtitle">Try your luck with our daily lucky numbers</p>
        <div class="price-tag">
          <span class="amount">Nu.30 per ticket</span>
        </div>
      </div>
    </div>

    <div class="number-generator">
      <div class="card">
        <div class="card-content">
          <h2>Your Lucky Numbers</h2>
          <div class="draw-date">
            Drawing Date: {{ formatDate(drawDate) }}
          </div>
          <div class="numbers-display">
            <div class="balls-container">
              <TransitionGroup name="ball-shuffle">
                <span v-for="(number, index) in luckyNumbers" 
                      :key="number" 
                      class="number-ball"
                      :style="[ballStyles[number]]">
                  {{ number }}
                </span>
              </TransitionGroup>
            </div>
          </div>
          
          <div class="buttons-container">
            <button @click="generateNumbers" class="generate-btn">
              <i class="fas fa-sync-alt"></i>
              Generate Numbers
            </button>
            
            <button @click="addToCart" class="cart-btn" v-if="luckyNumbers.length">
              <i class="fas fa-cart-plus"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showToast" class="toast" :class="toastType">
      {{ toastMessage }}
    </div>

    <!-- Cart Preview -->
    <div class="cart-preview" v-if="store.cartItems && store.cartItems.length">
      <h3>Total Lottery: {{ store.cartItems.length }}</h3>
      <button @click="goToCheckout" class="checkout-btn">Proceed to Payment</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLotteryStore } from "../store/lotteryStore"

export default {
  name: 'Lotto',
  setup() {
    const store = useLotteryStore()
    const router = useRouter();
    const luckyNumbers = ref([])
    const showToast = ref(false)
    const toastMessage = ref('')
    const toastType = ref('success')
    const lastGeneratedDate = ref('')
    const todayNumbers = ref([])
    const drawDate = ref('')
    const ballStyles = ref({})

    const getCurrentDrawDate = () => {
      const now = new Date()
      const cutoffTime = new Date()
      cutoffTime.setHours(16, 30, 0) // 4:30 PM

      if (now > cutoffTime) {
        // After 4:30 PM, use next day
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split('T')[0]
      }
      // Before 4:30 PM, use current day
      return now.toISOString().split('T')[0]
    }

    const formatDate = (dateStr) => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString('en-US', options)
    }

    const generateNumbers = () => {
      const drawDay = getCurrentDrawDate()
      drawDate.value = drawDay
      
      // Show notification about draw date
      const isNextDay = drawDay !== new Date().toISOString().split('T')[0]
      if (isNextDay) {
        showNotification("Generating numbers for tomorrow's draw!", 'info')
      }

      const generateValidSet = () => {
        // Separate single and double digits
        const singleDigits = Array.from({ length: 9 }, (_, i) => i + 1)
        const doubleDigits = Array.from({ length: 27 }, (_, i) => i + 10)
        const numbers = []
        
        // Always generate 5 balls (removed single digit chance)
        while (numbers.length < 5) {
          const randomIndex = Math.floor(Math.random() * doubleDigits.length)
          const num = doubleDigits[randomIndex]
          
          // Check for non-consecutive numbers
          const noConsecutive = !numbers.some(n => Math.abs(n - num) === 1)
          if (noConsecutive) {
            numbers.push(num)
            doubleDigits.splice(randomIndex, 1)
          }
        }
        
        return numbers.sort((a, b) => a - b)
      }

      let sortedNumbers
      do {
        sortedNumbers = generateValidSet()
      } while (
        sortedNumbers.some((num, i) => 
          i < sortedNumbers.length - 1 && sortedNumbers[i + 1] === num + 1
        )
      )

      // Initial display with random positions
      luckyNumbers.value = [...sortedNumbers].sort(() => Math.random() - 0.5)
      
      // Set initial random positions
      luckyNumbers.value.forEach(num => {
        ballStyles.value[num] = {
          transform: `translate(${Math.random() * 300 - 150}px, ${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`,
          transition: 'none'
        }
      })

      let shuffleCount = 0
      const maxShuffles = 8
      
      const shuffle = () => {
        setTimeout(() => {
          // Randomly reorder numbers during shuffle
          luckyNumbers.value = [...luckyNumbers.value].sort(() => Math.random() - 0.5)
          
          // Generate chaotic movement with proper string termination
          luckyNumbers.value.forEach(num => {
            ballStyles.value[num] = {
              transform: `translate(${Math.random() * 300 - 150}px, ${Math.random() * 200 - 100}px) rotate(${Math.random() * 720 - 360}deg)`,
              transition: 'all 0.4s cubic-bezier(0.45, 0.05, 0.55, 0.95)'
            }
          })
          
          shuffleCount++
          
          if (shuffleCount < maxShuffles) {
            shuffle()
          } else {
            // Final alignment with proper string termination
            setTimeout(() => {
              luckyNumbers.value = [...sortedNumbers].sort((a, b) => a - b)
              const isDesktop = window.innerWidth > 768
              
              luckyNumbers.value.forEach((num, index) => {
                if (isDesktop) {
                  const spacing = 80  // Increased from 50 to add more space between balls
                  const totalWidth = (luckyNumbers.value.length - 1) * spacing
                  const startX = -totalWidth / 2
                  
                  ballStyles.value[num] = {
                    transform: 'translate(-50%, -150%)', // Move up further
                    left: `calc(50% + ${startX + (index * spacing)}px)`,
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }
                } else {
                  const spacing = 55  // Increased from 45 to add more space between balls
                  const totalWidth = (luckyNumbers.value.length - 1) * spacing
                  const startX = -totalWidth / 2
                  
                  ballStyles.value[num] = {
                    transform: 'translate(-50%, -150%)', // Move up further
                    left: `calc(50% + ${startX + (index * spacing)}px)`,
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }
                }
              })
            }, 600)
          }
        }, 300)
      }
      
      // Start shuffling after a brief delay
      setTimeout(shuffle, 100)

      todayNumbers.value = sortedNumbers
      lastGeneratedDate.value = new Date().toISOString().split('T')[0]
    }

    const countConsecutiveSingleDigits = (numbers) => {
      let consecutive = 0
      let maxConsecutive = 0
      
      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] < 10) {
          consecutive++
          maxConsecutive = Math.max(maxConsecutive, consecutive)
        } else {
          consecutive = 0
        }
      }
      return maxConsecutive
    }

    const showNotification = (message, type = 'success') => {
      toastMessage.value = message
      toastType.value = type
      showToast.value = true
      setTimeout(() => showToast.value = false, 8000)
    }

    const addToCart = () => {
      const currentTime = new Date()
      const today = currentTime.toISOString().split('T')[0]
      
      if (lastGeneratedDate.value !== today) {
        showNotification('Please generate new numbers first', 'error')
        return
      }

      // Check if numbers already exist in cart
      const currentNumbers = luckyNumbers.value.join('-')
      const exists = store.cartItems.some(item => 
        item.lottery_no === currentNumbers && 
        item.type === 'lotto'
      )

      if (exists) {
        showNotification('These numbers are already in your cart!', 'error')
        return
      }

      const lottoTicket = {
        id: `LOTTO-${Date.now()}`,
        lottery_no: currentNumbers,
        lottery_name: 'Bhutan Lotto',
        amount: '30',
        iLotteryTypeId: 'LOTTO',
        type: 'lotto',
        draw_date: drawDate.value // Use tracked draw date
      }
      
      store.addToCart(lottoTicket)
      showNotification(`Lotto numbers added for ${formatDate(drawDate.value)}!`)
    }

    const goToCheckout = () => {
      router.push('/checkout');
    }

    // Initialize with correct draw date
    drawDate.value = getCurrentDrawDate()

    // Generate initial numbers
    generateNumbers()

    return {
      store, // Make sure store is returned
      luckyNumbers,
      generateNumbers,
      addToCart,
      showToast,
      toastMessage,
      toastType,
      lastGeneratedDate,
      todayNumbers,
      goToCheckout,
      drawDate,
      formatDate,
      ballStyles
    }
  }
}
</script>

<style scoped>
.lotto-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.hero-section {
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.05)"/></svg>') repeat;
  opacity: 0.1;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: white;
  position: relative;
}

.hero-content h1 {
  font-size: 3rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 15px 0;
}

.price-tag {
  display: inline-flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 25px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  margin-top: 20px;
}

.price-tag .amount {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4CAF50;
}

.price-tag .label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-height: 400px; /* Added fixed minimum height */
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.card-content {
  position: relative;
  z-index: 1;
}

.number-generator {
  max-width: 600px;
  margin: -50px auto 30px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  min-height: 500px; /* Added fixed height */
}

.number-generator {
  max-width: 600px;
  margin: -50px auto 30px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.card h2 {
  color: #1a1a4e;
  margin: 0 0 20px;
  font-size: 1.5rem;
}

.numbers-display {
  display: flex;
  justify-content: center;
  align-items: center; /* Center vertically */
  margin: 30px 0;
  position: relative;
  height: 180px;
  flex: 1;
  isolation: isolate;
}

.number-ball {
  width: 55px;  /* Increased from 45px */
  height: 55px;
  background: linear-gradient(135deg, #eec50e 0%, #f36907 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;  /* Increased from 1.2rem */
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: popIn 0.3s ease-out;
  position: relative;
  transition: all 0.3s ease;
}

.number-ball::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 15px;
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0);
  border-radius: 50%;
}

.buttons-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 60px;  /* Increased from 30px */
  padding-bottom: 20px; /* Added padding at bottom */
}

.generate-btn {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  border: none;
  padding: 10px 20px;  /* Reduced padding */
  font-size: 1rem;    /* Smaller font */
  min-width: 160px;   /* Set minimum width */
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.cart-btn {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border: none;
  padding: 10px 20px;  /* Reduced padding */
  font-size: 1rem;    /* Smaller font */
  min-width: 160px;   /* Set minimum width */
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
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

.toast.info {
  background: linear-gradient(135deg, #1976d2, #2196f3);
}

.cart-preview {
  position: fixed;
  bottom: 80px;
  right: 20px;
  left: auto;
  transform: none;
  max-width: 300px;
  background: linear-gradient(145deg, #51a7fc, #9ef6b2);
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
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  background: #1e7e34;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

@keyframes popIn {
  0% { transform: scale(0) rotate(0deg); }
  60% { transform: scale(1.2) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .number-ball {
    width: 50px; /* Increased from 45px */
    height: 50px;
    font-size: 1.3rem;
  }

  .card {
    padding: 20px;
    min-height: 350px; /* Slightly smaller for mobile */
  }

  .numbers-display {
    height: 160px; /* Adjusted for mobile */
  }

  .buttons-container {
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    margin-top: 40px;  /* Adjusted for mobile */
    padding-bottom: 15px;
  }

  .generate-btn, .cart-btn {
    width: auto; /* Changed from 100% */
    padding: 10px 15px;
    font-size: 0.9rem;
    min-width: auto;
  }

  .generate-btn i, .cart-btn i {
    font-size: 0.9rem;
  }

  .cart-preview {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: 80%;
    max-width: 300px;
    padding: 10px 20px;
  }

  .cart-preview h3 {
    font-size: 0.9rem;
    margin: 0;
  }

  .checkout-btn {
    padding: 6px 15px;
    font-size: 0.9rem;
  }

  .number-generator {
    min-height: 450px; /* Adjusted for mobile */
  }

  .balls-container {
    width: 240px;
    height: 60px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  .number-ball {
    width: 45px; /* Smaller balls for mobile */
    height: 45px;
    font-size: 1.2rem;
  }
  
  .balls-container {
    height: 220px; /* Increased height for two rows */
    width: 100%;
  }
  
  .numbers-display {
    height: 220px; /* Match container height */
  }
}

.draw-date {
  text-align: center;
  color: #1976d2;
  font-weight: 600;
  margin-bottom: 20px;
  padding: 8px;
  background: #f0f7ff;
  border-radius: 8px;
}

.balls-container {
  position: absolute;
  height: 80px;
  width: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: visible;
  background: rgba(0,0,0,0.02);
  border-radius: 10px;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.number-ball {
  width: 55px;  /* Increased from 45px */
  height: 55px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, left;
  z-index: 6;
}

/* Remove these conflicting styles if they exist */
/* .ball-shuffle-move {
  transition: transform 0.3s ease;
}
.shuffle-move {
  transition: transform 0.3s ease;
} */

.ball-shuffle-move {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.ball-shuffle-enter-active,
.ball-shuffle-leave-active {
  transition: all 0.3s ease;
}

.ball-shuffle-enter-from,
.ball-shuffle-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
