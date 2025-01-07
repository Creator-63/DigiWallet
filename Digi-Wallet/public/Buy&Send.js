import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "./auth.js";
const dburl = 'https://digi-wallet-c2046-default-rtdb.firebaseio.com/User';

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "./index.html";
        return;
    }
});

function discur(accounts) {
    const acccon = document.getElementById("acccon");
    acccon.innerHTML = ""; 

    for (const [key, value] of Object.entries(accounts)) {
        const accountDiv = document.createElement("div");
        accountDiv.style.marginBottom = "10px"; // Ensure spacing between accounts

        const accountButton = document.createElement("button");
        accountButton.textContent = `${key}: Hash = ${value.hash}, Balance = ${value.bal}$`;
        accountButton.className = "clickbutton";
        accountButton.addEventListener("click", () => {
            window.location.href = "./Buy&Send.html";
        });

        accountDiv.appendChild(accountButton);
        acccon.appendChild(accountDiv);
    }
}
document.getElementById("addcur").addEventListener("click", async () => {
    const cryptoList = ["bitcoin", "ethereum", "dogecoin", "cardano", "solana"];
    const apiURL = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoList.join(",")}&vs_currencies=usd`;

    try {
        // Fetch data from the API
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error("Failed to fetch crypto prices");
        }

        // Parse the JSON response
        const data = await response.json();

        // Display prices in the list
        const cryptoListElement = document.getElementById("cryptoList");
        cryptoListElement.innerHTML = ""; // Clear any previous entries

        cryptoList.forEach((crypto) => {
            const price = data[crypto]?.usd ?? "N/A"; // Handle missing data
            const listItem = document.createElement("li");
            listItem.textContent = `${crypto.charAt(0).toUpperCase() + crypto.slice(1)}: $${price}`;
            cryptoListElement.appendChild(listItem);
        });
    } catch (error) {
        alert("Error: " + error.message);
    }
});