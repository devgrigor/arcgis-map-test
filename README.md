# Donor ReMapper

Donor ReMapper is a single page blood donation management system to facilitate the patients from all around the
world, find blood donors near them.

## Getting Started

### Prerequisites

- [Node.js and npm](nodejs.org) Node ^6.11.2, npm ^3.10.10

- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

if you have password or different port configured then standard mongo please edit config file at at `server/config/environment/development.js`

- [Angular CLI](https://www.mongodb.org/) -AngularCLI ^1.4.8

- You should have an internet connection for loading maps
### Runing

1. Run `mongod` in a separate shell to keep MongoDB Daemon running

2. Run `npm start` to install and start node server. 
    
    Application will be available at `http://localhost:9050`


## Building

1. Go to client folder `cd client`

2. Change url at `client/src/app/services/http-client.service.ts` to your servers url

3. Build client `ng build`

4. Go back to parent directory `cd ../`

5. Run it in production environment `NODE_ENV=production node ./server`


## Testing

Running `npm test` will run the unit tests with chai.

## Improvement in project
Change architecture of popups-service relationship as it's not good.

Move functions from esri componet to other logic(maybe make esri as pure component with inputs and outputs).

Writing more tests.

## Feedback about the assignment
Assignment was really interesting.

I was not familiar with ArcGis so it took a while.

But overall It was great experience,

