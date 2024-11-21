
#include <Arduino.h>
#include <CAN.h>
#include <FastLED.h>  // Include FastLED library

#define NUM_LEDS 8    // Number of LEDs in the chain
#define DATA_PIN 6    // Data pin for LED control

CRGB leds[NUM_LEDS];  // Array to hold LED color data

// Define the analog pin for the joystick's X-axis
const int xPin = A0;  // VRX pin connected to analog pin A0

// Define the analog pin for the joystick's Y-axis
const int yPin = A1;  // VRY pin connected to analog pin A1

// Define the digital pin for the joystick's button/switch
const int swPin = 8;  // SW pin connected to digital pin 8

// Variable to represent a brake signal (custom use-case)
int breakSignal = 0;  // Default value is 0, can be updated based on logic

// Define a static array to hold CAN message data (8 bytes for standard CAN frame)
uint8_t const msg_data[] = {0, 0, 0, 0, 0, 0, 0, 0};  
// Each element represents a byte, initialized to 0

// Variable to store the value read from the X-axis
int xPinVal = 0;  // Will hold values between 0-1023 (from analogRead)

// Boolean flag to check if joystick is pushed to its bottom position
bool isBottom = false;  // Initially false, updated based on joystick state

// Boolean flag to check if joystick is pushed to its top position
bool isUp = false;  // Initially false, updated based on joystick state

void setup() {
    // Initialize Serial for debug
    Serial.begin(115200);
    while (!Serial) {
        delay(1000);
    }
  Serial.println("CAN Joystick");
  //Initialize Joystick
  pinMode(swPin, INPUT_PULLUP);
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);  // Initialize LEDs

  // start the CAN bus at 500 kbps
  if (!CAN.begin(500E3)) {
    Serial.println("Starting CAN failed!");
    while (1);
  }
  
    delay(300);
}

void loop() {
  // try to parse packet
  int packetSize = CAN.parsePacket();
  int msgdata[packetSize];

  if (packetSize) {
    // received a packet
    Serial.print("Received ");

    if (CAN.packetExtended()) {
      Serial.print("extended ");
    }

    if (CAN.packetRtr()) {
      // Remote transmission request, packet contains no data
      Serial.print("RTR ");
    }

    Serial.print("packet with id 0x");
    Serial.print(CAN.packetId(), HEX);

    if (CAN.packetRtr()) {
      Serial.print(" and requested length ");
      Serial.println(CAN.packetDlc());
    } else {
      Serial.print(" and length ");
      Serial.println(packetSize);

      if(CAN.packetId() == 0x13)
      {
        // only print packet data for non-RTR packets
        int i=0;
        while (CAN.available()) {
          Serial.print(i);
          Serial.print(" ");
          msgdata[i] = CAN.read();
          Serial.println(msgdata[i]);
          if(i==0)
          {
            breakSignal = msgdata[i];
          }
          i++;
          }
        Serial.println(" DataEND");
      }
      
    }

    Serial.println();
  }
    // Read the Joystick and convert the values to digital via onboard ADC.
    xPinVal = analogRead(xPin)/4;

    // send packet: id is 11 bits, packet can contain up to 8 bytes of data
    Serial.print("Sending packet ... ");
    CAN.beginPacket(0x12);
    CAN.write(analogRead(xPin)/4);
    CAN.write(analogRead(yPin)/4);
    CAN.write(digitalRead(swPin));
    CAN.endPacket();
    Serial.println("CAN send done");
    
    delay(100);

}
