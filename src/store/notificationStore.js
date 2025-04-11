import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    preferences: {
      email: true,
      push: true,
      sms: true,
      drawResults: true,
      promotions: true,
      winningAlerts: true
    },
    subscribedTopics: []
  }),

  actions: {
    async sendNotification(type, message) {
      switch(type) {
        case 'DRAW_RESULT':
          await this.sendDrawResult(message);
          break;
        case 'TICKET_PURCHASE':
          await this.sendPurchaseConfirmation(message);
          break;
        case 'WINNER_ALERT':
          await this.sendWinnerAlert(message);
          break;
        case 'PROMOTION':
          await this.sendPromotionalAlert(message);
          break;
      }
      
      this.notifications.push({
        type,
        message,
        timestamp: new Date(),
        read: false
      });
    },

    async sendDrawResult(message) {
      if (this.preferences.drawResults) {
        // Implement SMS/Email/Push notification
      }
    },

    async sendWinnerAlert(message) {
      if (this.preferences.winningAlerts) {
        // Implement winner notification
      }
    },

    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    }
  }
});
