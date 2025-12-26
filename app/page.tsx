'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    const name = username.trim() || 'Anonymous';
    const meetingId = 'demo-meeting'; 
    router.push(`/meeting/${meetingId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white font-sans">
      <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50">
        <h2 className="text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Enter your name
        </h2>
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-gray-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition border border-gray-700 text-lg placeholder-gray-500"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>
          <button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25"
          >
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
