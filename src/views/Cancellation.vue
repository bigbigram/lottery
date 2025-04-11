<template>
  <div class="policy-page">
    <h1>Cancellation & Refund</h1>
    <div class="content">
      <section>
        <h2>Lottery Ticket Cancellation</h2>
        <div class="policy-box warning">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Once a lottery ticket is purchased, it cannot be cancelled or refunded due to regulatory requirements.</p>
        </div>
      </section>
      
      <section>
        <h2>Refund Cases</h2>
        <div class="policy-list">
          <div class="policy-item">
            <i class="fas fa-check-circle"></i>
            <p>Failed transactions will be automatically refunded within 5-7 business days</p>
          </div>
          <div class="policy-item">
            <i class="fas fa-check-circle"></i>
            <p>Double charges or technical errors will be refunded immediately</p>
          </div>
          <div class="policy-item">
            <i class="fas fa-check-circle"></i>
            <p>System-generated cancellations will be processed automatically</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Contact Support</h2>
        <div class="contact-box">
          <p>For any issues regarding refunds, please contact our support team:</p>
          <div class="contact-info">
            <div><i class="fas fa-envelope"></i> indoagent2022@gmail.com
            </div>
            <div><i class="fas fa-phone"></i> +975-17919999</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.policy-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

h1 {
  color: #0066cc;
  margin-bottom: 30px;
  font-size: 2rem;
}

h2 {
  color: #333;
  margin: 25px 0 15px;
  font-size: 1.5rem;
}

section {
  margin-bottom: 40px;
}

.policy-box {
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.policy-box.warning {
  background: #fff8e6;
  border: 1px solid #ffd480;
}

.policy-box i {
  color: #f90;
  font-size: 1.5rem;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.policy-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.policy-item i {
  color: #28a745;
  font-size: 1.2rem;
}

.contact-box {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.contact-info {
  margin-top: 15px;
  display: flex;
  gap: 20px;
}

contact-info div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0066cc;
}

p {
  margin: 0;
  line-height: 1.6;
  color: #666;
}

@media (max-width: 768px) {
  .contact-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
