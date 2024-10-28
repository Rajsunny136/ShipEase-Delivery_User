// let env: any = "dev"; // Declare and initialize env before usage

interface Config_Interface {
    API_DOMAIN_URL: string;
    GOOGLE_API_KEY: string;
    SOCKET_IO_URL: string;
}

class Config implements Config_Interface {
    API_DOMAIN_URL: string = "";
    GOOGLE_API_KEY: string = "";
    SOCKET_IO_URL: string = "";
    constructor() { }
}

const config: Config = new Config();

let env = process.env.NODE_ENV || "development"; // Using NODE_ENV to determine the environment

// Set the values based on the environment
if (env === "production") {
    config.API_DOMAIN_URL = "https://ship.genamplifysol.com"; // Backend URL for production
    config.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ""; // Set your Google API key here
    config.SOCKET_IO_URL = "https://ship.genamplifysol.com";
} else {
    config.API_DOMAIN_URL = "http://192.168.125.200:3000"; // Development URL
    config.GOOGLE_API_KEY = "AIzaSyA9qviqi7tO8nndT6WAP_O5qr3NrfpILl0";
    config.SOCKET_IO_URL = "http://192.168.125.200:3000"; // Development Socket URL
}

export default config;

export const origin = env === "production" ? "https://ship.genamplifysol.com" : "http://192.168.125.200:3000";
export const userCookie = "userToken";