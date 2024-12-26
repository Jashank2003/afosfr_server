import express from 'express';
import { createOrder } from '../functions/orders.js';

const paymentRouter = express.Router();

paymentRouter.post('/api/order', async (req, res) => {
    try {
        // console.log("payemt.js in payment ", req.body);
        const orderData = req.body;
        const result = await createOrder(orderData); // Execute the logic from orders.js
        console.log("yeh order succesfully created");
        console.log(result);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing the order',
            error: error.message,
        });
    }
});

export default paymentRouter;
