# Overview

The Arduino acts as one of the realtime control units found in a classical distributed architecture. This ECU takes input from a joystick via analog and outputs its values to a zonal controller via CAN. 

# Usage

Open up the Arduino IDE and select board ArduinoUno Rev4. Connect the board via USB and simply flash the sketch to the board. The ECU will start up automatically and will send out a CAN message with identifier 0x12 at a 100ms interval. 

# CAN message 
```
VERSION ""

NS_ :
    BA_
    CM_
    VAL_
    BO_TX_BU_
    BA_DEF_DEF_
    BA_DEF_
    BU_BO_REL_
    BU_SG_REL_
    BU_EV_REL_
    ENVVAR_DATA_
    SGTYPE_
    SGTYPE_VAL_
    BA_DEF_SGTYPE_
    SIGTYPE_VALTYPE_
    SIG_GROUP_
    SIG_VALTYPE_
    SIGTYPE_
    BO_TX_BU_ BA_DEF_REL_
    BU_BO_REL_ SG_MUL_VAL_

BS_:
    1 : 500000

BU_: Sensor_Node ECU

BO_ 100 Joystick_Status: 8 Sensor_Node
    SG_ X : 0|8@1+ (1,0) [0|255] "" Sensor_Node
    SG_ Y : 8|8@1+ (1,0) [0|255] "" Sensor_Node
    SG_ Z : 16|1@1+ (1,0) [0|1] "" Sensor_Node

CM_ BO_ 100 "CAN message containing joystick X, Y, and Z switch state";
CM_ SG_ 100 X "Joystick X-Axis position (0-255)";
CM_ SG_ 100 Y "Joystick Y-Axis position (0-255)";
CM_ SG_ 100 Z "Joystick Z switch state (0 or 1)";
```


# Debugging

Debugging can be done via the serial monitor at a baud rate of 115200

# Dependencies

Use the provided .zip file to load the CAN library into your Arduino IDE to use the API's