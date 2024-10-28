import axios from 'axios';
import {origin} from './config'
import { userCookie } from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendUserOTP = async (data: any) => {
    console.log(origin);
    const newData = JSON.stringify(data);

    try {
        const response = await axios.post(`${origin}/api/v1/otp/send-otp`, newData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data; // Return the response data directly if the request succeeds.

    } catch (error: any) {
        console.error('Error in sendUserOTP:', error);

        if (error.isAxiosError) {
            if (!error.response) {
                // Network error: No response received from the server.
                return { error: "Unable to connect to the server. Please try again." };
            }

            // Server responded but with an error status code (4xx or 5xx)
            return {
                error: error.response.data?.error || "Server error: Please try again later.",
                status: error.response.status,
            };
        }

        // Handle any other unexpected errors
        return { error: "Unexpected error: Please try again later." };
    }
};

export const verifyUserOTP = async (data: { phone: string; otp: string; orderId: string }) => {
    try {
         
      const response = await axios.post(`${origin}/api/v1/otp/verify-otp`, data, {
        headers: {
          "Content-Type": "application/json",
        
        }
      });
  
      return response.data;
    } catch (error: any) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
      return error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
  };



export const getUserDetails = async (phone: string, token: string) => {
    try {
        const token = await AsyncStorage.getItem('userCookie');console.log(token);
        if(!token) {
            throw new Error(("token not found in async storage"));
            
        }
        const response = await axios({
            method: 'get',
            url: `${origin}/api/v1/user/user-details`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            params: {
                phone
            }
        });
        const responseData = await response.data;
        return responseData;
    } catch (error: any) {
        return error.response.data;
    }
};