import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';

const AIProfessorChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Scroll to bottom when the chatbox is opened
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen]);

    // Fetch previous conversations when component mounts or user changes
    useEffect(() => {
        const fetchPreviousConversations = async () => {
            if (user?.email) {
                try {
                    const response = await fetch(`http://localhost:5000/chatbot/conversations/${user.email}`);
                    if (!response.ok) throw new Error('Failed to fetch conversations');
                    const conversations = await response.json();
                    const validConversations = Array.isArray(conversations) ? conversations : [];
                    const formattedMessages = validConversations.flatMap(conv => [
                        { text: conv.query, sender: 'user', timestamp: conv.timestamp },
                        { text: conv.response, sender: 'ai', timestamp: conv.timestamp }
                    ]);
                    const sortedMessages = formattedMessages.sort((a, b) => 
                        new Date(a.timestamp) - new Date(b.timestamp)
                    );
                    setMessages(sortedMessages);
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

        const userMessage = { 
            text: inputMessage, 
            sender: 'user', 
            timestamp: new Date().toISOString() 
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/chatbot/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, query: inputMessage })
            });
            const aiResponse = await response.text();
            const aiMessage = { 
                text: aiResponse, 
                sender: 'ai', 
                timestamp: new Date().toISOString() 
            };
            setMessages(prev => [...prev, aiMessage]);
            setInputMessage('');
        } catch (error) {
            console.error('Chatbot send error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen && (
                <div className="w-[500px] h-[500px] bg-white border rounded-lg shadow-lg flex flex-col">
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
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white p-2 rounded flex items-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner text-white"></span>
                            ) : (
                                'Send'
                            )}
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
