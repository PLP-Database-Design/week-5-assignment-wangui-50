// Import some dependencies/ packages 

// HTTP framework for handling requests
const express = require('express');
//Instance of express framework
const app = express(); 
// DBMS Mysql 
const mysql = require('mysql2');
// Cross Origin Resourse Sharing 
const cors = require('cors');
// Environment variable doc 
const dotenv = require('dotenv'); 

// 
app.use(express.json());
app.use(cors());
dotenv.config(); 

// connection to the database 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

// Check if there is a connection 
db.connect((err) => {
    // If no connection 
    if(err) return console.log("Error connecting to MYSQL");

    //If connect works successfully
    console.log("Connected to MYSQL as id: ", db.threadId); 
}) 

// < YOUR code goes down here 

// Question 1: Retrieve all patients
app.set('view engine' , 'ejs');
app.set('views' , __dirname + '/views');

app.get('/data', (req, res) => {
    //Retrieve data from database
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error Retrieving data')
      } else {
        //Display the records to the browser
        res.render('data' , {results: results});
      }
    });
  });

  // Question 2: Retrieve all providers
  app.set('view engine' , 'ejs');
app.set('views' , __dirname + '/views');

app.get('/providers', (req, res) => {
    //Retrieve data from database
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error Retrieving data')
      } else {
        //Display the records to the browser
        res.render('providers' , {results: results});
      }
    });
  });

  //Question 3: Filtering
  app.set('view engine' , 'ejs');
  app.set('views' , __dirname + '/views');

  app.get('/data', (req, res) => {
    const firstName = req.query.first_name; // Get the first name from the query parameter

    // Handle the case where first name is not provided
    if (!firstName) {
        return res.status(400).send('First name is required');
    }

    // Retrieve data from the database
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            // Render the data.ejs file with the results
            res.render('data', { results: results });
        }
    });
});


// Question 4: Retrieve all providers by their specialty
app.get('/providers', (req, res) => { 
    const specialty = req.query.specialty; // Get the specialty from the query parameter

    // Check if the specialty parameter is provided
    if (!specialty) {
        return res.status(400).send('Specialty is required');
    }

    // Retrieve data from the database
    db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            // Display the records to the browser
            res.render('providers', { results: results });
        }
    });
});

// <Your code goes up there

// Start the server 
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser 
    console.log('Sending message to browser...');
    app.get('/', (req,res) => {
        res.send('Server Started Successfully!');
    });

});