import { defineStore } from "pinia";
import { ref, computed } from 'vue';

export const useLotteryStore = defineStore("lottery", {
  state: () => ({
    lotteryNumbers: ref([]),
    error: ref(null),
    isLoading: ref(false),
    lastFetchTime: ref(null),
    cartItems: ref([]),
    lastUpdateTime: ref(null),
    selectedLotteryType: ref(null),
    filteredLotteryNumbers: ref([]),
    currentLotteryType: ref(null),
    types: [],
    upcomingDraws: [],
    results: [],
    favoriteNumbers: [],
    subscriptions: []
  }),
  getters: {
    uniqueLotteryTypes: (state) => {
      const types = state.lotteryNumbers.map(lottery => ({
        id: lottery.iLotteryTypeId,
        name: lottery.lottery_name
      }));
      return [...new Map(types.map(item => [item.id, item])).values()];
    },
    getUpcomingDraws: (state) => state.upcomingDraws,
    getFavoriteNumbers: (state) => state.favoriteNumbers
  },
  actions: {
    async fetchLotteryList() {
      if (!import.meta.env.VITE_API_URL) {
        throw new Error('API URL not configured');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Check cache (5 minutes)
      if (this.lastFetchTime && Date.now() - this.lastFetchTime < 300000) {
        return;
      }

      this.isLoading = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ticket.php`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        
        this.lotteryNumbers = data;
        this.lastFetchTime = Date.now();
        this.error = null;
      } catch (error) {
        console.error("Failed to fetch lottery numbers:", error);
        if (error.name === 'AbortError') {
          this.error = "Request timed out. Please try again.";
        } else {
          this.error = "Unable to load lottery numbers. Please try again later.";
        }
        this.lotteryNumbers = [];
      } finally {
        this.isLoading = false;
        clearTimeout(timeoutId);
      }
    },

    async refreshLotteryList() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ticket.php`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        if (Array.isArray(data)) {
          this.lotteryNumbers = data;
          this.lastUpdateTime = Date.now();
          
          // Remove cart items that no longer exist in lottery numbers
          this.cartItems = this.cartItems.filter(cartItem => 
            data.some(lottery => lottery.lottery_no === cartItem.lottery_no)
          );
          // Update session storage with filtered cart
          sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        }
      } catch (error) {
        console.error("Refresh failed:", error);
      }
    },

    async fetchLotteryByType(typeId = '') {
      this.isLoading = true;
      try {
        const url = typeId 
          ? `${import.meta.env.VITE_API_URL}/ticket.php?lottery_type=${typeId}`
          : `${import.meta.env.VITE_API_URL}/ticket.php`;

        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (Array.isArray(data)) {
          this.lotteryNumbers = data;
          this.filteredLotteryNumbers = data;
          this.lastUpdateTime = Date.now();
        }
      } catch (error) {
        console.error("Failed to fetch lottery by type:", error);
        this.error = "Unable to load lottery numbers. Please try again later.";
      } finally {
        this.isLoading = false;
      }
    },

    addToCart(lotteryNumber) {
      if (!this.cartItems.some(item => item.lottery_no === lotteryNumber.lottery_no)) {
        const cartItem = {
          ...lotteryNumber,
          lottery_id: lotteryNumber.iLotteryId || Date.now(),
          lottery_type: lotteryNumber.lottery_name,
          draw_date: lotteryNumber.draw_date,
          amount: parseInt(lotteryNumber.amount),
          added_at: new Date().toISOString()
        };
        this.cartItems.push(cartItem);
        sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      }
    },

    removeFromCart(lotteryNumber) {
      this.cartItems = this.cartItems.filter(
        item => item.lottery_no !== lotteryNumber.lottery_no
      );
      // Update session storage
      sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    },

    clearCart() {
      this.cartItems = [];
      sessionStorage.removeItem('cartItems');
    },

    // Add method to load cart from session
    loadCartFromSession() {
      const savedCart = sessionStorage.getItem('cartItems');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      }
    },

    filterByType(typeId) {
      this.currentLotteryType = typeId;
      if (!typeId) {
        return this.lotteryNumbers;
      }
      return this.lotteryNumbers.filter(lottery => 
        lottery.iLotteryTypeId === parseInt(typeId)
      );
    },

    async fetchLotteryTypes() {
      // Implement API call
    },

    async purchaseTicket(ticketData) {
      // Implement purchase logic
    },

    async subscribeToDraw(drawId, numbers) {
      this.subscriptions.push({
        drawId,
        numbers,
        autoRenew: true
      });
    },

    addToFavorites(number) {
      if (!this.favoriteNumbers.includes(number)) {
        this.favoriteNumbers.push(number);
      }
    },

    generateRandomNumbers(count) {
      return Array.from({ length: count }, 
        () => Math.floor(Math.random() * 99999) + 1);
    }
  },
});
