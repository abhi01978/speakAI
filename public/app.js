const chat = document.getElementById('chat');
const micBtn = document.getElementById('micBtn');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');

// Speech
// Speech
let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.continuous = false;
} else {
  console.error("SpeechRecognition NOT supported. Use Chrome.");
  alert("Mic ka feature sirf Chrome browser me chalega.");
}


function addMessage(text, isUser = false) {
  const div = document.createElement('div');
  div.className = `p-4 rounded-xl max-w-lg ${isUser ? 'bg-blue-600 ml-auto' : 'bg-gray-700'} shadow-lg my-2`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}

// Mic
micBtn.addEventListener('click', () => {
  micBtn.classList.add('animate-ping');
  recognition.start();
});

recognition.onresult = e => {
  const text = e.results[0][0].transcript;
  addMessage("आप: " + text, true);
  sendToBackend(text);
};

recognition.onend = () => micBtn.classList.remove('animate-ping');

// Manual send
sendBtn.addEventListener('click', () => {
  const msg = textInput.value.trim();
  if (msg) {
    addMessage("आप: " + msg, true);
    sendToBackend(msg);
    textInput.value = '';
  }
});

// Call backend
async function sendToBackend(message) {
  addMessage("Raju Sir soch raha hai...", false);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    const reply = data.reply;

    chat.lastChild.textContent = reply;
    speak(reply.split("\n")[0]);

  } catch (err) {
    chat.lastChild.textContent = "Server error, please try again!";
  }
}
