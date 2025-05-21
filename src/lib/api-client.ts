const apiClient = {
  get: async (url: string) => {
    const token = localStorage.getItem('accessToken');
    return fetch(`https://simaru.amisbudi.cloud/api${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  post: async (url: string, body: any) => {
    const token = localStorage.getItem('accessToken');
    return fetch(`https://simaru.amisbudi.cloud/api${url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
};

export default apiClient;