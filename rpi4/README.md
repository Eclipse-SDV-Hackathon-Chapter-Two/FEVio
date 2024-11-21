# Overview
This folder includes information related to the setup on the Raspberry Pi 4 in the overall architecture.

# Basic settings

## OS Instalation
Raspbian Bookworm (x64) was used as basic OS for the Raspberry Pi 4. The image for the OS can be downloaded and flashed to an SD card on an Ubuntu machine using the tool rpi-imager (installed with `sudo apt install rpi-imager`). It is advisable to use a display with mouse / keyboard for the initial setup.

## Interface Configuration
Run the `sudo raspi-config` command to enable both SSH and the SPI interface. Manually edit the file `/boot/firmware/config.txt` and add the line `dtoverlay=mcp2515-can0,oscillator=12000000,interrupt=25,spimaxfrequency=2000000` after the line `dtparam=spi=on` to enable the RS485 CAN HAT drivers. Make sure that the `can-utils` package is installed by running `sudo apt install can-utils`. Reboot.

## Network configuration
Change the network configuration via the graphical user interface to allow for a local wired connection via Ethernet (set manual IPv4 address with a private IP range, e.g. 192.168.100.20). You also need to setup a hotspot so that other devices can connect to the Raspberry Pi 4 via WiFi. In the GUI you can define an SSID name and password of your choosing. Make sure to edit the hotspot configuration so that it will be automatically activated after booting up: Enable the flag to connect to this connection automatically based on a priority and set a higher priority number than for any other saved connection (e.g. 100). Reboot.

## Start CAN Interface at Boot
Use the file `can_startup.sh` from this folder on the Raspberry Pi 4 to activate the CAN interface at booting. Make sure that this file has the executable flag set (`chmod +x`). For autostarting, you can use the file `/etc/rc.local`, which executes the `can_startup.sh` file - make sure that the file `/etc/rc.local` also has the executable flag set (`chmod +x`) and that it also starts with a proper shebang line for bash (e.g. `#!/bin/bash`). Reboot and verify that the interface called `can0` is up by checking the output of `ifconfig`.

# Installation of the Applications

## Dependencies
```
sudo apt install python3-serial python3-can
```

## Install and start Eclipse Ankaios
```
sudo apt install podman
curl -sfL https://github.com/eclipse-ankaios/ankaios/releases/latest/download/install.sh | bash -
sudo systemctl enable ank-server
sudo systemctl enable ank-agent
sudo systemctl start ank-server
sudo systemctl start ank-agent
sudo reboot
```

## Build can_transceiver image
```
sudo su
cd can_transceiver
podman build . -t can_transceiver
```

Note that the `can_transceiver` will use the entry for `Vehicle.Cabin.Infotainment.Navigation.Volume` to send integer values 0 and 100 via Kuksa.


## Build mqtt_reader image
```
sudo su
cd mqtt_reader
podman build . -t mqtt_reader
```

Note that the `mqtt_reader` will use the entry for `Vehicle.Cabin.Infotainment.Media.Volume` to send integer values 0 and 100 via Kuksa.

## Update Eclipse Ankaios config
Put the contents of the `state.yml` file to `/etc/ankaios/state.yaml`. Reboot.
