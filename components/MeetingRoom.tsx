'use client';

import {
    Call,
    CallControls,
    SpeakerLayout,
    StreamCall,
    useStreamVideoClient,
    StreamTheme,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import TranscriptPanel from './TranscriptPanel';

export default function MeetingRoom({ meetingId }: { meetingId: string }) {
    const client = useStreamVideoClient();
    const [call, setCall] = useState<Call>();
    const router = useRouter();

    useEffect(() => {
        if (!client) return;

        const myCall = client.call('default', meetingId);

        const joinCall = async () => {
            try {
                await myCall.join({ create: true });
                await myCall.startClosedCaptions(); // Start CC automatically
                setCall(myCall);
            } catch (err) {
                console.error("Failed to join call", err);
            }
        };

        joinCall();

        return () => {
            myCall.leave().catch((err) => console.error("Failed to leave call", err));
            setCall(undefined);
        };
    }, [client, meetingId]);

    if (!call) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
                <div className="text-xl animate-pulse">Joining Meeting...</div>
            </div>
        );
    }

    return (
        <StreamCall call={call}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] h-screen w-full bg-gray-950 overflow-hidden">
                {/* Left Side: Video */}
                <div className="relative flex flex-col h-full overflow-hidden">
                    <div className="flex-1 p-4">
                        <SpeakerLayout />
                    </div>
                    <div className="p-4 flex justify-center pb-8">
                        <CallControls onLeave={() => router.push('/')} />
                    </div>
                </div>

                {/* Right Side: Transcript */}
                <div className="hidden lg:block h-full border-l border-gray-800">
                    <TranscriptPanel />
                </div>
            </div>
        </StreamCall>
    );
}
