// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let uri='mongodb+srv://admin:admin@cluster0.6tbj6nj.mongodb.net/?retryWrites=true&w=majority'

// Connect to MongoDB Atlas
mongoose.connect(uri, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a MongoDB schema and model
const reservationSchema = new mongoose.Schema({
  labId: String,
  name: String,
  email: String,
  startTime: String,
  endTime: String,
});

const Reservation = mongoose.model('Reservation', reservationSchema);

// API endpoint to save reservation
app.post('/api/reserve', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json({ message: 'Reservation saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// API endpoint to get all reservations
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/export-reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    
    // Convert data to CSV format
    const csvData = reservations.map(reservation => `${reservation.labId},${reservation.name},${reservation.email},${reservation.startTime},${reservation.endTime}`).join('\n');
    
    // Set the appropriate headers for CSV response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=reservations.csv');
    
    // Send the CSV data as the response
    res.status(200).send(csvData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
