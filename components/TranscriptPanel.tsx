'use client';

import { useEffect, useRef, useState } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

interface Transcript {
    speaker: string;
    text: string;
    timestamp: string;
}

export default function TranscriptPanel() {
    const { useCallInstance } = useCallStateHooks();
    const call = useCallInstance();
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!call) return;

        const handleCaption = (event: any) => { // Type 'any' for now, check SDK types
            const caption = event.caption; // Structure depends on SDK event
            if (!caption) return;

            // Usually Stream sends 'call.closed_caption' event
            // event structure: { type: 'call.closed_caption', closed_caption: { user: {...}, text: '...' } }
            // Or might be different. I will assume standard structure or debug.
            // Based on docs: event.closed_caption.text
            // But verify 'caption' vs 'closed_caption'. SDK usually emits 'call.closed_caption'.
        };

        // Correct listener:
        const unsubscribe = call.on('call.closed_caption', (event: any) => {
            // event.closed_caption found in payload
            const cc = event.closed_caption;
            if (cc) {
                setTranscripts((prev) => [
                    ...prev,
                    {
                        speaker: cc.user?.name || cc.user?.id || 'Unknown',
                        text: cc.text,
                        timestamp: new Date(cc.start_time || Date.now()).toLocaleTimeString(),
                    },
                ]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [call]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcripts]);

    return (
        <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800 w-80">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Transcript</h3>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full animate-pulse">
                    LIVE
                </span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {transcripts.length === 0 && (
                    <div className="text-gray-500 text-center text-sm mt-10">
                        Waiting for speech...
                    </div>
                )}
                {transcripts.map((t, i) => (
                    <div key={i} className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="font-medium text-blue-400">{t.speaker}</span>
                            <span>{t.timestamp}</span>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none text-sm text-gray-200 shadow-sm">
                            {t.text}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
