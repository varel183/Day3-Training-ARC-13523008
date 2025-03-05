const API_URL = "http://localhost:5000";
let transactions = [];
let exchangeRates = { IDR: 1, USD: 1, EUR: 1 };
let transactionChart;

const editIcon = "./icon/edit.png";
const deleteIcon = "./icon/delete.png";

function updateChart() {
  const selectedCurrency = document.getElementById("curr").value;
  let incomeData = 0;
  let expenseData = 0;

  transactions.forEach((trx) => {
    const amountConverted = convertCurrency(trx.amount, trx.currency, selectedCurrency);
    if (trx.type === "income") {
      incomeData += amountConverted;
    } else if (trx.type === "expense") {
      expenseData += amountConverted;
    }
  });

  const chart = document.getElementById("transactionChart");

  if (incomeData === 0 && expenseData === 0) {
    chart.style.display = "none";
    return;
  } else {
    chart.style.display = "block";
  }

  if (transactionChart) {
    transactionChart.data.datasets[0].data = [incomeData, expenseData];
    transactionChart.update();
  } else {
    const ctx = document.getElementById("transactionChart").getContext("2d");
      transactionChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Pemasukan", "Pengeluaran"],
        datasets: [
        {
          label: "Total dalam " + selectedCurrency,
          data: [incomeData, expenseData],
          backgroundColor: ["#4CAF50", "#FF5733"],
        },
        ],
      },
      options: {
        responsive: true,
        plugins: {
        tooltip: {
          callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
            label += ": ";
            }
            label += `${context.raw.toFixed(2)}`;
            return label;
          },
          },
        },
        },
      },
      });
  }
}

async function fetchExchangeRate(targetCurrency) {
  try {
    const response = await fetch(`${API_URL}/exchange-rate/${targetCurrency}`); 
    const data = await response.json();
    return data.rate;
  } catch (error) {
    console.error(`Error fetching exchange rate for ${targetCurrency}:`, error);
    return 1;
  }
}

async function updateExchangeRates() {
  exchangeRates.IDR = await fetchExchangeRate("IDR");
  exchangeRates.USD = await fetchExchangeRate("USD");
  exchangeRates.EUR = await fetchExchangeRate("EUR");

  updateCurrency();
}

async function fetchTransactions(endpoint) {
  try {
    const response = await fetch(API_URL + endpoint);
    transactions = await response.json();
    updateCurrency();
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}

function updateCurrency() {
  const selectedCurrency = document.getElementById("curr").value;
  const tableBody = document.getElementById("transaction-table");
  tableBody.innerHTML = "";

  transactions.forEach((trx) => {
    let category = trx.category;
    if (category === "foodbev") {
      category = "Makanan & Minuman";
    } else if (category === "transport") {
      category = "Transportasi";
    } else if (category === "entertainment") {
      category = "Hiburan";
    } else if (category === "shopping") {
      category = "Belanja";
    } else {
      category = "Lainnya";
    }
    const convertedAmount = convertCurrency(trx.amount, trx.currency, selectedCurrency);
    const row = `<tr>
              <td>${trx.id}</td>
              <td>${trx.description}</td>
              <td>${convertedAmount.toFixed(2)}</td>
              <td>${selectedCurrency}</td>
              <td>${category}</td>
              <td>${new Date(trx.date).toLocaleString()}</td>
              <td><img src="${editIcon}" alt="Edit" class="icon" onclick="editTransaction(${trx.id})"></td>
              <td><img src="${deleteIcon}" alt="Delete" class="icon" onclick="deleteTransaction(${trx.id})"></td>

          </tr>`;
    tableBody.innerHTML += row;
  });
  calculateTotalBalance(selectedCurrency);
  updateChart();
}

function calculateTotalBalance(selectedCurrency) {
  let totalBalance = 0;

  transactions.forEach((trx) => {
    let convertedAmount = convertCurrency(trx.amount, trx.currency, selectedCurrency);
    totalBalance += trx.type === "income" ? convertedAmount : -convertedAmount;
  });

  document.getElementById("total-balance").textContent = `Total Saldo: ${totalBalance.toFixed(2)} ${selectedCurrency}`;
}

function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    console.error("Exchange rate missing for:", fromCurrency, toCurrency);
    return amount;
  }
  const amountInUSD = amount / exchangeRates[fromCurrency];
  const convertedAmount = amountInUSD * exchangeRates[toCurrency];

  return convertedAmount;
}

function editTransaction(id) {
  const trx = transactions.find(t => t.id === id);
  if (!trx) return;

  document.getElementById("description").value = trx.description;
  document.getElementById("amount").value = trx.amount;
  document.getElementById("currency").value = trx.currency;
  document.getElementById("type").value = trx.type;
  document.getElementById("category").value = trx.category;

  document.getElementById("editModal").style.display = "flex";

  document.getElementById("save-btn").onclick = async function () {
    const updatedTransaction = {
      description: document.getElementById("description").value,
      amount: parseFloat(document.getElementById("amount").value),
      currency: document.getElementById("currency").value,
      type: document.getElementById("type").value,
      category: document.getElementById("category").value
    };

    try {
      await fetch(`${API_URL}/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTransaction),
      });

      await fetchTransactions("/api/transactions"); 
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };
}

async function deleteTransaction(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;

  try {
    await fetch(`${API_URL}/api/transactions/${id}`, { method: "DELETE" });
    await fetchTransactions("/api/transactions");
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
}

function closeModal() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("currency").value = "IDR";
  document.getElementById("type").value = "income";
  document.getElementById("category").value = "other";
  document.getElementById("editModal").style.display = "none";
}

updateExchangeRates().then(() => fetchTransactions("/api/transactions"));
