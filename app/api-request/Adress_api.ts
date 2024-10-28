import axios from 'axios';
import { origin, userCookie } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem(userCookie);
    if (!token) {
        throw new Error('Token not found in AsyncStorage');
    }
    return token;
};

// Create a new address
export const createAddress = async (data: any) => {
    try {
        const response = await axios.post(`${origin}/api/v1/addresses/create`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error creating address:", error.message);
        return { error: error.response?.data?.message || "An unknown error occurred" };
    }
};

// Update an existing address
export const updateAddress = async (address_id: number, data: any) => {
    try {
        const response = await axios.patch(`${origin}/api/v1/addresses/update/${address_id}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating address:", error.message);
        return { error: error.response?.data?.message || "An unknown error occurred" };
    }
};

// Retrieve an address by ID
export const getAddressesByAddressId = async (address_id: number) => {
    try {
        // Log the address_id being fetched for debugging
        console.log(`Fetching details for address ${address_id}`);

        // Make a GET request to the backend to fetch address details by address_id
        const response = await axios.get(`${origin}/api/v1/addresses/details/${address_id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Log the successful response for debugging
        console.log('Response:', response.data);

        // Return the successful response data
        return { success: true, data: response.data };
    } catch (error: any) {
        // Log detailed error information for debugging
        console.error('Error retrieving address:', error.response?.data || error.message);

        // Return an error response with a custom message if available, or a generic one
        return { success: false, error: error.response?.data?.message || 'An unknown error occurred' };
    }
};



export const getAllAddresses = async () => {
    try {
        const response = await axios.get(`${origin}/api/v1/addresses/`);
        return response.data;
    } catch (error: any) {
        console.error("Error retrieving address:", error.message);
        return { error: error.response?.data?.message || "An unknown error occurred" };
    }
};
// Delete an address by ID
export const deleteAddress = async (address_id: number) => {
    try {
        const response = await axios.delete(`${origin}/api/v1/addresses/delete/${address_id}`);
        return response.data;
    } catch (error: any) {
        console.error("Error deleting address:", error.message);
        return { error: error.response?.data?.message || "An unknown error occurred" };
    }
};

export const getAddressesByUserID = async (user_id: number) => {
    try {
        console.log(`Fetching addresses for user ${user_id}`);
        const response = await axios({
            method: 'get',
            url: `${origin}/api/v1/addresses/user/${user_id}`,
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log('Response:', response.data);

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Error details:', error.response?.data);
        return { success: false, error: error.response?.data?.message || 'An error occurred while fetching addresses' };
    }
};

// Fetch addresses by user ID
export const fetchAddressesByUserid = async (user_id: number) => {
    try {
        const token = await getAuthToken();
        const response = await axios({
            method: 'get',
            url: `${origin}/api/v1/addresses/user/${user_id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.data && response.data.addresses.length > 0) {
            return response.data.addresses;
        } else {
            return []; // Return empty array if no addresses are found
        }
    } catch (error: any) {
        console.error('Error fetching addresses:', error.message);
        return { error: error.response?.data?.message || "An unknown error occurred" };
    }
};

// Update address by user ID
export const updateAddressByUser_id = async (
    user_id: number,
    house_number: string,
    apartment: string,
    landmark: string,
    city: string,
    state: string,
    zipcode: string,
    country: string,
    alternative_phone_number: string
) => {
    try {
        const response = await axios.patch(`${origin}/api/v1/addresses/update/${user_id}`, {
            house_number,
            apartment,
            landmark,
            city,
            state,
            zipcode,
            country,
            alternative_phone_number,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};


export const getAddressDetailsByAddressId = async (address_id: number) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${origin}/api/v1/addresses/details/${address_id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching address details:', error.message);
        return { error: error.response?.data?.message || 'An unknown error occurred' };
    }
};


