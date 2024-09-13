# Document Draggable App

## How to Run

1. Install dependencies:
  ```bash
  npm install
  ```

2. Run the application:
  ```bash
  npm run dev
  ```

3. Open `http://localhost:5173` in your browser.

### Features
- Drag-and-drop to reorder cards.
- Click on any card to view the image in an overlay.
- Press ESC to close the overlay.


# Docker Compose Setup for React Application

This project uses Docker Compose to set up a development environment for a React frontend application.

## Prerequisites

- Docker
- Docker Compose

## Services

### Frontend

- Built from `Dockerfile.frontend`
- Exposed on port 3000
- Source code mounted from `./src` to `/app/src` in the container
- Runs in development mode

## Usage

### Starting the Application

To start the service:
  ```bash
  docker-compose up
  ```

### Accessing the Application

Open your web browser and navigate to:
  ```bash
  http://localhost:3000
  ```


### Stopping the Application

To stop the service:
  ```bash
  docker-compose down
  ```

## Development

- Changes to files in the `./src` directory will be immediately reflected in the running container.
- After modifying the Dockerfile or non-mounted files, rebuild the container:

  ```bash
  docker-compose up --build
  ```

## Notes

- Ensure Docker and Docker Compose are installed on your system.
- `Dockerfile.frontend` should be in the same directory as `docker-compose.yml`.
- This configuration is optimized for development. For production, consider removing volume mounts and adjusting environment variables.