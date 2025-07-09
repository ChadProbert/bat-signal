# Bat Signal

A panic alert web app built for Commissioner Gordon to alert Batman of a crime in progress.

## Features
- **Login** — Secure authentication
- **Send Panic Alert** — Alert Batman of a crime in progress
- **Cancel Alert** — The crime has been resolved
- **Panic History** — View the 10 most recent panic alerts
- **Responsive UI** — Mobile-first, clean interface

## Tech Stack
React + TypeScript + Vite + Tailwind CSS + Axios + React Router + Context API

## Get Started

### Prerequisites
- Node.js
- npm (Node Package Manager)

### Clone the repository
```bash
git clone https://github.com/ChadProbert/bat-signal.git
```

### Installation
```bash
cd bat-signal
# and
npm install
```

### Environment Variables
Create a `.env` file in the project root with the following variables:
```
VITE_API_URL=Replace_with_your_api_url
```

### Running the App
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
# or
yarn build
```

## Environment Variables
Create a `.env` file in the project root with the following variables:
```
VITE_API_URL=Replace_with_your_api_url
```

## Project Structure
- `src/` — Main app source code
  - `components/` — UI components (Panic button, History, etc.)
  - `pages/` — Route pages (Login, Dashboard, NotFound)
  - `auth/` — Authentication context/provider
  - `api/` — API service logic
  - `utils/` — Utility functions