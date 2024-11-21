#!/usr/bin/python3
import time
import can
from kuksa_client.grpc import VSSClient
from kuksa_client.grpc import Datapoint
from threading import Thread

def can_rx(msg: can.Message) -> None:
    # Map value range from 00 to FF to 0 to 100
    mapped_val = int((msg.data[0] / 255) * 100)

    with VSSClient('127.0.0.1', 55555) as client:
        client.set_current_values({'Vehicle.Cabin.Infotainment.Navigation.Volume': Datapoint(mapped_val)})

def kuksa_rx_thread_func():
    with VSSClient('127.0.0.1', 55555) as client:
        for updates in client.subscribe_current_values(['Vehicle.Cabin.DoorCount', 'Vehicle.Cabin.SeatRowCount']):

            if 'Vehicle.Cabin.DoorCount' in updates:
                player_one_score = updates['Vehicle.Cabin.DoorCount'].value

            if 'Vehicle.Cabin.SeatRowCount' in updates:
                player_two_score = updates['Vehicle.Cabin.SeatRowCount'].value

            with can.Bus(channel="can0", interface="socketcan") as bus:
                msg = can.Message(arbitration_id=0x13, data=[player_one_score, player_two_score], is_extended_id=False)
                print(msg)
                try:
                    bus.send(msg)
                except Exception as e:
                    print("Error sending CAN: " + str(e))

def can_rx_thread_func():
    with can.Bus(channel="can0", interface="socketcan") as bus:
        notifier = can.Notifier(bus, [can_rx])

        while True:
            time.sleep(1.0)

        notifier.stop()

def main():
    can_rx_thread = Thread(target=can_rx_thread_func)
    can_rx_thread.start()

    kuksa_rx_thread = Thread(target=kuksa_rx_thread_func)
    kuksa_rx_thread.start()


if __name__ == "__main__":
    main()
