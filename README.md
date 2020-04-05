# FitPro

## Phase 1
To run the frontend for Phase 1:

- `git clone https://github.com/csc309-winter-2020/team35/ && cd team35`
- `cd app && npm install && npm start`

Note that user and user2 represent the authorization levels of "Client" and "Trainer" respectively (as opposed to "standard" and "admin"). 

## Development
`cd app` or `cd server` then `npm install && npm start`

Or to run the app and the server in the same terminal, use `./run.sh`. If `npm install` hasn't already been run in `app/` and `server/`, use `./run.sh i` to install modules before starting.

## Express routes

- Get /user/:id 
  - Retrieve the user with :id
-Post /user
  - Create a user with the user information in the body
-Patch /user/:id
  - Update a user with :id with user information in the body
-Post /auth/login
  - Login the user with credentials in the body
-Get /events
  - Get all events
-Post /events
  - Create an event with event information in the body
-Get /events/all
  - Get all events relating to a user. 
  - The user token should be provided in the header.
-Get /events/trainer
  - Get all events where the user is the trainer in that event. 
  - The user token should be provided in the header.
-Get /events/client
  - Get all events where the user is the client in that event. 
  - The user token should be provided in the header.
-Patch /events
  - Update an event. The updated information should be in the body.
-Post /workouts
  - Create a new workout.
  - The workout information should be in the body.
-Get /workouts
  - Fetch workouts that I created.
  - The user token should be provided in the header.
-Get /workouts
  - Fetch a workout by id.
  - The workout id should be in the query.
-Patch /workouts
  - Update a workout.
  - The new information should be in the body.
-Get /trainers
  - Retrieve a list of trainers.
-Get /mail
  - Get mail belonging to the user.
  - The user token should be provided in the header.
-Post /mail
  - Create a mail.
  - The relevant information should be in the body.
  - The user token should be provided in the header.
-Post /users/:id/client
  - Add a user :id to the client list of a user.
  - The user token should be provided in the header.
