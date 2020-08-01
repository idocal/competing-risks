# Competing Risks Model
A Multi State Competing Risks model to predict COVID-19 medical conditions

# Prerequisites
* R >= 4.0
* Node >= 13.0

# Quickstart
First, clone this repository:
```sh
git clone https://github.com/idocal/competing-risks.git
cd competing-risks
```

To start the R server:
```sh
cd server
Rscript serve.R
```

R should mow be listening to port 8000.

To start the client:
```sh
cd client
npm install
npm run start
```

The React server should now be running on port 3000. The website should be available through the browser at: [http://localhost:3000](http://localhost:3000)

# Server Requests
The R server runs 20,000 Monte Carlo simulations for a requested patient and returns:
* Death probability
* Time at hospital quantiles (0.1, 0.25, 0.5, 0.7, 0.9)
* Time at Severe condition in days

Each requests expects:
* Age
* Gender (Male 1 or Female 2)
* Start State Type
* Start State 

Example request:
```sh
curl --data '{"age": 45, "gender": 1, "start_state_type": 3, "start_state": 23}'  "http://localhost:8000/patient"
```