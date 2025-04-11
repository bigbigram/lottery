<template>
  <div class="results">
    <div class="hero-section">
      <h1>Lottery Results</h1>
      <p class="subtitle">Check the latest draw results</p>
    </div>
    
    <div class="filter-section">
      <div class="date-filter-container">
        <div class="filter-wrapper">
          <i class="fas fa-calendar-alt calendar-icon"></i>
          <input 
            type="date" 
            v-model="selectedDate"
            @change="filterResults"
            class="date-input"
            :max="currentDate"
          >
        </div>
        <button @click="clearFilter" class="clear-btn">
          <i class="fas fa-times"></i>
          Clear Filter
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading results...</p>
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="results-grid">
      <div v-for="result in displayedResults" 
           :key="result.iLotteryName" 
           class="result-card">
        <div class="result-content">
          <h3 class="lottery-name">{{ result.iLotteryName }}</h3>
          <div class="result-details">
            <div class="date">Draw Date: {{ formatDate(result.draw_date) }}</div>
          </div>
        </div>
        <div class="pdf-section">
          <a 
            :href="`https://lottery.indob2c.com/result/${result.pdf_file}`" 
            target="_blank"
            download
            class="download-btn">
            <i class="fas fa-download"></i>
            Download PDF
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Results',
  data() {
    return {
      results: [],
      filteredResults: [],
      loading: true,
      error: null,
      selectedDate: '',
      recordLimit: 20,
      currentDate: new Date().toISOString().split('T')[0]
    }
  },
  computed: {
    displayedResults() {
      return this.selectedDate ? this.filteredResults : this.results.slice(0, this.recordLimit);
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    async fetchResults() {
      try {
        this.loading = true;
        const response = await fetch('https://lottery.indob2c.com/drawResult.php');
        if (!response.ok) throw new Error('Failed to fetch results');
        
        const data = await response.json();
        this.results = data.sort((a, b) => new Date(b.draw_date) - new Date(a.draw_date));
        this.filteredResults = this.results;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching results:', err);
      } finally {
        this.loading = false;
      }
    },
    filterResults() {
      if (!this.selectedDate) {
        this.filteredResults = this.results;
        return;
      }
      
      this.filteredResults = this.results.filter(result => 
        result.draw_date.startsWith(this.selectedDate)
      );
    },
    clearFilter() {
      this.selectedDate = '';
      this.filteredResults = this.results;
    },
    viewPDF(filename) {
      window.open(`https://lottery.indob2c.com/${filename}`, '_blank');
    }
  },
  mounted() {
    this.fetchResults();
  }
}
</script>

<style scoped>
.results {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
  padding: 0;
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

.filter-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  max-width: 600px;
  margin: -50px auto 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;
}

.date-filter-container {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
}

.date-input {
  padding: 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 0.95rem;
  min-width: 200px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.clear-btn {
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.result-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 102, 204, 0.15);
}

.lottery-name {
  font-size: 1.4rem;
  color: #1a1a4e;
  margin: 0;
  font-weight: 600;
  background: linear-gradient(135deg, #1a1a4e 0%, #2b2b7b 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.result-details {
  padding: 15px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.date {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.download-btn {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  max-width: 130px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
}

/* Base styles */
.results {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.results-container {
  max-width: 1200px;
  margin: 0 auto;
}

.results-filter {
  margin-bottom: 30px;
  text-align: center;
}

.date-filter {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.result-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 102, 204, 0.12);
}

.lottery-name {
  color: #0066cc;
  margin: 0;
  font-size: 1.5rem;
}

.result-details {
  color: #666;
  font-size: 0.9rem;
}

.pdf-section {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

.view-btn, .download-btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.view-btn {
  background: #f8f9fa;
  color: #0066cc;
  border: 1px solid #0066cc;
}

.download-btn {
  width: auto;
  max-width: 130px;
  padding: 6px 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #049a13;
  color: white;
  gap: 4px;
  border-radius: 4px;
  transition: background 0.3s ease;
  font-size: 0.8rem;
}

.view-btn:hover {
  background: #e9ecef;
}

.download-btn:hover {
  background: #0052a3;
}

.pdf-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.pdf-modal-content {
  background: white;
  width: 90%;
  height: 90%;
  border-radius: 12px;
  position: relative;
  padding: 20px;
}

.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background: #c82333;
}

/* Mobile styles */
@media (max-width: 768px) {
  .results {
    padding: 0;
  }

  .date-filter-container {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    margin: 0;
    padding: 12px 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    flex-direction: row;
    gap: 12px;
  }

  .date-input {
    background: #f5f5f5;
    border: none;
    border-radius: 4px;
    padding: 8px 12px 8px 36px;
    font-size: 0.9rem;
    color: #212121;
    width: 100%;
    max-width: 280px;
  }

  .clear-btn {
    background: #f5f5f5;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    color: #1976d2;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.85rem;
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .results-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .result-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin: 0 8px 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    position: relative;
    overflow: hidden;
  }

  .result-card:active::after {
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

  .lottery-name {
    font-size: 1.1rem;
    color: #1976d2;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .result-details {
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .date {
    font-size: 0.85rem;
    color: #757575;
  }

  .download-btn {
    padding: 6px 10px;
    font-size: 0.75rem;
    max-width: 110px;
    border-radius: 4px;
    text-transform: none;
    font-weight: normal;
    letter-spacing: normal;
  }

  .download-btn:active {
    background: #1565c0;
  }
}

/* Animations */
@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 25px 0;
  padding: 0 15px;
}

.filter-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.calendar-icon {
  position: absolute;
  left: 12px;
  color: #0066cc;
  pointer-events: none;
}

.date-input {
  padding: 12px 12px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  min-width: 200px;
  color: #333;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.date-input:hover {
  border-color: #0066cc;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
}

.date-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 2px 12px rgba(0, 102, 204, 0.15);
}

.clear-btn {
  padding: 12px 20px;
  background: #f8f9fa;
  color: #0066cc;
  border: 2px solid #0066cc;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #0066cc;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
}

.clear-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .date-filter-container {
    flex-direction: column;
    gap: 12px;
  }

  .date-input {
    width: 100%;
    max-width: 280px;
  }

  .clear-btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 30px 15px;
  }

  .hero-section h1 {
    font-size: 1.8rem;
  }

  .filter-section {
    margin: -30px 15px 20px;
    padding: 15px;
  }

  .result-card {
    margin: 0 10px;
    padding: 20px;
  }

  .lottery-name {
    font-size: 1.2rem;
  }
}
</style>
