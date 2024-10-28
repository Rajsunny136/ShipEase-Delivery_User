import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { userCookie, origin } from "./config";

const getAuthToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem(userCookie);
    if (!token) {
        throw new Error('Token not found in AsyncStorage');
    }
    return token;
};

// Create a new user
export const createUser = async (data: any) => {
    const newData = JSON.stringify(data);
    try {

        const response = await axios({
            method: 'post',
            url: `${origin}/api/v1/userimage/`,
            headers: {
                "Content-Type": "application/json",
            },
            data: newData
        });
        console.log("Response from API:", response); // Log the full response
        return response.data;
    } catch (error: any) {
        console.error("Error in createUser:", error.message);
        console.log("Error response:", error.response); // Log the error response
        return { error: error.response?.data?.message || "An unknown error occurred" };
    }
};

// Get user by ID
export const getUserById = async (id: string) => {
    try {
        const token = await getAuthToken();
        // console.log("Token retrieved:", token); // Log the retrieved token

        const response = await axios({
            method: 'get',
            url: `${origin}/api/v1/user/${id}`, // Ensure `origin` is defined correctly
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        return response.data; // This should contain user details
    } catch (error: any) {
        console.error("Error in getUserById:", error); // Log full error for debugging
        throw new Error(error.response?.data?.message || "An unknown error occurred");
    }
};

export const updateUserById = async (id: string, data: any) => {
    const newData = JSON.stringify(data);
    try {
        const token = await getAuthToken();
        const response = await axios({
            method: 'patch',
            url: `${origin}/api/v1/user/${id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: newData
        });
        console.log('API Response:', response.data); // Log the response for debugging
        return response.data;
    } catch (error: any) {
         console.error('API Error:', error.response?.data?.message || error.message || "An unknown error occurred"); // Log the error for debugging
        return error.response?.data?.message || "An unknown error occurred";
    }
};

// Delete user by ID
export const deleteUserById = async (id: number) => {
    try {
        const token = await getAuthToken();
        const response = await axios({
            method: 'delete',
            url: `${origin}/api/v1/user/${id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data?.message || "An unknown error occurred";
    }
};

// Update user's active status by ID
export const updateUserActiveStatus = async (id: number, active: boolean) => {
    try {
        const token = await getAuthToken();
        const response = await axios({
            method: 'patch',
            url: `${origin}/api/v1/user/${id}/active`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify({ active })
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data?.message || "An unknown error occurred";
    }
};

// Post user details
export const postUserDetails = async (data: any) => {
    try {
        const reqData = JSON.stringify(data);
        const token = await getAuthToken();
        const response = await axios({
            url: `${origin}/api/v1/user_details/post`,
            method: 'post',
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: reqData,
        });
        console.log('Response:', response.data);
        return response.data;  
    } catch (error: any) {
        console.error('Error updating user details:', error.message);
        throw error;  
    }
};




export const getProfileImage = async (id: string) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(
            `${origin}/api/v1/userimage/${id}/profile_image`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,

                },
            }
        );
        return response.data;
    } catch (error: any) {
        // console.error('Error in getProfileImage:', error.message);
        return { error: error.response?.data?.message || "An unknown error occurred" };
    }
};

