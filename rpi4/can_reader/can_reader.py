#!/usr/bin/python3
import time
import can
from kuksa_client.grpc import VSSClient
from kuksa_client.grpc import Datapoint

def can_rx(msg: can.Message) -> None:
    # Map value range from 00 to FF to 0 to 100
    mapped_val = int((msg.data[0] / 255) * 100)

    with VSSClient('127.0.0.1', 55555) as client:
        client.set_current_values({'Vehicle.Cabin.Infotainment.Navigation.Volume': Datapoint(mapped_val)})

def main():
    with can.Bus(channel="can0", interface="socketcan") as bus:
        notifier = can.Notifier(bus, [can_rx])

        while True:
            time.sleep(1.0)

        notifier.stop()

if __name__ == "__main__":
    main()
