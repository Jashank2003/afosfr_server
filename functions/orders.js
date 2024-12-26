import { Cashfree } from "cashfree-pg";
import dotenv from "dotenv";
import cryptoJS from "crypto-js";
dotenv.config();

// function decrypt(encryptedData, secret) {
//     const iv = cryptoJS.enc.Hex.parse('00000000000000000000000000000000');
//     const bytes = cryptoJS.AES.decrypt(encryptedData, cryptoJS.enc.Utf8.parse(secret), {
//         iv: iv,
//         mode: cryptoJS.mode.CBC,
//         padding: cryptoJS.pad.Pkcs7
//     });
//     return bytes.toString(cryptoJS.enc.Utf8);
// }

export async function createOrder(orderData) {
  // console.log("orderData in orders ", orderData);
  const restaurant_id = orderData.restaurant_id;
  console.log("restaurant_id in orders ", restaurant_id);
  //Get the cashfree cred from restaurantId
   const getencryptkey = await fetch('https://afosfr-admin-v6lq.vercel.app/api/getcashfreekeys',{
    method:'POST',
    headers:{
      'Content-type':'application/json', 
    },
    body:JSON.stringify({shop_id:restaurant_id})
   })
  //fetch the encrypted data from db
  //and decrypt it
  if(getencryptkey.ok){
    // console.log("i am here");
    const responseBody = await getencryptkey.json(); // Parse the JSON body
  console.log("Response from getencryptkey:", responseBody);

  // const apikey = decrypt(responseBody.apikey, process.env.NEXT_PUBLIC_SECRET_KEY_CF_decrypt);
  // const apisecret = decrypt(responseBody.apisecret, process.env.NEXT_PUBLIC_SECRET_KEY_CF_decrypt);
     const apikey = responseBody.apikey;
     const apisecret = responseBody.apisecret;
  // console.log("Decrypted apikey and apisecret:", apikey, apisecret);

    if (!apikey || !apisecret) {
      throw new Error("apikey or apisecret is missing or invalid.");
    }
    Cashfree.XClientId = apikey;
    Cashfree.XClientSecret = apisecret;
    Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
  }


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

