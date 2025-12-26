'use client';

import { useSearchParams } from 'next/navigation';
import StreamProvider from '@/components/StreamProvider';
import MeetingRoom from '@/components/MeetingRoom';
import { useState, useEffect } from 'react';

export default function MeetingView({ meetingId }: { meetingId: string }) {
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'Anonymous';

    // Ensure userId is stable for the session or derived uniquely if possible.
    // We'll generate a random ID once on mount if we want, or just use name + random suffix.
    // Using useState to keep it stable across re-renders.
    const [userId] = useState(() =>
        name.replace(/[^a-zA-Z0-9_-]/g, '_') + '_' + Math.floor(Math.random() * 100000)
    );

    return (
        <StreamProvider userId={userId} username={name}>
            <MeetingRoom meetingId={meetingId} />
        </StreamProvider>
    );
}
