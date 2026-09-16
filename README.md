# Crime Investigation Application (CIA)

**Empowering communities through justice and safety.**

CIA is a full-stack crime reporting and case management system designed to modernize how citizens report crimes and how law enforcement tracks, investigates, and resolves them. It combines a secure, role-based backend with a clean, user-friendly frontend to ensure that no lead goes cold.

> "A well-structured database today, for smarter crime-solving tomorrow."

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Frontend Screens](#frontend-screens)
- [Future Roadmap](#future-roadmap)

---

## Overview

Crime is an ever-growing concern in modern society, ranging from street-level offenses to complex cybercrimes, and many incidents still go unreported due to fear or a lack of accessible systems. CIA addresses this gap with a secure, scalable platform where citizens can report crimes, track their case status in real time, and access public safety resources — while investigators get a dedicated dashboard to manage cases, evidence, and criminal records efficiently.

The project covers the full software development lifecycle: requirements gathering, use-case modeling, entity-relationship design, relational schema normalization, backend implementation, and a working frontend — all backed by a relational database with views, stored procedures, and triggers.

## Problem Statement

The system is built to streamline how cases, evidence, and personnel are handled in a modern investigation workflow, enabling:

- Efficient tracking of crimes from report to resolution
- Secure, role-based data management for citizens and investigators
- Categorization and linking of related crime information
- Transparent report and feedback flows to improve investigative outcomes and public trust

## Key Features

### For Citizens (Users)
- **Report a Crime** — Submit detailed crime reports through a structured form; reports are stored securely and routed to investigators.
- **Track Your Case** — Look up a case by ID to check real-time investigation status.
- **Hall of Shame** — Search and view profiles of identified or wanted criminals, promoting public awareness and transparency.
- **Missing People** — Browse profiles of reported missing individuals (name, age, last seen location, description) to aid community-driven search efforts.
- **Amber Alerts** — View active missing-person alerts front and center on the dashboard.
- **Laws & Punishments** — Access simplified legal information and applicable penalties by crime type.
- **Emergency Helplines** — Quick access to categorized emergency and support contact numbers.
- **Feedback** — Rate and comment on how a case was handled to help improve the platform.

### For Investigators
- **Secure Investigator Login** — Authenticated, role-restricted access to sensitive case data.
- **Case Dashboard** — View and manage current and closed cases in an organized, filterable layout.
- **Criminal Lookup** — Search for a criminal by ID to instantly pull their full profile and case history.
- **Case Status Updates** — Update case status (open, in progress, closed, solved, unsolved) as investigations progress.
- **Evidence & Files Management** — Attach, track, and link uploaded evidence files to specific cases.

## System Architecture

The application follows a layered design, moving from requirements to a working product:

1. **Requirements Gathering** — Functional requirements (registration/login, crime reporting, case tracking, role-based dashboards, evidence submission, feedback, helpline integration) and non-functional requirements (security/anonymity, scalability, accessible UI).
2. **Use-Case Modeling** — Two primary actors were identified:
   - **User**: report crimes, track case progress, access helplines/laws, view wanted criminals.
   - **Investigator**: update case details, manage/submit evidence, change case statuses across categories like missing persons, cybercrime, harassment, rape, and gang activity.
3. **Enhanced Entity-Relationship Diagram (EERD)** — Models core entities (`Crime_Case`, `Person`, `Evidence`, `Investigator`, `User`, `Crime_Type`) with role-based specialization, generalized `Person` entities, and crime-specific subtypes.
4. **Relational Schema** — Translates the EERD into normalized tables with defined primary/foreign keys and cardinalities.
5. **Backend & API Layer** — Exposes REST endpoints consumed by the frontend, verified via Postman and browser network inspection.
6. **Frontend** — Role-based dashboards for users and investigators, consuming the backend API.

### Key Design Decisions
- **Generalized `Person` Entity**: `User`, `Investigator`, and `Criminal` share a common `Person` entity, differentiated by a `role` attribute, reducing redundancy.
- **Crime Subtypes**: Specialized tables (`Theft`, `Murder`, `Kidnapping`, `Drug_Trafficking`, `Cyber_Crime`, `Harassment`, `Rape`) link back to a shared `Crime_Type`, enabling detailed, crime-specific data capture without bloating a single table.
- **Files & Evidence Separation**: A dedicated `Files` table tracks user-uploaded evidence independently for cleaner case-to-evidence traceability.
- **Case Tracking**: A `Tracking_Status` table logs status changes over time for full auditability.
- **Contextual Support Tables**: `Laws_Punishment` and `Helpline` tables are linked to crime types and regions to surface relevant legal and emergency information automatically.

## Database Design

### Entities
- **Strong entities**: `User`, `Investigator`, `Crime_Type`, `Crime_Case`, `Evidence`, `Criminal`, `Theft`, `Murder`, `Kidnapping`, `Drug_Trafficking`, `Cyber_Crime`, `Harassment`, `Rape`, `Files`, `Feedback`, `Tracking_Status`
- **Weak entities**: `Helpline`, `Laws_Punishment`

### Relationships
- **Unary**: `criminal – criminal`
- **Binary**: `user – feedback`, `crime_case – evidence`
- **Ternary**: `user – crime_case – investigator`, `user – tracking_status – investigator`
- **Cardinalities modeled**: one-to-one (`CrimeCase – Tracking_Status`), one-to-many (`User – Feedback`, `User – Evidence`), many-to-one (`Criminal – Crime`), and many-to-many (`CrimeCase – Crime`, `Investigator – CrimeCase`)

### Normalization
The schema was deliberately normalized up to **Third Normal Form (3NF)**:

- **1NF** — Atomic fields (e.g., splitting names into first/middle/last), no repeating groups, unique column names, single-valued cells.
- **2NF** — Removed partial dependencies by isolating attributes like `email`/`address` into a dedicated `User` table and `crime_name` into `Crime_Type`.
- **3NF** — Removed transitive dependencies, e.g., ensuring `band` depends only on `investigator_id`, and moving legal information into `laws_and_punishments`.

Further normalization beyond 3NF was intentionally avoided to keep the schema practical — balancing data integrity against query complexity, join performance, and maintainability within the project's scope.

### Database Programmability
- **Views** — e.g., `view_feedback_summary` (aggregated ratings/comments per case) and `view_criminal_records` (joined criminal, person, and case data) for simplified, read-only reporting.
- **Stored Procedures** — e.g., `AddNewCrimeCase` and `UpdateCaseStatus` to encapsulate reusable, consistent business logic.
- **Triggers** — e.g., `trg_increment_case_count` and `trg_decrement_case_count`, which automatically keep an investigator's active case count in sync on insert/delete.
- **DCL** — Dedicated database users and `GRANT`/`REVOKE` privileges restrict access to authorized roles only.

## Tech Stack

**Backend**
- Java with Spring Boot
- Maven
- JDBC & JPA (Hibernate) for database access

**Frontend**
- Next.js / JavaScript
- HTML, CSS
- Thymeleaf (server-side templating)

**Database**
- MySQL (designed and managed via MySQL Workbench)

## Repository Structure

```
Crime-Investigation-Application-CIA/
├── Backend/       # Spring Boot application, REST APIs, JPA entities, DB config
├── Frontend/v4/    # Client application (dashboards, forms, public pages)
├── Images/        # UI screenshots and design assets
└── Scripts/       # SQL scripts (DDL/DML, views, procedures, triggers)
```

## Getting Started

### Prerequisites
- Java 17+ and Maven
- Node.js (for the frontend)
- MySQL Server / MySQL Workbench

### Backend Setup
1. Create a MySQL database (e.g., `cia`).
2. Configure `application.properties` in the Backend project:
   ```properties
   spring.application.name=CrimeInvestigationSystem
   spring.datasource.url=jdbc:mysql://localhost:3306/cia
   spring.datasource.username=<your_db_user>
   spring.datasource.password=<your_db_password>
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
   spring.jpa.show-sql=true
   ```
3. Run the SQL scripts in `Scripts/` to set up tables, views, stored procedures, and triggers (or let Hibernate generate the schema via `ddl-auto=update`).
4. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to `Frontend/v4`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Ensure the frontend's API base URL points to the running backend (default: `http://localhost:8080`).

## Frontend Screens

- **Main Dashboard** — Landing page with Laws & Punishments, Emergency Helplines, and Amber Alerts.
- **Hall of Shame** — Searchable directory of wanted/identified criminals with detailed profile pages.
- **User Login & Dashboard** — Authenticated access to case tracking, crime reporting, missing people, and feedback.
- **Investigator Login & Dashboard** — Authenticated access to current/closed case lists, criminal search, and case status updates.
- **Report a Crime** — Structured crime submission form (type, location, description).
- **Provide Feedback** — Case-linked rating and comment submission.
- **Missing People** — Public directory of missing person reports.

## Future Roadmap

- Integrate AI to predict crime hotspots based on historical trends.
- Add real-time location tracking for mobile incident reporting.
- Enable automated alerts for nearby users during emergencies.
- Add AI-powered facial recognition for suspect identification.
- Expand legal reference modules with more comprehensive laws and sections.
- Link with national databases for criminal background verification.
- Incorporate satellite heat maps to visually track crime-dense areas.

---

*This project bridges the gap between citizens and law enforcement through real-time reporting, searchable criminal records, and active public engagement — laying the foundation for a more responsive, transparent, and technologically advanced approach to crime prevention and resolution.*