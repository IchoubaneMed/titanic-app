import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadForm from "./UploadForm";
import { uploadCSV } from "../../api/passengers";
import { toast } from "react-toastify";

// Mock dependencies
jest.mock("../../api/passengers", () => ({
    uploadCSV: jest.fn(),
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
    },
}));

describe("UploadForm component", () => {
    const onDeleteAll = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /*it("renders file input and buttons", () => {
        // expect(screen.getByLabelText("Select File")).toBeInTheDocument();
        expect(screen.getByText("Upload CSV")).toBeInTheDocument();
        // expect(screen.getByLabelText("Delete All")).toBeInTheDocument();
    });*/

    it("shows a warning if no file is selected", async () => {
        render(<UploadForm onUploadSuccess={jest.fn()} onDeleteAll={jest.fn()} />);
        fireEvent.submit(screen.getByTestId("upload-form"));

        await waitFor(() => {
            expect(toast.warning).toHaveBeenCalledWith("Please select a file.");
        });
    });

    it("uploads CSV and calls onUploadSuccess on success", async () => {
        const mockSuccess = jest.fn();
        const fakeFile = new File(["dummy"], "train.csv", { type: "text/csv" });
        uploadCSV.mockResolvedValue({});

        render(<UploadForm onUploadSuccess={mockSuccess} onDeleteAll={jest.fn()} />);
        const fileInput = screen.getByLabelText(/Select File/i);
        fireEvent.change(fileInput, { target: { files: [fakeFile] } });

        fireEvent.submit(screen.getByTestId("upload-form"));

        await waitFor(() => {
            expect(uploadCSV).toHaveBeenCalledWith(fakeFile);
            expect(toast.success).toHaveBeenCalledWith("CSV uploaded successfully!");
            expect(mockSuccess).toHaveBeenCalled();
        });
    });

    it("shows error toast if upload fails", async () => {
        const fakeFile = new File(["dummy"], "train.csv", { type: "text/csv" });
        uploadCSV.mockResolvedValue({ error: true });

        render(<UploadForm onUploadSuccess={jest.fn()} onDeleteAll={jest.fn()} />);
        fireEvent.change(screen.getByLabelText(/Select File/i), { target: { files: [fakeFile] } });
        fireEvent.submit(screen.getByTestId("upload-form"));

        await waitFor(() => {
            expect(uploadCSV).toHaveBeenCalledWith(fakeFile);
            expect(toast.error).toHaveBeenCalledWith("Upload failed.");
        });
    });

    it("shows toast if exception is thrown", async () => {
        const fakeFile = new File(["dummy"], "train.csv", { type: "text/csv" });
        uploadCSV.mockRejectedValue(new Error("Network error"));

        render(<UploadForm onUploadSuccess={jest.fn()} onDeleteAll={jest.fn()} />);
        fireEvent.change(screen.getByLabelText(/Select File/i), { target: { files: [fakeFile] } });
        fireEvent.submit(screen.getByTestId("upload-form"));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Something went wrong.");
        });
    });

    /*it("calls onDeleteAll when delete button is clicked", () => {
        fireEvent.click(screen.getByLabelText("Delete All"));
        expect(onDeleteAll).toHaveBeenCalled();
    });*/
});
