# Smart Blood Donation Network 🩸

## Project Overview

The **Smart Blood Donation Network** is a Java-based application developed using Spring Boot and MySQL to organize blood donor details, blood requests, donations, and inventory records.

The application includes blood-group compatibility logic to identify suitable donors based on recipient requirements. It uses relational database operations to manage donor, recipient, hospital, donation, and blood inventory information.

## Key Features

- **Donor Management:** Organize donor information, including blood group details.
- **Blood Request Management:** Maintain blood requests and recipient requirements.
- **Blood Group Compatibility:** Identify suitable donors based on recipient blood group requirements.
- **Donation Management:** Organize donation-related records.
- **Blood Inventory Management:** Store and retrieve blood inventory information.
- **Relational Data Management:** Manage donor, recipient, hospital, donation, and inventory records using a relational database.

## Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Java |
| Backend Framework | Spring Boot |
| Database | MySQL |
| Data Access | Spring Data JPA / Hibernate |
| Frontend | React.js, Vite |
| API Communication | REST APIs |
| Version Control | Git, GitHub |

## Project Architecture

The application uses a Java backend built with Spring Boot to handle application logic and database interactions. MySQL stores and manages the project's relational data.

The main functional areas include:

- Donor and recipient information
- Blood requests and donor compatibility checks
- Hospital and donation records
- Blood inventory management

## Getting Started

### Prerequisites

- Java version compatible with the backend
- Maven
- MySQL
- Node.js and npm for the frontend

### 1. Clone the Repository

```bash
git clone <your-smart-blood-repository-url>
cd <your-repository-folder>
```

Replace the placeholders with your actual GitHub repository URL and folder name.

### 2. Configure the Database

Review the backend database configuration and update the database URL, username, and password to match your local MySQL setup.

Create the required database if it does not already exist.

### 3. Run the Backend

Open a terminal in the project directory and run:

```bash
cd backend
mvn spring-boot:run
```

Check the terminal logs to confirm that the Spring Boot application starts successfully.

### 4. Run the Frontend

Open a separate terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## Project Structure

```text
Smart-Blood-Donation-Network/
├── backend/
│   ├── pom.xml
│   └── src/
├── frontend/
│   ├── package.json
│   └── src/
├── docker-compose.yml
├── .gitignore
└── README.md
```

*This is a simplified overview of the project directory structure.*

## Key Learning Outcomes

- Developed a Java application using Spring Boot.
- Implemented blood-group compatibility logic to support donor matching.
- Worked with relational database operations for blood donation data.
- Organized donor, recipient, hospital, donation, and inventory information.
- Gained practical experience in backend development and database integration.

## Future Improvements

- Add donor search filters based on location and blood group.
- Enhance blood request tracking and donation history.
- Improve blood inventory monitoring.
- Introduce notifications for blood requests and donation updates.

---

*This project demonstrates the use of Java, Spring Boot, and relational database concepts to support blood donation management.*

