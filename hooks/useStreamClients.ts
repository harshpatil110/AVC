import { useEffect, useState } from "react";
import { StreamVideoClient, Call, StreamVideo } from "@stream-io/video-react-sdk";
import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const useStreamClients = ({
    userId,
    username,
}: {
    userId: string;
    username: string;
}) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const [chatClient, setChatClient] = useState<StreamChat>();

    useEffect(() => {
        if (!userId || !username || !apiKey) return;

        let vClient: StreamVideoClient | null = null;
        let cClient: StreamChat | null = null;

        const initClients = async () => {
            try {
                // Get token
                const response = await fetch("/api/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                });

                if (!response.ok) {
                    console.error("Failed to fetch token");
                    return;
                }

                const { token } = await response.json();

                if (!token) return;

                // Video Client
                vClient = new StreamVideoClient({
                    apiKey,
                    user: {
                        id: userId,
                        name: username,
                        image: `https://getstream.io/random_png/?id=${userId}&name=${username}`,
                    },
                    token,
                });
                setVideoClient(vClient);

                // Chat Client
                cClient = StreamChat.getInstance(apiKey);
                await cClient.connectUser(
                    {
                        id: userId,
                        name: username,
                        image: `https://getstream.io/random_png/?id=${userId}&name=${username}`,
                    },
                    token
                );
                setChatClient(cClient);
            } catch (error) {
                console.error("Error initializing clients:", error);
            }
        };

        initClients();

        return () => {
            // cleanup
            if (vClient) {
                vClient.disconnectUser();
            }
            if (cClient) {
                cClient.disconnectUser();
            }
        };
    }, [userId, username]);

    return { videoClient, chatClient };
};
