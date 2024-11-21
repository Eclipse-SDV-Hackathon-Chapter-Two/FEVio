from flask import Flask
from flask_socketio import SocketIO, emit

from threading import Thread
from kuksa_client.grpc import VSSClient

# Set the initial paddle position
paddle_position = 400  # Starting position (you can adjust this)

# Set the screen width (for boundary checks)
WIDTH = 800
paddle_speed = 10  # Speed at which the paddle moves
# topic to subscribe to for paddle input
topic_name_player_one = 'Vehicle.Cabin.Infotainment.Navigation.Volume'
topic_name_player_two = 'Vehicle.Cabin.Infotainment.Media.Volume'
player_one_value = 0
player_two_value = 0

# production IP
ipAddr = '10.42.0.1'

# test IP
testIpAddr = '127.0.0.1'

# production port
port = 55555

# test port for local testing
testPort = 55556

# Initialize Flask app and SocketIO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow CORS for development

# Handle connection
@socketio.on("connect")
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    emit('message', {'data': 'Welcome!'}, to=sid)

# Handle disconnection
@socketio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

# Handle paddle movement
def send_paddle_position(player, value):
    print("send paddle pos")
    emit('paddleMove', {
        'player': player,
        'value': value
    })

def get_values_player_one():
        
    with VSSClient(ipAddr, port) as client:

        for updates in client.subscribe_current_values([
            topic_name_player_one,
        ]):
            global player_one_value
            player_one_value = updates[topic_name_player_one].value
            send_paddle_position(1, player_one_value)
            print(f"Received update player one: {player_one_value}")
        

def get_values_player_two():

    with VSSClient(ipAddr, port) as client:

        for updates in client.subscribe_current_values([
            topic_name_player_two,
        ]):
            global player_two_value
            player_two_value = updates[topic_name_player_two].value
            send_paddle_position(2, player_two_value)
            print(f"Received update player two: {player_two_value}")

def socket_server():
     socketio.run(app, host="0.0.0.0", port=3000)

if __name__ == "__main__":

    # Start a thread to handle player one values.
    p1Thread = Thread(target = get_values_player_one, args = ())
    p1Thread.start()

    p2Thread = Thread(target = get_values_player_two, args = ())
    p2Thread.start()


    socket_server()