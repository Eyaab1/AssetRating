# Asset Rating System

A full-stack web application for managing and rating assets, built with Angular and Spring Boot.

## Project Structure

The project is divided into two main parts:
- `frontend/`: Angular-based web application
- `backend/`: Spring Boot REST API

## Technology Stack

### Frontend
- Angular 18
- Angular Material
- Bootstrap 5
- Tailwind CSS
- Chart.js for data visualization
- SweetAlert2 for notifications
- WebSocket support via STOMP

### Backend
- Spring Boot 3.4.3
- Spring Security with JWT authentication
- Spring Data JPA
- PostgreSQL Database
- WebSocket support
- Spring Mail for email functionality
- Lombok for reducing boilerplate code

## Prerequisites

- Java 17 or higher
- Node.js and npm
- PostgreSQL database
- Maven

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure your database connection in `application.properties`

3. Build the project:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:4200`

## Features

- User authentication and authorization
- Asset management and rating system
- Email notifications
- Data visualization with charts
- Responsive design
- RESTful API architecture

## Development

### Backend Development
- Uses Spring Boot for rapid development
- JPA for database operations
- JWT for secure authentication

### Frontend Development
- css for the styling 
- Chart.js for data visualization
- Responsive design with Bootstrap

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 