from livekit import rtc
import asyncio

async def main():
    room = rtc.Room()
    await room.connect("wss://progatehackathon-0vilmkur.livekit.cloud", "eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6ImZjMjkxZTI5LTY5ZDQtNDBhZS1hZmNjLTczZjRiNDJjNzRhYSJ9LCJpc3MiOiJBUElWcVhSTHpGZ0czTmkiLCJleHAiOjE3NDI3MDIyNTUsIm5iZiI6MCwic3ViIjoiZDc2NGFhZTgtYzBlMS03MGQxLTQ2MWItZDZmY2MzODEyZmJjIn0.sArA2H1yIZFqvegbz-0j-0lqnASztmYTwNNZGLHlVqI")
    print(f"Connected to room: {room.name}")

    @room.on("track_subscribed")
    def on_track_subscribed(track, publication, participant):
        if track.kind == rtc.TrackKind.KIND_VIDEO:
            print(f"Video track subscribed: {publication.sid}")


asyncio.run(main())