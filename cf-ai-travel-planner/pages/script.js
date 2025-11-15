// !!! PASTE YOUR WORKER URL HERE !!!
const WORKER_URL = 'https://cf-ai-travel-planner.chiragsreedh.workers.dev';

const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');
const chatLog = document.getElementById('chat-log');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    // Display the user's message
    addMessageToChatLog(messageText, 'user');
    messageInput.value = '';

    try {
        // Send the message to the Worker backend
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageText })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Display the AI's response
        addMessageToChatLog(data.response, 'assistant');

    } catch (error) {
        console.error('Error:', error);
        addMessageToChatLog('Sorry, I ran into an error. Please try again.', 'assistant');
    }
}

function addMessageToChatLog(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to bottom
}