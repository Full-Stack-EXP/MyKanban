# MyKanban

![Kanban board](https://github.com/user-attachments/assets/c8e90425-c101-43a9-8960-c1ac2a2a5e6e)

## Project Description

MyKanban is a web-based Kanban board application designed to help users organize their personal tasks / manage small projects efficiently / visualize development workflow. It offers a flexible and intuitive interface where tasks can be easily created, updated, and moved across customizable columns representing different stages of progress.

This project serves as a demonstration of my full-stack development skills and practical tool for personal productivity.

**Key Features:**

* Visual board layout
* Drag-and-drop task movement
* Task creation and editing
* Persistent storage (tasks saved)
* Customizable columns

**Technologies Used:**

* Frontend: React, HTML/CSS/JS, @dnd-kit (for drag and drop), Axios
* Backend: Java, Springboot, Spring Web, Spring Data JPA, Hibernate, Spring Security, Lombok, Jackson, JPA
* Database: H2

## Prerequisites

Before you begin, ensure you have the following installed:

**Front-end:**

* Node.js (version 22 or higher)
* npm

**Backend:**

* Java Development Kit (JDK 24 or higher)
* Maven

## Setup and Installation
To set up and run this project locally, follow these steps:

**Clone the repository:**

```bash
git clone https://github.com/Full-Stack-EXP/MyKanban
cd MyKanban
```

**Backend Setup:**

Navigate to the backend directory of the project 
```bash
cd backend
```
Build the backend application using maven
```bash
./mvnw clean install
```

**Front-end Setup:**

Navigate to the front-end directory of the project
```bash
cd frontend
``` 
Install the front-end dependencies using npm
```bash
npm install
```

## How to Run

To run the application locally, you need to start both the backend API server and the front-end development server:

**Start the Backend Server:**

Navigate to the backend directory
```bash
cd backend
```
Run the Spring Boot application
```bash
./mvnw spring-boot:run
```

- The backend server should start on http://localhost:8080

**In another terminal, start the Front-end Development Server:**

Navigate to the front-end directory 
```bash
cd frontend
```
Start the React development server:
```bash
npm run dev
```

- The front-end application should open in your web browser http://localhost:5173

Now you should have both the backend API and the front-end Kanban board application running locally.

## Future Improvements

**Here are some features that could be added in the future:**

- Implement user authentication and authorization.
- Add support for different themes to customize the appearance.
- Allow users to create and manage multiple Kanban boards.
- Add the ability to attach images to cards.
- Develop a sidebar for accessing theme settings, board configurations, user profiles, etc.
- Migrate the database from the current one (likely in-memory or file-based) to a more robust solution like PostgreSQL.
- Add functionality to assign and manage tags for cards.
