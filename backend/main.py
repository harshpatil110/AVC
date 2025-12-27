import asyncio
import os
import logging
from dotenv import load_dotenv

# Ensure you have installed vision-agents and google-generativeai
from vision_agents import VisionAgent
from vision_agents.llms import GeminiLLM # Adjust based on actual package structure if needed

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    api_key = os.getenv("STREAM_API_KEY")
    api_secret = os.getenv("STREAM_API_SECRET")
    gemini_key = os.getenv("GEMINI_API_KEY")
    call_id = os.getenv("CALL_ID", "default:demo-meeting")

    if not api_key or not api_secret or not gemini_key:
        logger.error("Missing configuration. Check .env")
        return

    # Initialize Agent
    # We use Gemini as the LLM
    llm = GeminiLLM(api_key=gemini_key)
    
    agent = VisionAgent(
        llm=llm,
        id="ai-assistant",
        name="AI Assistant",
        api_key=api_key, 
        api_secret=api_secret
    )

    # Join Call
    logger.info(f"Joining call: {call_id} as AI Assistant")
    # Note: connect_to_call or join_call depends on library version. 
    # Prompt says agent.join_call(call_id)
    session = await agent.join_call(call_id)
    
    # Event Listeners
    # "handle_transcription: Listen to realtime_user_speech_transcription"
    @session.on("realtime_user_speech_transcription") 
    # Or agent.on depending on library. Usually sessions handle events.
    async def handle_transcription(event):
        # event structure: event.text, event.user_id etc.
        # Check library specifics. Assuming implicit structure from prompt.
        
        text = getattr(event, 'text', '')
        speaker = getattr(event, 'user_id', 'unknown')
        
        logger.info(f"Transcription from {speaker}: {text}")
        
        if "hey assistant" in text.lower():
            logger.info("Trigger word detected!")
            
            # Simple prompt construction
            prompt = f"User {speaker} said: {text}. You are a helpful meeting assistant. Answer concisely."
            
            # Generate response
            response_text = await llm.generate(prompt)
            
            # Speak respons
            await session.speak(response_text)
            
            # Send to chat (optional but requested)
            # await session.send_message(response_text)

    logger.info("Agent is running...")
    
    # Keep alive
    try:
        await asyncio.Event().wait()
    except KeyboardInterrupt:
        await session.leave()

if __name__ == "__main__":
    asyncio.run(main())
