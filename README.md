# Celonis Labs Challenge

Dear Candidate,

Welcome to the Celonis Labs coding challenge for engineering managers.

This challenge is designed to assess the skills and experience you’ll need to succeed within the Labs engineering team. We encourage you to approach each task thoughtfully and use this opportunity to showcase your best work.

## The situation

We've created an artificial scenario involving a project that was developed by a cowboy coder. The application is a basic user and tenant management system, featuring both an API and a dedicated frontend.

The goal of this challenge is to provide you with an existing codebase—much of the boilerplate and setup work is already done—so that you can demonstrate your skills. Keep in mind, this project is not representative of the work we do at Labs. Instead, it is designed to be simple and accessible, requiring no prior domain knowledge.

As you’ll discover, the codebase is (intentionally) far from perfect.

## Tasks

We recommend using GitHub to complete your tasks.
For each task, create a separate Pull Request, then merge it once complete.
This will allow us to clearly review and understand your changes.

### Task #1: Get the application up and running

The current state of the codebase makes deployment of the application difficult.

Your task is to propose and implement a first step toward improving the deployability of the application.
Do not aim to achieve a fully cloud-native deployment — focus on an initial improvement that lays the groundwork for future progress.

We recommend to provide a containerized application and a docker compose file.
Your solution should be well-documented and reproducible by others.

### Task #2: Schema conformance

The application frequently encounters issues because the data schema is not consistently enforced.
Database queries, the API, and the TypeScript code are contributing to this problem.

Your task is to implement a first step toward improving schema conformance: the introduction of proper input validation on the API level.

Additionally, provide a suggestion of what the ideal solution would look like and outline the steps you would take to fully achieve it.

### Task #3: Propose a Roadmap

The final task is to propose a list of changes to improve the maintainability and organization of the codebase.

For each proposed change:

- Describe the current issue or problem
- Explain the desired outcome
- Provide a brief reasoning for why the change is necessary

If any changes are dependent on others, make sure to note that in your reasoning.

### Constraints

- Set a time limit of **2-3 hours** to complete the challenge.
- You have limited information to work with (only what you find in this project), so feel free to make reasonable interpretations as needed.

### Result

Please submit a response to each of the four tasks outlined above.
For the code tasks, implementation is required, while documentation (in Markdown) is recommended.
We encourage you to create a **separate pull request** for each task in your own GitHub repository.

Once complete, share the results with your recruiter, who will forward them to the Labs engineering team for evaluation.
Following that, there will be a **challenge review interview** where we will discuss your solutions.

## The Project

This project is a small user management system designed for multiple tenants. It consists of three components:

- **[Backend](./backend/):** A Node.js app providing an API to perform the necessary operations.
- **[Frontend](./frontend/):** An Angular application that offers a user-friendly interface for managing users, interacting with the backend API.
- **[Deploy](./deploy/):** Information on how to deploy the project and make it available for use.
