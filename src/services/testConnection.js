import axios from 'axios';

export const testCorsConnection = async () => {
    try {
        console.log('Testing CORS connection to backend...');

        const response = await axios.options('http://localhost:8080/api/v1/Auth/Login', {
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type, Authorization'
            }
        });

        console.log('CORS preflight response:', response.headers);
        return true;
    } catch (error) {
        console.error('CORS test failed:', error.message);
        return false;
    }
};