import React, { useState } from "react";
import { uploadCSV } from "../../api/passengers";
import { toast } from "react-toastify";
import styles from '../../styles/components/UploadForm.module.css';

const UploadForm = ({ onUploadSuccess, onDeleteAll }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.warning("Please select a file.");
            return
        };

        setLoading(true);
        const timeoutId = setTimeout(() => {
            toast.info("Still uploading... this might take a bit longer ⏳");
        }, 20000);
        try {
            const res = await uploadCSV(file);
            clearTimeout(timeoutId); // clear the warning toast timer if upload finishes in time

            if (res && !res.error) {
                toast.success("CSV uploaded successfully!");
                onUploadSuccess(); // trigger data refresh in Dashboard
            } else {
                toast.error("Upload failed.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} data-testid="upload-form">
            <label className={styles.customFileLabel}>
                📁 Select File
                <input type="file" className={styles.hiddenInput} onChange={(e) => setFile(e.target.files[0])} aria-label="File Upload" />
            </label>
            <button type="submit" className={styles.button}>
                {loading ? (
                    <span className={styles.spinner}></span>
                ) : (
                    "Upload CSV"
                )}
            </button>
            <button type="button" onClick={onDeleteAll} className={`${styles.button} ${styles.deleteButton}`} aria-label="Delete All">
                🗑 Delete All
            </button>
        </form>
    );
};

export default UploadForm;