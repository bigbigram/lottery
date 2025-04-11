<template>
  <div class="lotto-generator">
    <div class="numbers-container">
      <div v-for="(number, index) in displayNumbers" 
           :key="index" 
           class="number-box"
           :class="{ 'animate': isAnimating }">
        {{ number }}
      </div>
    </div>
    <button @click="generateNumbers" :disabled="isAnimating">
      Generate Numbers
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayNumbers: Array(6).fill(0),
      finalNumbers: [],
      isAnimating: false
    }
  },
  methods: {
    generateNumbers() {
      this.isAnimating = true;
      let animationDuration = 2000; // 2 seconds
      
      // Start random number animation
      const animationInterval = setInterval(() => {
        this.displayNumbers = Array(6).fill(0).map(() => 
          Math.floor(Math.random() * 49) + 1
        );
      }, 100);

      // Generate final numbers
      this.finalNumbers = Array(6).fill(0)
        .map(() => Math.floor(Math.random() * 49) + 1)
        .sort((a, b) => a - b);

      // Stop animation and show final numbers with shuffle effect
      setTimeout(() => {
        clearInterval(animationInterval);
        this.shuffleToFinal();
      }, animationDuration);
    },

    shuffleToFinal() {
      let currentIndex = 0;
      const shuffleInterval = setInterval(() => {
        if (currentIndex >= this.displayNumbers.length) {
          clearInterval(shuffleInterval);
          this.isAnimating = false;
          return;
        }
        
        this.displayNumbers[currentIndex] = this.finalNumbers[currentIndex];
        currentIndex++;
      }, 200);
    }
  }
}
</script>

<style scoped>
.lotto-generator {
  text-align: center;
  padding: 20px;
}

.numbers-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.number-box {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.number-box.animate {
  animation: pulse 0.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
