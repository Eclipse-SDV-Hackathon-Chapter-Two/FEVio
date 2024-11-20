from kuksa_client.grpc import VSSClient
from kuksa_client.grpc import Datapoint
import time

# Define the main function to send speed values
def send_speed_data():
    # Connect to the VSSClient (replace with the correct IP and port)
    with VSSClient('127.0.0.1', 55556) as client:
        # Loop to send speed values from 0 to 99
        for speed in range(0, 100):
            # Set the current value for 'Vehicle.Speed'
            client.set_current_values({
                'Vehicle.Cabin.Infotainment.Navigation.Volume': Datapoint(speed),
            })
            # Print the value being sent
            print(f"Feeding Vehicle.Speed to {speed}")
            # Wait for 1 second before sending the next value
            time.sleep(1)

    print("Finished.")

# Call the main function
if __name__ == "__main__":
    send_speed_data()