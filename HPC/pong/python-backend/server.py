from flask import Flask
from flask_socketio import SocketIO, send, emit

# Initialize Flask app and SocketIO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow CORS for development

# Routes
@app.route("/")
def index():
    return "WebSocket server is running!"

# WebSocket Events
@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@socketio.on("move_paddle")
def handle_move_paddle(data):
    print(f"Received paddle move: {data}")
    # Broadcast updated paddle position to all connected clients
    emit("updatePaddle", data, broadcast=True)

# Run the server
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=3000)
