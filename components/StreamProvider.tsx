'use client';

import { ReactNode } from 'react';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { Chat } from 'stream-chat-react';
import { useStreamClients } from '@/hooks/useStreamClients';

interface StreamProviderProps {
    children: ReactNode;
    userId: string;
    username: string;
}

const StreamProvider = ({ children, userId, username }: StreamProviderProps) => {
    const { videoClient, chatClient } = useStreamClients({ userId, username });

    if (!videoClient || !chatClient) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
                <div className="text-xl animate-pulse">Connecting to Stream...</div>
            </div>
        );
    }

    return (
        <StreamVideo client={videoClient}>
            <Chat client={chatClient} theme="messaging dark">
                {children}
            </Chat>
        </StreamVideo>
    );
};

export default StreamProvider;
