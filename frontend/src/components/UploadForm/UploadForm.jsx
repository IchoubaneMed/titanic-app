import React, { useState } from "react";
import { uploadCSV } from "../../api/passengers";
import { toast } from "react-toastify";
import styles from '../../styles/components/UploadForm.module.css';

const UploadForm = ({ onUploadSuccess, onDeleteAll }) => {
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.warning("Please select a file.");
            return
        };
        try {
            const res = await uploadCSV(file);
            if (res && !res.error) {
                toast.success("CSV uploaded successfully!");
                onUploadSuccess(); // trigger data refresh in Dashboard
            } else {
                toast.error("Upload failed.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.customFileLabel}>
                📁 Select File
                <input type="file" className={styles.hiddenInput} onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <button type="submit" className={styles.button}>Upload CSV</button>
            <button type="button" onClick={onDeleteAll} className={`${styles.button} ${styles.deleteButton}`}>
                🗑 Delete All
            </button>
        </form>
    );
};

export default UploadForm;