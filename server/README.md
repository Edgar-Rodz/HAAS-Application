# Flask + MongoDB Web Application


## Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

### 1. Clone the Repository
TBD

### 2. Set Up Environment Variables

Inside the root directory, create a .env file by copying the provided .env.example file:
```bash
cp .env.example .env
```

Open the .env file in a text editor and modify the values if necessary. By default, the settings should work for local development.

### 3. Build and Run the Application with Docker
Make sure the Docker Desktop (or another Docker engine) is running. To build the Docker images and start the containers for both the Flask backend and MongoDB, run the following command:

```bash
docker-compose up --build
```

This command will:
- Build the Docker image for the Flask backend.
- Start the MongoDB service inside a Docker container.
- Set up the necessary volumes to sync your local code changes to the running container.

### 4. Access the Application
Once the application is running, you can access the Flask app in your browser at:

Flask Backend: http://localhost:5000. Right now if you access this url you should see a message "Flask app is running!"

The MongoDB service will be running locally on localhost:27017, but you won't directly access it via a browser. Instead, use the backend API to interact with MongoDB. Or to easily see the contents in the database you can download [MongoDB Compass](https://www.mongodb.com/products/tools/compass) and connect to the database using the url provided in the .env.example (e.g. mongodb://mongodb:27017/testdb).

### 6. Stopping the Application
To stop the running containers, use the following command:

```bash
docker-compose down
```

This will stop and remove the containers but keep the persistent data in the mongodb_data volume.

### 7. Making Changes to the Code
During development, if you make changes to the Flask application code, you do not need to rebuild the Docker containers every time. The changes will automatically reflect in the running container.

However, if you modify dependencies in requirements.txt or change the Dockerfile, you will need to rebuild the containers with:

```bash
docker-compose up --build
```

### Troubleshooting
#### Port Conflicts:
If port 5000 or 27017 is already in use by another application, you can modify the port mappings in .env file



