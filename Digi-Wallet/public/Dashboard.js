import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "./auth.js";

const usedWords = new Set(); 
const dburl = 'https://digi-wallet-c2046-default-rtdb.firebaseio.com/User';

// Simple hash function
function simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16); // Convert to hex
}


function disacc(accounts) {
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

async function loadacc(user) {
    try {
        const currentUID = user.uid;

        const response = await fetch(`${dburl}.json`);
        if (!response.ok) {
            alert('Failed to fetch data from Firebase.');
        }

        const allUIDs = await response.json();
        if (!allUIDs) {
            alert('No user data found in Firebase.');
        }

        let matchkey = null;
        for (const uidKey in allUIDs) {
            if (allUIDs[uidKey].uid === currentUID) {
                matchkey = uidKey;
                break;
            }
        }

        if (!matchkey) {
            alert('Current user UID not found in Firebase.');
        }

        const accountRef = `${dburl}/${matchkey}/account.json`;
        const accountResponse = await fetch(accountRef);
        if (!accountResponse.ok) {
            alert('Failed to fetch accounts for the current user.');
        }

        const existingAccounts = await accountResponse.json() || {};
        disacc(existingAccounts); // Display accounts
    } catch (error) {
        console.error(error.message);
    }
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "./index.html";
        return;
    }
    await loadacc(user);

    document.getElementById('addacc').addEventListener('click', async () => {
        try {
            const currentUID = user.uid;


            const response = await fetch(`${dburl}.json`);
            if (!response.ok) {
                alert('Failed to fetch data from Firebase.');
            }

            const allUIDs = await response.json();
            if (!allUIDs) {
                alert('No user data found in Firebase.');
            }

            let matchkey = null;
            for (const uidKey in allUIDs) {
                if (allUIDs[uidKey].uid === currentUID) {
                    matchkey = uidKey;
                    break;
                }
            }

            if (!matchkey) {
                alert('Current user UID not found in Firebase.');
            }


            const accountRef = `${dburl}/${matchkey}/account.json`;
            const accountResponse = await fetch(accountRef);
            if (!accountResponse.ok) {
                alert('Failed to fetch accounts for the current user.');
            }

            const existingAccounts = await accountResponse.json() || {};


            const accountKey = `account_${Object.keys(existingAccounts).length + 1}`;


            const wordResponse = await fetch('https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt');
            if (!wordResponse.ok) {
                alert('Failed to fetch word list.');
            }

            const words = (await wordResponse.text()).split('\n');
            let randomWord;

            do {
                const randomIndex = Math.floor(Math.random() * words.length);
                randomWord = words[randomIndex];
            } while (usedWords.has(randomWord));

            usedWords.add(randomWord);
            const hash = simpleHash(randomWord);

            existingAccounts[accountKey] = {
                hash: hash,
                bal: "0.00"
            };

            const updateResponse = await fetch(accountRef, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(existingAccounts),
            });

            if (!updateResponse.ok) {
                alert('Failed to update Firebase database.');
            }

            await loadacc(user);
            alert('New account added successfully.');
        } catch (error) {
            console.error(error.message);
        }
    });
});
