import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    wallet: {
      balance: 0,
      transactions: []
    },
    purchaseHistory: [],
    winningHistory: [],
    referralCode: null,
    referralEarnings: 0
  }),

  actions: {
    async login(credentials) {
      // API call implementation
    },

    async register(userData) {
      // API call implementation
    },

    async updateProfile(data) {
      // API call implementation
    },

    async addToWallet(amount) {
      this.wallet.balance += amount;
      this.wallet.transactions.push({
        type: 'DEPOSIT',
        amount,
        date: new Date()
      });
    },

    generateReferralCode() {
      this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  }
});
