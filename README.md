# Microservices Supply Chain Management System

This repository contains a full-stack supply chain management system built using a microservices architecture. It demonstrates how to handle inventory management, order processing, and asynchronous notifications across distributed systems.

The backend services are developed with Spring Boot and Spring Cloud. Apache Kafka is used for message passing and asynchronous communication. Each service maintains its own isolated PostgreSQL database. The frontend is built as a Single Page Application using React and Vite.

## Architecture and Components

The application follows Domain-Driven Design principles and is structured into the following components:

- Frontend (Port 5173): A React.js dashboard providing the user interface for Inventory, Orders, and live Kafka event monitoring.
- API Gateway (Port 8080): The single entry point for all client requests. It handles routing to appropriate microservices using Spring Cloud Gateway.
- Discovery Server (Port 8761): A Netflix Eureka registry that enables dynamic service discovery and client-side load balancing.
- Inventory Service (Port 8081): Manages product catalogs and stock logic. It is backed by an independent PostgreSQL database.
- Order Service (Port 8082): Orchestrates checkout processes. It uses OpenFeign to synchronously query the Inventory Service for stock availability, saves order data to its own PostgreSQL database, and publishes order events to Kafka.
- Notification Service (Port 8083): Subscribes to the Kafka event stream to process and log outgoing email alerts. This remains completely decoupled from the main checkout flow so that notification failures do not impact order processing.

## Technology Stack

* Backend Framework: Java 21, Spring Boot
* Microservices Infrastructure: Spring Cloud (Netflix Eureka, OpenFeign, Spring Cloud Gateway)
* Message Broker: Apache Kafka
* Database: PostgreSQL, Spring Data JPA / Hibernate
* Frontend: React 19, Vite, standard CSS
* Containerization: Docker, Docker Compose
* Testing: JUnit 5, Spring Boot Test, PIT (Mutation Testing)

## Running the Application Locally

### Prerequisites

- Java 21 or higher
- Node.js and npm
- Docker Desktop
- Apache Maven

### 1. Start Persistent Infrastructure

You need to start Zookeeper, Kafka, and the PostgreSQL database instances first. This is managed by Docker Compose. From the root directory:

```bash
docker compose up -d
```
You can verify the containers are running with the "docker ps" command.

### 2. Start Microservices

Open separate terminal windows and start the Spring Boot services in the exact order below. Wait for each service to fully boot before moving to the next.

1. Discovery Server:
   ```bash
   cd discovery-server
   ./mvnw spring-boot:run
   ```

2. Inventory Service:
   ```bash
   cd inventoryservice
   ./mvnw spring-boot:run
   ```

3. Order Service:
   ```bash
   cd Order-Service
   ./mvnw spring-boot:run
   ```

4. Notification Service:
   ```bash
   cd notification-service
   ./mvnw spring-boot:run
   ```

5. API Gateway:
   ```bash
   cd api-gateway
   ./mvnw spring-boot:run
   ```

### 3. Start the Frontend Application

```bash
cd frontend
npm install
npm run dev
```

## Accessing the Application

- Frontend Application: http://localhost:5173
- Eureka Service Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080

## Testing Instructions

The system includes integration tests that bypass HTTP network layers and test the full application context using an in-memory H2 database.

To execute the backend integration tests for the inventory service:

```bash
cd inventoryservice
./mvnw test
```
