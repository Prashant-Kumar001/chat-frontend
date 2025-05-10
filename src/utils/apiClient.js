import axios from "axios";
class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
    });

    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized! Redirecting to login...");
          window.location.href = "/login"; 
        }
        return Promise.reject(error);
      }
    );
  }

  async request(method, endpoint, data = {}, headers = {}) {
    try {
      const response = await this.client({ method, url: endpoint, data, headers });
      return {
        success: true,
        message: response.data.message,
        user: response.data.data,
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }
}

export default ApiClient;
