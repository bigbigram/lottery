<template>
  <div class="policy-page">
    <h1>Terms and Conditions</h1>
    <div class="content">
      <section>
        <h2>Eligibility</h2>
        <p>Users must be 18 years or older to participate in the lottery.</p>
      </section>
      
      <section>
        <h2>Ticket Purchase</h2>
        <ul>
          <li>All sales are final</li>
          <li>Tickets are non-transferable</li>
          <li>Users must provide valid identification for claims</li>
        </ul>
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
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 { 
  color: #0066cc; 
  margin-bottom: 30px; 
}

h2 { 
  color: #333; 
  margin: 20px 0;
  font-size: 1.5rem;
}

section { 
  margin-bottom: 30px; 
}

p {
  line-height: 1.6;
  color: #666;
}

ul {
  padding-left: 20px;
  margin: 15px 0;
}

li {
  margin: 10px 0;
  color: #666;
  line-height: 1.6;
}
</style>
