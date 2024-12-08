import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';

const AIProfessorChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch previous conversations when component mounts
    useEffect(() => {
        const fetchPreviousConversations = async () => {
            if (user?.email) {
                try {
                    const response = await fetch(`http://localhost:5000//chatbot/conversations/${user.email}`);
                    const conversations = await response.text();
                    const parsedConversations = JSON.parse(conversations);
                    
                    // Transform conversations to message format
                    const formattedMessages = parsedConversations.flatMap(conv => [
                        { text: conv.query, sender: 'user' },
                        { text: conv.response, sender: 'ai' }
                    ]);

                    setMessages(formattedMessages);
                    scrollToBottom();
                } catch (error) {
                    console.error('Error fetching previous conversations:', error);
                }
            }
        };

        fetchPreviousConversations();
    }, [user]);

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
    
        // Add user message to chat
        const userMessage = { text: inputMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        
        try {
            const response = await fetch('http://localhost:5000/chatbot/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    query: inputMessage
                })
            });
    
            const aiResponse = await response.text();
    
            // Add AI response to chat
            const aiMessage = { text: aiResponse, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
    
            // This line clears the input text
            setInputMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Chatbot send error:', error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen && (
                <div className="w-80 h-[500px] bg-white border rounded-lg shadow-lg flex flex-col">
                    <div className="p-4 bg-gray-100 font-bold rounded-t-lg">
                        AI Professor
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-2">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`p-2 rounded-lg max-w-[80%] ${
                                    msg.sender === 'user' 
                                    ? 'bg-blue-500 text-white self-end ml-auto' 
                                    : 'bg-gray-200 text-black self-start'
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t flex">
                        <input 
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask your AI Professor..."
                            className="flex-grow mr-2 p-2 border rounded"
                        />
                        <button 
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white p-2 rounded"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
            
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
            >
                {isOpen ? 'Close' : 'Ask Ai Professor'}
            </button>
        </div>
    );
};

export default AIProfessorChatbot;