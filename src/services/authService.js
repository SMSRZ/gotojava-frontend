import axios from 'axios';

class AuthService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add token to headers
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && !this.isTokenExpired()) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }

  login(email, password) {
    return axios.post('https://gotojava-backend-production.up.railway.app/auth/login', { email, password });
  }

  register(email, password,fullName) {
    return axios.post('https://gotojava-backend-production.up.railway.app/auth/signup', { email, password, fullName});
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userEmail');
    delete axios.defaults.headers.common['Authorization'];
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  getTokenExpiry() {
    return localStorage.getItem('tokenExpiry');
  }

  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  isTokenExpired() {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= parseInt(expiry);
  }

  isAuthenticated() {
    const token = this.getToken();
    return token && !this.isTokenExpired();
  }

  setToken(token, expiresIn) {
    localStorage.setItem('authToken', token);
    
    // Backend returns expiresIn as milliseconds (3600000 for 1 hour)
    console.log('Backend expiresIn value (in milliseconds):', expiresIn);
    
    // Add milliseconds directly to current time
    const millisecondsFromBackend = parseInt(expiresIn);
    const expiryTime = Date.now() + millisecondsFromBackend;
    
    const expiryDate = new Date(expiryTime);
    const hoursFromNow = Math.floor(millisecondsFromBackend / (1000 * 60 * 60));
    const minutesFromNow = Math.floor(millisecondsFromBackend / (1000 * 60));
    
    console.log(`Token will expire in ${millisecondsFromBackend}ms (${hoursFromNow}h ${minutesFromNow % 60}m)`);
    console.log('Setting token expiry to:', expiryDate);
    
    localStorage.setItem('tokenExpiry', expiryTime);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setUserEmail(email) {
    localStorage.setItem('userEmail', email);
  }

  // Get remaining time until token expires (in minutes)
  getTimeUntilExpiry() {
    const expiry = this.getTokenExpiry();
    if (!expiry) return 0;
    
    const remainingTime = parseInt(expiry) - Date.now();
    return Math.max(0, Math.floor(remainingTime / (1000 * 60)));
  }

  // Auto-refresh token if it's about to expire (within 5 minutes)
  checkAndRefreshToken() {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    if (timeUntilExpiry > 0 && timeUntilExpiry <= 5) {
      // If your backend supports token refresh, implement it here
      console.warn('Token will expire soon. Consider implementing token refresh.');
    }
  }
}

const authService = new AuthService();
export default authService;
