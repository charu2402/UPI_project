const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Credentials from .env file
const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Initiate UPI Payment Endpoint
app.post('/initiate-upi-payment', async (req, res) => {
    const { amount, vpa } = req.body;

    try {
        const response = await axios.post('https://api.sandbox.co.in/upi/payment', {
            '@entity': 'in.co.sandbox.upi.payment.request',
            amount: amount,
            vpa: vpa,
            currency: 'INR',
            purpose: 'Testing',
            payee_name: 'Test User',
            payee_vpa: vpa,
        }, {
            headers: {
                'accept': 'application/json',
                'Authorization': accessToken,
                'x-api-key': apiKey,
                'x-api-version': '2.0',
                'content-Type': 'application/json'
            }
        });

        res.status(200).json({ message: 'UPI Payment initiated', data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Failed to initiate UPI payment', error: error.response ? error.response.data : error.message });
    }
});


// Verify UPI Payment Endpoint
app.post('/verify-upi-payment', async (req, res) => {
    const { transaction_id } = req.body;

    try {
        const response = await axios.post('https://api.sandbox.co.in/upi/payment/status', {
            '@entity': 'in.co.sandbox.upi.payment.status.request',
            transaction_id: transaction_id
        }, {
            headers: {
                'accept': 'application/json',
                'Authorization': accessToken,
                'x-api-key': apiKey,
                'x-api-version': '2.0',
                'content-Type': 'application/json'
            }
        });

        if (response.data.status === 'Success') {
            res.status(200).json({ message: 'UPI Payment verified successfully', data: response.data });
        } else {
            res.status(400).json({ message: 'UPI Payment verification failed', data: response.data });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to verify UPI payment', error: error.response ? error.response.data : error.message });
    }
});
