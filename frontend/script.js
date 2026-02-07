async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chat-box");
  
    const userText = input.value.trim();
    if (!userText) return;
  
    // Show User Message
    chatBox.innerHTML += `<div class="user-msg">${userText}</div>`;
    input.value = "";
  
    // Bot Loading
    chatBox.innerHTML += `<div class="bot-msg">Thinking...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  
    // Send Request to Backend
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });
  
    const data = await response.json();
  
    // Remove Loading
    chatBox.lastChild.remove();
  
    // Show Bot Reply
    chatBox.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  /* ✅ Enter Key Press Support */
  document.getElementById("userInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
  