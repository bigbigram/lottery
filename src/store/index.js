import { defineStore } from "pinia";

export const useLotteryStore = defineStore("lottery", {
  state: () => ({
    selectedNumbers: [],
    lotteryList: [], // Store the array of lottery objects
    error: null, // Store any error messages
  }),
  actions: {
    addNumber(number) {
      if (!this.selectedNumbers.includes(number)) {
        this.selectedNumbers.push(number);
      }
    },
    removeNumber(number) {
      this.selectedNumbers = this.selectedNumbers.filter((n) => n !== number);
    },
    async fetchLotteryList() {
      try {
        console.log("Fetching lottery list...");

        const response = await fetch("https://lottery.indob2c.com/ticket.php"); // Use the full API URL
        console.log("API Response Status:", response.status);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("API Response Data:", data); // Log the response for debugging
        this.lotteryList = data; // Store the API response
        this.error = null; // Clear any previous errors
      } catch (error) {
        console.error("Failed to fetch lottery list:", error);
        this.error = error.message; // Store the error message
      }
    },
  },
});
