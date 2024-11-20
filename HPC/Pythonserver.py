import socketio
from kuksa_client.grpc import VSSClient
import time

# Create a Socket.IO client
sio = socketio.Client()

# Define the namespace
NAMESPACE = '/pong'

# Set the initial paddle position
paddle_position = 400  # Starting position (you can adjust this)

# Set the screen width (for boundary checks)
WIDTH = 800
paddle_speed = 10  # Speed at which the paddle moves
# topic to subscribe to for paddle input
topic_name_player_one = 'Vehicle.Cabin.Infotainment.Navigation.Volume'
player_one_value = 0

# Connect event handler for the /pong namespace
@sio.on('connect', namespace=NAMESPACE)
def on_connect():
    print('Connected to /pong namespace!')

# Custom message event handler (for responses from the server)
@sio.on('reply', namespace=NAMESPACE)
def on_reply(data):
    print('Message from server:', data)

# Handle paddle movement
def send_paddle_position(paddle_position):
    sio.emit('paddleMove', {
        'position': paddle_position
    }, namespace=NAMESPACE)


#10.42.0.1
def get_values_player_one(topic_name):
    with VSSClient('127.0.0.1', 55556) as client:

        for updates in client.subscribe_current_values([
            topic_name,
        ]):
            player_one_value = updates[topic_name].value
            send_paddle_position(player_one_value)
            print(f"Received update: {player_one_value}")

if __name__ == "__main__":

    try:
        sio.connect('http://127.0.0.1:3000', namespaces=[NAMESPACE])  # Replace with your server URL
        print('Socket.IO client connected!')
    except socketio.exceptions.ConnectionError as e:
        print('Connection failed:', e)

    while True:
        print(player_one_value)
        # get the values for player 1
        get_values_player_one(topic_name_player_one)
        time.sleep(1.0)
