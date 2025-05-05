import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Filters from "./Filters";

describe("Filters component", () => {
    const filters = { sex: "", survived: "", pclass: "" };
    const onChangeMock = jest.fn();

    beforeEach(() => {
        render(<Filters filters={filters} onChange={onChangeMock} />);
    });

    it("renders all filter dropdowns", () => {
        expect(screen.getByLabelText("Sex Filter")).toBeInTheDocument();
        expect(screen.getByLabelText("Survival Filter")).toBeInTheDocument();
        expect(screen.getByLabelText("Class Filter")).toBeInTheDocument();
    });

    it("renders correct options in Sex Filter", () => {
        const select = screen.getByLabelText("Sex Filter");
        expect(select).toHaveDisplayValue("All Sexes");
        expect(screen.getByText("Male")).toBeInTheDocument();
        expect(screen.getByText("Female")).toBeInTheDocument();
    });

    it("renders correct options in Survival Filter", () => {
        const select = screen.getByLabelText("Survival Filter");
        expect(select).toHaveDisplayValue("All");
        expect(screen.getByText("Survived")).toBeInTheDocument();
        expect(screen.getByText("Did Not Survive")).toBeInTheDocument();
    });

    it("renders correct options in Class Filter", () => {
        const select = screen.getByLabelText("Class Filter");
        expect(select).toHaveDisplayValue("All Classes");
        expect(screen.getByText("1st")).toBeInTheDocument();
        expect(screen.getByText("2nd")).toBeInTheDocument();
        expect(screen.getByText("3rd")).toBeInTheDocument();
    });

    it("calls onChange when a filter is selected", async () => {
        const sexSelect = screen.getByLabelText("Sex Filter");
        await userEvent.selectOptions(sexSelect, "male");

        expect(onChangeMock).toHaveBeenCalled();
        const event = onChangeMock.mock.calls[0][0];
        expect(event.target.name).toBe("sex");
        expect(event.target.value).toBe("");
    });
});
