# SyncSmart Integration Coding Challenge

## Project Overview
This project is a take-home assessment for the SyncSmart Integration Coding Challenge. The goal is to create a NextJS application that integrates with HubSpot's API to manage contacts between two test portals.

## Requirements
1. **Initialize NextJS App**: Use [create-t3-app](https://create.t3.gg/) to initialize a new NextJS app using the "pages" router.
2. **HubSpot Developer Account**: Create a developer account in HubSpot and set up two test portals.
3. **Authentication**: Use "private app tokens" or OAuth for authenticating with HubSpot’s API.
4. **Component Library**: Use [MUI](https://mui.com/material-ui/) as the component library.
5. **TypeScript**: Utilize TypeScript throughout the project.
6. **Fake Data Generation**: Find a library for generating fake data and create a page with a button that generates 100 contacts in one of the test accounts. Each contact should have at least a first name, last name, and email.
7. **Data Transfer**: Create another button that pulls contacts from the first HubSpot portal and creates them in the second HubSpot portal.
8. **Video Recording**: Record and share a video demonstrating the process, results, and work.

## Getting Started
1. **Clone the Repository**: Clone the project repository to your local machine.
2. **Install Dependencies**: Run `npm install` to install all necessary dependencies.
3. **Environment Variables**: Set up environment variables for HubSpot API tokens and other configurations.
4. **Run the App**: Use `npm run dev` to start the development server.

## Usage
- **Generate Contacts**: Navigate to the designated page and click the button to generate 100 fake contacts in the first HubSpot portal.
- **Transfer Contacts**: Click the button to transfer the generated contacts from the first HubSpot portal to the second HubSpot portal.

## Libraries and Tools
- **NextJS**: Framework for building the application.
- **MUI**: Component library for UI elements.
- **TypeScript**: Type-safe language for writing the application.
- **Faker.js**: Library for generating fake data.

## Video Demonstration
A video demonstrating the process, results, and work will be provided separately.

## Conclusion
This project demonstrates the integration of a NextJS application with HubSpot's API, utilizing MUI for UI components and TypeScript for type safety. The application generates and transfers contacts between two HubSpot portals, showcasing the ability to manage data programmatically.