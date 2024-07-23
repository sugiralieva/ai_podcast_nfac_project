'use client';
import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import Link from 'next/link';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const clearMessages = () => {
      localStorage.removeItem('chatMessages');
    };
    window.addEventListener('beforeunload', clearMessages);
    return () => {
      window.removeEventListener('beforeunload', clearMessages);
    };
  }, []);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    try {
      let fullResponse = '';
      const systemPrompt = { role: 'system', content: 'Сен қазақ тілді қарым-қатынас бойынша психологсың. Пайдаланушылардың сұрақтарына психолог ретінде қазақша жауап бер. Егер сұрақ басқа салада болса, тек қарым-қатынас бойынша сұрақтарға жауап беретініңді айт' }; 
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [systemPrompt, ...messages, userMessage],
        stream: true,
      });

      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: '' }]);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        setMessages(prevMessages => [
          ...prevMessages.slice(0, -1),
          { role: 'assistant', content: fullResponse }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Извините, произошла ошибка. Попробуйте еще раз.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cover bg-[url('/project_images/background.jpg')] min-h-screen">
  <div className="flex flex-col min-h-screen w-full sm:w-[90%] md:w-[80%] mx-auto">
    <header className="text-black p-4 bg-opacity-80">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">SyrlasuAI Chat</h1>
        <Link href="/" className="bg-primary text-white p-2 rounded-lg text-sm sm:text-base">
          Басты бет
        </Link>
      </div>
    </header>
    <main className="flex-grow bg-white bg-opacity-50 p-4 overflow-y-auto rounded-lg my-4 max-h-[calc(100vh-200px)]">
      {messages.map((message, index) => (
        <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          <span className={`inline-block p-2 sm:p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200'} text-sm sm:text-base`}>
            {message.content}
          </span>
        </div>
      ))}
      {isLoading && <div className="text-center text-sm sm:text-base">...</div>}
    </main>
    <footer className="bg-white bg-opacity-50 border-t p-2 sm:p-4 rounded-lg mb-4">
      <div className="container mx-auto flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          className="flex-grow border rounded-l-lg p-2 text-sm sm:text-base"
          placeholder="Хабарламаңызды жазыңыз..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          className="bg-primary text-white p-2 rounded-r-lg text-sm sm:text-base"
          disabled={isLoading}
        >
          Жіберу
        </button>
      </div>
    </footer>
  </div>
</div>

  );
};

export default ChatPage;
