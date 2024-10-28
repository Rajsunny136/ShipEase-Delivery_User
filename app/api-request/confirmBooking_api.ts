// bookingApi.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userCookie, origin } from './config'; // Adjust paths as necessary

// Function to get auth token (if needed for protected endpoints)
const getAuthToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem(userCookie);
    if (!token) {
        throw new Error('Token not found in AsyncStorage');
    }
    return token;
};

// Post booking details to the backend
export const createBooking = async (data: any) => {
    const newData = JSON.stringify(data);
    try {
        const response = await axios({
            method: 'post',
            url: `${origin}/api/v1/vehicle-booking`, // Replace with your actual backend URL
            headers: {
                'Content-Type': 'application/json',
                // If the endpoint is protected and requires an auth token, you can add it here:
                // 'Authorization': `Bearer ${await getAuthToken()}`
            },
            data: newData,
        });
        return response.data;
    } catch (error: any) {
        console.error('Error in createBooking:', error.message);
        console.log('Error response:', error.response); // Log the error response
        return { error: error.response?.data?.message || 'An unknown error occurred' };
    }
};
