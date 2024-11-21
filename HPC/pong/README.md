# Pong

To play pong in the browser, navigate to `HPC/pong` and install the dependencies via `npm install`.
After installing the dependencies, run the game via `npm run dev` and navigate to the webpage in your browser.

## Container

```bash
podman build . -t "pong:v1.0.0"    
podman run -it -p 5173:5173 "pong:v1.0.0"
```
