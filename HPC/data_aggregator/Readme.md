# Overview

The data aggregator is the backend for the game running on the IVI. It subscribes to two topics via the Kuksa client. These two topics represent the value needed to move the paddle in for example the game 'pong'

# Usage
```
python3 data_aggregator.py
```

# Dependencies
```
socketio
kuksa_client
```