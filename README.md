# Workforce Planning and Automation Platform

A comprehensive platform for managing workforce planning and automation processes.

## Features

- Employee management
- Skillset tracking
- Department and designation management
- Status monitoring (Active, Bench, On Leave, Terminated)
- Contact information management

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MySQL/PostgreSQL with Sequelize ORM
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL/PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit the .env file with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit the .env file with your configuration
```

4. Run migrations
```bash
cd backend
npx sequelize-cli db:migrate
```

5. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 