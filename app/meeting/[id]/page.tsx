import MeetingView from './MeetingView';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <MeetingView meetingId={id} />;
}
