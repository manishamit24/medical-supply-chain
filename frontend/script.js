async function fetchMedicine() {
    const id = document.getElementById('medicineId').value;
    const resultDiv = document.getElementById('result');
  
    // Loading message
    resultDiv.innerHTML = "Loading...";
  
    try {
      const response = await fetch(`http://localhost:3000/medicine/${id}`);
      const data = await response.json();
  
      if (data.message) {
        resultDiv.innerHTML = `<p style="color:red;">${data.message}</p>`;
      } else {
        resultDiv.innerHTML = `
          <div class="card">
            <h3>${data.name}</h3>
            <p><strong>Manufacturer:</strong> ${data.manufacturer}</p>
            <p><strong>Distributor:</strong> ${data.distributor}</p>
            <p><strong>Pharmacy:</strong> ${data.pharmacy}</p>
          </div>
        `;
      }
  
    } catch (error) {
      resultDiv.innerHTML = `<p style="color:red;">Error fetching data</p>`;
    }
  }
  
  // Enter key se search
  document.getElementById("medicineId").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      fetchMedicine();
    }
  });