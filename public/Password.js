import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { auth } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login page if no user is signed in
        window.location.href = "./index.html";
    }
});

const checkbox = document.getElementById('generate-phrases');
const result1 = document.getElementById('result');

checkbox.addEventListener('change', async () => {
    if (checkbox.checked) {
        document.getElementById('generate-phrase').style.display = 'none';

        try {
            const response = await fetch('https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt');
            if (!response.ok) throw new Error('Failed to fetch word list.');

            const wordlist = (await response.text()).split('\n');
            const phrases = [];
            const usedWords = new Set();


            for (let j = 0; j < 12; j++) {
                let word;
                do {
                    const randomIndex = Math.floor(Math.random() * wordlist.length);
                    word = wordlist[randomIndex];
                } while (usedWords.has(word));
                usedWords.add(word);
                phrases.push(word);
            }

            const finalPhrase = phrases.join(' ');
            result1.textContent = finalPhrase;

            const user = auth.currentUser;
            if (user) {
                const currentUID = user.uid;
                const db = getDatabase();
                const userRef = ref(db, 'User');

                const snapshot = await get(userRef);
                const existingData = snapshot.val() || {};

                let matchedUIDKey = null;

                for (const uidKey in existingData) {
                    if (existingData[uidKey].uid === currentUID) {
                        matchedUIDKey = uidKey;
                        break;
                    }
                }

                if (matchedUIDKey) {
                    alert('User already exists.');
                } else {

                    const nextUID = `UID_${Object.keys(existingData).length + 1}`;
                    const newUIDRef = child(userRef, nextUID);

                    await set(newUIDRef, {
                        uid: currentUID,
                        key: finalPhrase
                    })
                        .then(() => console.log(`New UID (${nextUID}) saved successfully to Firebase.`))
                        .catch(error => console.error('Error saving new UID to Firebase:', error));
                }
            } else {
                console.error('No authenticated user found.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

document.getElementById("dashb").addEventListener("click", function () {
    window.location.href = "./Dashboard.html";
});
