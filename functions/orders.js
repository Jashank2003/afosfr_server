import { Cashfree } from "cashfree-pg";
import dotenv from "dotenv";
dotenv.config();


export async function createOrder(orderData) {

  const restaurant_id = orderData.restaurant_id;
  console.log("restaurant_id in orders ", restaurant_id);
  //Get the cashfree cred from restaurantId
  //fetch the encrypted data from db
  //and decrypt it
  
  Cashfree.XClientId = process.env.CASH_FREE_XClientId;
  Cashfree.XClientSecret = process.env.CASH_FREE_XClientSecret;
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
  console.log("orderData in orders ", orderData);
  const request = {
    
    // "restaurant_id": orderData.restaurant_id,
    "order_amount": `${orderData.order_amount}`,
    "order_currency": "INR",
    "customer_details": {
      "customer_id": orderData.cust_id,
      "customer_name": orderData.cust_name,
      "customer_email": orderData.cust_email,
      "customer_phone": orderData.cust_phone
    },
    // "order_meta": {
    //   "notify_url": "https://webhook-test.com/8b3583d7114e25ce489fca1d5ce0a59e"
    // },
    "order_note": ""
  };

  try {
    const response = await Cashfree.PGCreateOrder("2023-08-01", request); // Await the Cashfree promise
    const data = response.data;
    // console.log(data);
    return data; // Return the result of the promise
  } catch (error) {
    console.error('Error setting up order request:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error if you want it to be handled by the caller
  }
}

