async function sendMessage(message) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query: message })
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message. Please try again.');
    }
}

// Event listener para o botão de enviar
document.getElementById('sendBtn').addEventListener('click', async () => {
    const messageInput = document.getElementById('userInput');
    const message = messageInput.value.trim();
    
    if (message) {
        // Mostra a mensagem do usuário imediatamente na UI
        updateChatUI(message, null); // Passa null para o botMessage
        
        const response = await sendMessage(message);
        if (response) {
            // Atualiza a interface do usuário com a resposta do bot
            updateChatUI(null, response.fulfillmentText); // Passa null para o userMessage
        }

        // Limpa o input do usuário após enviar a mensagem
        messageInput.value = '';
    }
});

function updateChatUI(userMessage, botMessage) {
    const messagesContainer = document.getElementById('messages');
    
    if (userMessage) {
        const userDiv = document.createElement('div');
        userDiv.textContent = `Você: ${userMessage}`;
        messagesContainer.appendChild(userDiv);
    }
    
    if (botMessage) {
        const botDiv = document.createElement('div');
        botDiv.textContent = `IA: ${botMessage}`;
        messagesContainer.appendChild(botDiv);
    }
  
    // Role para a última mensagem
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
