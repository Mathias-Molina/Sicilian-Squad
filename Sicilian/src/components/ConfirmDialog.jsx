// components/ConfirmDialog.jsx
export const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-overlay">
            <div className="confirm-box">
                <p>{message}</p>
                <div className="button-group">
                    <button className="yes-button" onClick={onConfirm}>Ja</button>
                    <button className="cancel-button" onClick={onCancel}>Avbryt</button>
                </div>
            </div>
        </div>
    );
};
