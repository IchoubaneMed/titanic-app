import React from "react";
import { render, screen } from "@testing-library/react";
import PassengerTable from "./PassengerTable";

const mockPassengers = [
    {
        passenger_id: 1,
        name: "John Smith",
        sex: "male",
        age: 30,
        survived: true,
        pclass: 1,
        fare: 100.5,
    },
    {
        passenger_id: 2,
        name: "Jane Doe",
        sex: "female",
        age: null,
        survived: false,
        pclass: 3,
        fare: 15.0,
    },
];

describe("PassengerTable", () => {
    beforeEach(() => {
        render(<PassengerTable passengers={mockPassengers} />);
    });

    it("renders the table and headers", () => {
        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Sex")).toBeInTheDocument();
        expect(screen.getByText("Age")).toBeInTheDocument();
        expect(screen.getByText("Survived")).toBeInTheDocument();
        expect(screen.getByText("Class")).toBeInTheDocument();
        expect(screen.getByText("Fare")).toBeInTheDocument();
    });

    it("renders passenger data rows correctly", () => {
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.getByText("male")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();
        expect(screen.getByText("Yes")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("100.5")).toBeInTheDocument();

        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
        expect(screen.getByText("female")).toBeInTheDocument();
        expect(screen.getByText("N/A")).toBeInTheDocument(); // null age
        expect(screen.getByText("No")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("15")).toBeInTheDocument();
    });
});
