async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chat-box");
  
    const userText = input.value.trim();
    if (!userText) return;
  
    // Show user message
    chatBox.innerHTML += `<div class="user"><b>You:</b> ${userText}</div>`;
    input.value = "";
  
    // Show loading
    chatBox.innerHTML += `<div class="bot"><i>AI is thinking...</i></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  
    // Send to backend
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });
  
    const data = await response.json();
  
    // Remove loading text
    chatBox.lastChild.remove();
  
    // Show bot response
    chatBox.innerHTML += `<div class="bot"><b>MedBot:</b> ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  