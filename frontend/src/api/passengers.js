const API_BASE = "http://localhost:8000/api/v1";

export const uploadCSV = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_BASE}/upload/`, {
        method: "POST",
        body: formData,
    }).then((res) => res.json());
};

export const fetchPassengers = (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/passengers/?${query}`).then((res) => res.json());
};

export const fetchAllPassengers = (filters) => {
    const query = new URLSearchParams(filters).toString();
    return fetch(`${API_BASE}/passengers/all/?${query}`).then((res) => res.json());
};

export const deleteAllPassengers = () => {
    return fetch(`${API_BASE}/passengers/delete_all/`, {
        method: "DELETE",
    }).then((res) => res.json());
};