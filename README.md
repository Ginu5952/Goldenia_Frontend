# 🌟 Goldenia Frontend

A React-based frontend for the Goldenia Wallet app. It allows users to register, log in, top-up their wallet, send transfers, view transactions, and admin users can manage all users and transactions.

## 🚀 Tech Stack

- React (with Vite)
- TailwindCSS for styling
- Axios for API requests
- React Router for routing
- JWT Authentication

## Prerequisites
Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) (for running containers)
- [Docker Compose](https://docs.docker.com/compose/install/) (to manage multi-container apps)



## 📦 Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:
open terminal and run following commands

```bash
git clone https://github.com/Ginu5952/goldenia-wallet-web.git
cd goldenia-wallet-web
code .
```
### 2. Install Dependencies

```
npm install
```

## Run the Application
Once you’ve installed the dependencies, you can start the frontend development server using:

```bash
npm run dev
````
`This will run the frontend on http://localhost:5173. `

## Build and Run the Containers:
Run the following command to build and start both frontend and backend services using Docker Compose:

```
docker-compose up --build
```
`Note You have to run both frontend and backend containers for the app to function correctly. The frontend will communicate with the backend API, and both need to be running simultaneously.

Ensure that the backend is up and running before starting the frontend so the frontend can make API requests to the backend.
`

Access the Application
Once everything is up and running, you can access the frontend application at:
Frontend (UI): http://localhost:5173/