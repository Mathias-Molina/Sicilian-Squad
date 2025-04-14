import React from 'react'

// src/components/ErrorMessage.jsx
export const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
            {message}
        </div>
    );
};
