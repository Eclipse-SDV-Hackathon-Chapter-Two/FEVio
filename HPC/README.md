# HPC
The HPC is the machine that has high computational power in a vehicle and that is typically also connected to the infotainment system screen.

In this solution architecture, the HPC will run the containers for the `data_aggregator` and the `pong` game to allow the users to play pong on the display using Eclipse Ankaios and Eclipse Kuksa.

# Dependencies

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

## Build data_aggregator image
```
sudo su
cd data_aggregator
podman build . -t data_aggregator
```

Note that the `data_aggregator` will subscribe to the entries for `Vehicle.Cabin.Infotainment.Navigation.Volume` and `Vehicle.Cabin.Infotainment.Media.Volume` to send integer values 0 and 100 via Kuksa.

## Update Eclipse Ankaios config
Put the contents of the `state.yml` file to `/etc/ankaios/state.yaml` on the HPC. Reboot.
