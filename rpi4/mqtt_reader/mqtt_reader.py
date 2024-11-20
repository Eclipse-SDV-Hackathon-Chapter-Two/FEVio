#!/usr/bin/python3
import paho.mqtt.subscribe as subscribe
from kuksa_client.grpc import VSSClient
from kuksa_client.grpc import Datapoint

def mqtt_rx(client, userdata, message):
    value = int(message.payload[0:message.payload.index(b'\x00')].decode("utf-8"))
    with VSSClient('127.0.0.1', 55555) as vssclient:
        vssclient.set_current_values({'Vehicle.Cabin.Infotainment.Media.Volume': Datapoint(value)})

def main():
    subscribe.callback(mqtt_rx, "mqtt_data", hostname="localhost")

if __name__ == "__main__":
    main()
