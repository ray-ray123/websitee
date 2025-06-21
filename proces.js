const encodedConfig = "eyJhcGlLZXkiOiJBSVpBc3lDUmxKY1pxRXJyWjk1ZWpZRXR1Yk5pSWpHaFVTRDczdSIsImF1dGhEb21haW4iOiJwbnN0MS1iZGFkOS5maXJlYmFzZWFwcC5jb20iLCJwcm9qZWN0SWQiOiJwbnN0MS1iZGFkOSIsInN0b3JhZ2VCdWNrZXQiOiJwbnN0MS1iZGFkOS5maXJlYmFzZXN0b3JhZ2UuYXBwIiwibWVzc2FnaW5nU2VuZGVySWQiOiIxMDMzNjE2MTM3OTI5IiwiYXBwSWQiOiIxOjEwMzM2MTYxMzc5Mjk6d2ViOmZmZTEyN2RiZjlmOGM4MDcyYjM3MTgiLCJtZWFzdXJlbWVudElkIjoiRy1CVlpGVDNMUUVYIn0=";

const firebaseConfig = JSON.parse(atob(encodedConfig));
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUserNumber = null;
let unsubscribe = null;
let currentCallUnsub = null;
let ringingTimeout = null;
let serverComms = true;

function updateServerStatusText() {
  const statusEl = document.getElementById('serverStatusText');
  if (serverComms) {
    statusEl.innerText = 'Online';
    statusEl.style.color = '#28a745';
  } else {
    statusEl.innerText = 'Offline';
    statusEl.style.color = '#dc3545';
  }
}

async function fetchServerComms() {
  try {
    const snapshot = await db.collection('serverSTATS').limit(1).get();
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const boolKey = Object.keys(data).find(key => typeof data[key] === 'boolean');
      if (boolKey) {
        serverComms = data[boolKey];
      } else {
        serverComms = false;
      }
    } else {
      serverComms = false;
    }
  } catch (err) {
    serverComms = false;
  }
  updateServerStatusText();
}

window.addEventListener('load', () => {
  fetchServerComms();
  setInterval(fetchServerComms, 15000);
});





window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const suInput = document.getElementById("su");
    
   


  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!query) return;

    searchTimeout = setTimeout(async () => {
      try {
        const emailQuerySnapshot = await db.collection("users")
          .where("email", ">=", query)
          .where("email", "<=", query + '\uf8ff')
          .limit(10)
          .get();

        const numberQuerySnapshot = await db.collection("users")
          .where("number", ">=", query)
          .where("number", "<=", query + '\uf8ff')
          .limit(10)
          .get();

        const usersMap = new Map();

        emailQuerySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.email && data.number) {
            usersMap.set(doc.id, data);
          }
        });

        numberQuerySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.email && data.number) {
            usersMap.set(doc.id, data);
          }
        });

        const users = Array.from(usersMap.values());
        const filtered = users.filter(u =>
          u.email.toLowerCase().includes(query) || u.number.includes(query)
        );

        searchResults.innerHTML = "";

        if (filtered.length === 0) {
          const noResult = document.createElement("div");
          noResult.style.padding = "8px";
          noResult.style.color = "#999";
          noResult.textContent = "No results found";
          searchResults.appendChild(noResult);
          return;
        }

        filtered.forEach(user => {
          const div = document.createElement("div");
          div.style.padding = "8px";
          div.style.cursor = "pointer";
          div.style.borderBottom = "1px solid #eee";
          div.textContent = `${user.email} — ${user.number}`;
          div.addEventListener("click", () => {
            suInput.value = user.number;  // fill the "su" input with number
            searchResults.innerHTML = "";
            searchInput.value = "";
            suInput.focus();
          });
          searchResults.appendChild(div);
        });

      } catch (err) {
        console.error("Error searching users:", err);
        searchResults.innerHTML = '<div style="padding:8px; color:red;">Error searching users</div>';
      }
    }, 300);
  });

  document.addEventListener("click", e => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.innerHTML = "";
    }
  });
  function toggleSuVisibility() {
  if (suInput.value.trim() === '') {
    suInput.style.display = 'none';
  } else {
    suInput.style.display = 'block';
  }
}
  if (!searchInput || !searchResults || !suInput) {
    console.error('One or more elements not found: searchInput, searchResults, or su');
    return;
  }

  let searchTimeout = null;
});







// Close dropdown if clicking outside



async function fetchServerComms() {
  try {
    const snapshot = await db.collection('serverSTATS').limit(1).get();
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const boolKey = Object.keys(data).find(key => typeof data[key] === 'boolean');
      if (boolKey) {
        serverComms = data[boolKey];
      } else {
        console.warn('No boolean field found in the first document.');
        serverComms = false;
      }
    } else {
      console.warn('serverSTATS collection is empty.');
      serverComms = false;
    }
  } catch (err) {
    console.error('Error fetching serverComms:', err);
    serverComms = false;
  }
  updateServerStatusText()
}
async function TSCON() {
  const snapshot = await db.collection('serverSTATS').limit(1).get();
  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    const data = snapshot.docs[0].data();
    const boolKey = Object.keys(data).find(key => typeof data[key] === 'boolean');
    if (boolKey) {
      await docRef.update({ [boolKey]: true });
      await fetchServerComms()
    }
  }
}
async function TSCOFF() {
  const snapshot = await db.collection('serverSTATS').limit(1).get();
  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    const data = snapshot.docs[0].data();
    const boolKey = Object.keys(data).find(key => typeof data[key] === 'boolean');
    if (boolKey) {
      await docRef.update({ [boolKey]: false });
      await fetchServerComms()
    }
  }
}

    
     async function serverCheck() {
  await fetchServerComms();
  if (!serverComms) {
    alert('Servers are down');
    return false;
  }
  return true;
}

    
    async function signUp() {
      if (!(await serverCheck())) { return; }

      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      auth.createUserWithEmailAndPassword(email, password).then(cred => {
        const number = Math.floor(100000000 + Math.random() * 900000000).toString();
        currentUserNumber = number;
        return db.collection('users').doc(cred.user.uid).set({
          email: email,
          number: number
        });
      }).catch(err => console.error('SignUp error:', err));
    }

    async function signIn() {
            if (!(await serverCheck())) { return; }

      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      auth.signInWithEmailAndPassword(email, password)
        .catch(err => console.error('SignIn error:', err));
    }

    auth.onAuthStateChanged(async user => {
      if (user) {
        document.getElementById('userPanel').style.display = 'block';
        document.getElementById('userEmail').innerText = user.email;

        try {
          const userDoc = await db.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            currentUserNumber = userDoc.data().number;
            document.getElementById('userNumber').innerText = currentUserNumber;
            listenForMessages();
            listenForCalls();
          } else {
            console.error('User document not found!');
            currentUserNumber = null;
            document.getElementById('userNumber').innerText = '';
          }
        } catch (err) {
          console.error('Error fetching user number:', err);
          currentUserNumber = null;
          document.getElementById('userNumber').innerText = '';
        }
      } else {
        document.getElementById('userPanel').style.display = 'none';
        currentUserNumber = null;
        if (unsubscribe) unsubscribe();
        if (currentCallUnsub) currentCallUnsub();
        clearRinging();
      }
      // Hide admin panel on user change
      document.getElementById('adminPanel').style.display = 'none';
    });

    async function sendMessage() {
      if (!(await serverCheck())) { return; }
      const to = document.getElementById('su').value.trim();
      const message = document.getElementById('messageInput').value.trim();
      if (!to || !message) {
        alert('Please enter both recipient and message.');
        return;
      }
      const from = currentUserNumber;
      if (!from) {
        alert('Your phone number is not available.');
        return;
      }
      db.collection('messages').add({ from, to, message, timestamp: Date.now() })
        .then(() => {
          document.getElementById('messageInput').value = '';
          console.log('Message sent');
        })
        .catch(err => console.error('SendMessage error:', err));
    }

    async function makeCall() {
     if (!(await serverCheck())) { return; }
      const to = document.getElementById('su').value.trim();
      if (!to) {
        alert('Please enter a number to call.');
        return;
      }
      const from = currentUserNumber;
      if (!from) {
        alert('Your phone number is not available.');
        return;
      }
      db.collection('calls').add({ from, to, status: 'ringing', timestamp: Date.now() })
        .then(() => console.log('Call initiated'))
        .catch(err => console.error('MakeCall error:', err));
    }

    async function listenForMessages() {
      if (!(serverCheck())) { return; }
      if (!currentUserNumber) {
        console.warn('No current user number for message listener');
        return;
      }
      console.log('Listening for messages to number:', currentUserNumber);
      if (unsubscribe) unsubscribe();
      unsubscribe = db.collection('messages')
        .where('to', '==', currentUserNumber)
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
          displayMessages(snapshot);
        }, error => {
          console.error('Firestore listener error:', error);
        });
    }

    async function refreshMessages() {
      if (!(await serverCheck())) { return; }
      if (!currentUserNumber) return;
      db.collection('messages')
        .where('to', '==', currentUserNumber)
        .orderBy('timestamp')
        .get()
        .then(snapshot => {
          displayMessages(snapshot);
          console.log('Messages refreshed');
        })
        .catch(err => console.error('RefreshMessages error:', err));
    }

    async function displayMessages(snapshot) {
      if (!(await serverCheck())) { return; }
      const msgDiv = document.getElementById('messages');
      msgDiv.innerHTML = '';
      if (snapshot.empty) {
        msgDiv.innerHTML = '<p>No messages</p>';
        return;
      }
      snapshot.forEach(doc => {
        const msg = doc.data();
        msgDiv.innerHTML += `<p><b>${msg.from}</b>: ${msg.message}</p>`;
      });
    }

    let currentCallId = null;
    function listenForCalls() {
  if (!currentUserNumber) return;

  if (currentCallUnsub) currentCallUnsub();

  currentCallUnsub = db.collection('calls')
    .where('to', '==', currentUserNumber)
    .where('status', 'in', ['ringing', 'ended'])
    .orderBy('timestamp')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const callData = change.doc.data();
        const callId = change.doc.id;

        if (change.type === 'added' || change.type === 'modified') {
          if (callData.status === 'ringing') {
            onIncomingCall(callId, callData);
          } else if (callData.status === 'ended') {
            onCallEnded(callId, callData);
          }
        }
      });
    });
}
async function onIncomingCall(callId, callData) {
  if (!(await serverCheck())) { return; }
  const ringtone = document.getElementById('ringtone');
  ringtone.loop = true;
  ringtone.play();

  if (ringingTimeout) clearTimeout(ringingTimeout);

  ringingTimeout = setTimeout(async () => {
    clearRinging();
    try {
      await db.collection('calls').doc(callId).delete();
      console.log('Call auto-hung up after 5 seconds');
    } catch (err) {
      console.error('Error auto-hanging up call:', err);
    }
  }, 5000);

  document.getElementById('incomingCallInfo').innerText = `Incoming call from ${callData.from}`;
  document.getElementById('acceptBtn').style.display = 'inline-block';
  document.getElementById('declineBtn').style.display = 'inline-block';

  window.currentCallId = callId; // store for accept/decline
}


async function acceptCall() {
  if (!(await serverCheck())) { return; }
  if (!window.currentCallId) return;
  db.collection('calls').doc(window.currentCallId).update({ status: 'accepted' });
  clearRinging();
}

async function declineCall() {
  if (!(await serverCheck())) { return; }
  if (!window.currentCallId) return;
  db.collection('calls').doc(window.currentCallId).update({ status: 'declined' });
  clearRinging();
}


async function clearRinging() {
 if (!(await serverCheck())) { return; }
  if (ringingTimeout) {
    clearTimeout(ringingTimeout);
    ringingTimeout = null;
  }
  const ringtone = document.getElementById('ringtone');
  ringtone.pause();
  ringtone.currentTime = 0;

  document.getElementById('incomingCallInfo').innerText = '';
  document.getElementById('acceptBtn').style.display = 'none';
  document.getElementById('declineBtn').style.display = 'none';
  window.currentCallId = null;
}



    // Admin panel related code

    const adminSequence = 'ADMINSIGNIN';
    let inputBuffer = '';

    window.addEventListener('keydown', e => {
      inputBuffer += e.key.toString().toUpperCase();
      if (!adminSequence.startsWith(inputBuffer)) {
        inputBuffer = e.key.toString().toUpperCase(); // reset to last key if mismatch
      }
      if (inputBuffer === adminSequence) {
        inputBuffer = '';
        toggleAdminPanel(true);
      }
    });

   function toggleAdminPanel(show) {
  const adminPanel = document.getElementById('adminPanel');
  const cliContainer = document.getElementById('cliContainer');
  if (show) {
    adminPanel.style.display = 'block';
    cliContainer.style.display = 'block';
  } else {
    adminPanel.style.display = 'none';
    cliContainer.style.display = 'none';
  }
}

    async function sendMessageToAll() {
      if (!(await serverCheck())) { return; }
      const message = document.getElementById('adminMessage').value.trim();
      if (!message) {
        alert('Enter a message to send to all users.');
        return;
      }
      try {
        const usersSnapshot = await db.collection('users').get();
        const batch = db.batch();
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          const userNumber = userData.number;
          if (userNumber) {
            const msgRef = db.collection('messages').doc();
            batch.set(msgRef, {
              from: 'ADMIN',
              to: userNumber,
              message: message,
              timestamp: Date.now()
            });
          }
        });
        await batch.commit();
        document.getElementById('adminStatus').innerText = 'Message sent to all users.';
        document.getElementById('adminMessage').value = '';
      } catch (err) {
        console.error('Error sending message to all:', err);
        document.getElementById('adminStatus').innerText = 'Error sending message.';
      }
    }

    async function deleteAllMessages() {
      if (!(await serverCheck())) { return; }
      if (!confirm('Are you sure you want to delete ALL messages? This cannot be undone.')) return;
      try {
        const snapshot = await db.collection('messages').get();
        const batch = db.batch();
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        document.getElementById('adminStatus').innerText = 'All messages deleted.';
      } catch (err) {
        console.error('Error deleting messages:', err);
        document.getElementById('adminStatus').innerText = 'Error deleting messages.';
      }
    }
