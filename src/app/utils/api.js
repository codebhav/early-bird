// src/app/utils/api.js

/**
 * API utility for making requests to the backend
 */
class Api {
	constructor() {
		this.baseUrl =
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
		this.token = null;
	}

	/**
	 * Set authentication token
	 * @param {string} token - JWT token
	 */
	setToken(token) {
		this.token = token;
		if (typeof window !== "undefined") {
			localStorage.setItem("auth_token", token);
		}
	}

	/**
	 * Clear authentication token
	 */
	clearToken() {
		this.token = null;
		if (typeof window !== "undefined") {
			localStorage.removeItem("auth_token");
		}
	}

	/**
	 * Get authentication headers
	 * @returns {Object} - Headers object
	 */
	getHeaders() {
		const headers = {
			"Content-Type": "application/json",
		};

		if (this.token) {
			headers["Authorization"] = `Bearer ${this.token}`;
		}

		return headers;
	}

	/**
	 * Make API request
	 * @param {string} endpoint - API endpoint
	 * @param {Object} options - Request options
	 * @returns {Promise} - API response
	 */
	async request(endpoint, options = {}) {
		const url = `${this.baseUrl}${endpoint}`;
		const headers = this.getHeaders();

		const config = {
			...options,
			headers: {
				...headers,
				...options.headers,
			},
		};

		try {
			const response = await fetch(url, config);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			return data;
		} catch (error) {
			console.error("API Error:", error);
			throw error;
		}
	}

	/**
	 * Request magic link for authentication
	 * @param {string} email - User email
	 * @returns {Promise} - API response
	 */
	async requestMagicLink(email) {
		return this.request("/auth/login", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	}

	/**
	 * Verify magic link token
	 * @param {string} token - Magic link token
	 * @returns {Promise} - API response with user data and JWT
	 */
	async verifyMagicLink(token) {
		const response = await this.request(`/auth/verify?token=${token}`);
		if (response.token) {
			this.setToken(response.token);
		}
		return response;
	}

	/**
	 * Get current user data
	 * @returns {Promise} - API response with user data
	 */
	async getCurrentUser() {
		return this.request("/auth/me");
	}

	/**
	 * Update user profile
	 * @param {Object} userData - User profile data
	 * @returns {Promise} - API response
	 */
	async updateProfile(userData) {
		return this.request("/users/me", {
			method: "PUT",
			body: JSON.stringify(userData),
		});
	}

	/**
	 * Get user assignments
	 * @returns {Promise} - API response with assignments
	 */
	async getAssignments() {
		return this.request("/assignments");
	}

	/**
	 * Create new assignment
	 * @param {Object} assignmentData - Assignment data
	 * @returns {Promise} - API response
	 */
	async createAssignment(assignmentData) {
		return this.request("/assignments", {
			method: "POST",
			body: JSON.stringify(assignmentData),
		});
	}

	/**
	 * Mark assignment as complete
	 * @param {number} assignmentId - Assignment ID
	 * @returns {Promise} - API response
	 */
	async completeAssignment(assignmentId) {
		return this.request(`/assignments/${assignmentId}/complete`, {
			method: "POST",
		});
	}

	/**
	 * Get friends and leaderboard
	 * @returns {Promise} - API response with friends data
	 */
	async getFriends() {
		return this.request("/friends");
	}

	/**
	 * Get leaderboard
	 * @returns {Promise} - API response with leaderboard data
	 */
	async getLeaderboard() {
		return this.request("/friends/leaderboard");
	}

	/**
	 * Send friend invitation
	 * @param {string} email - Friend's email
	 * @returns {Promise} - API response
	 */
	async inviteFriend(email) {
		return this.request("/friends/invite", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	}

	/**
	 * Logout current user
	 * @returns {Promise} - API response
	 */
	async logout() {
		const response = await this.request("/auth/logout", {
			method: "POST",
		});
		this.clearToken();
		return response;
	}
}

// Create and export a singleton instance
const api = new Api();
export default api;
