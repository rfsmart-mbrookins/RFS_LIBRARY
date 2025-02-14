import { Page, Locator, expect } from "@playwright/test";

export class EmployeePage {
  readonly page: Page;
  readonly addEmployeeButton: Locator;
  readonly addEmployeeSection: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly jobInput: Locator;
  readonly deptInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly employeesTable: Locator;
  readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = "http://localhost:8000";
    this.addEmployeeButton = page.locator("#addReaderDonor");
    this.addEmployeeSection = page.locator("#add-employee-section");
    this.firstNameInput = page.locator("#employeeFirstName");
    this.lastNameInput = page.locator("#employeeLastName");
    this.emailInput = page.locator("#employeeEmail");
    this.jobInput = page.locator("#employeeJobTitle");
    this.deptInput = page.locator("#employeeDepartment");
    this.submitButton = page.locator('#addEmployeeForm button[type="submit"]');
    this.cancelButton = page.locator("#cancelAddEmployee");
    this.employeesTable = page.locator("#employeeData");
  }

  async goto() {
    try {
      await this.page.goto(this.baseURL, {
        waitUntil: "networkidle",
        timeout: 15000,
      });
    } catch (error) {
      throw new Error(
        `Failed to load page at ${this.baseURL}. Make sure your application server is running. Error: ${error.message}`
      );
    }
  }

  async openAddEmployeeForm() {
    await this.addEmployeeButton.waitFor({ state: "visible" });
    await this.addEmployeeButton.click();
    await expect(this.addEmployeeSection).toBeVisible();
  }

  async cancelAddEmployeeForm() {
    await this.cancelButton.click();
    await expect(this.addEmployeeSection).toBeHidden();
  }

  async fillEmployeeForm(employeeData: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    department: string;
  }) {
    await this.firstNameInput.fill(employeeData.firstName);
    await this.lastNameInput.fill(employeeData.lastName);
    await this.emailInput.fill(employeeData.email);
    await this.jobInput.fill(employeeData.jobTitle);
    await this.deptInput.fill(employeeData.department);
  }

  async submitEmployeeForm() {
    await this.submitButton.click();
  }

  async addEmployee(employeeData: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    department: string;
  }) {
    await this.openAddEmployeeForm();
    await this.fillEmployeeForm(employeeData);
    await this.submitEmployeeForm();

    try {
      // Success alert
      const alertMessage = await this.page.waitForEvent("dialog", {
        timeout: 5000,
      });
      await expect(alertMessage.message()).toBe("Employee added successfully!");
      await alertMessage.accept();

      // Hide after submission
      await expect(this.addEmployeeSection).toBeHidden();
    } catch (error) {
      throw new Error(`Failed to add employee: ${error.message}`);
    }
  }

  async verifyEmployeeInTable(employeeData: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    department: string;
  }) {
    try {
      const employeeRow = this.employeesTable.locator(
        `tr:has-text("${employeeData.firstName} ${employeeData.lastName}")`
      );
      await expect(
        employeeRow.locator(`td:has-text("${employeeData.email}")`)
      ).toBeVisible();
      await expect(
        employeeRow.locator(`td:has-text("${employeeData.jobTitle}")`)
      ).toBeVisible();
      await expect(
        employeeRow.locator(`td:has-text("${employeeData.department}")`)
      ).toBeVisible();
    } catch (error) {
      throw new Error(`Failed to verify employee in table: ${error.message}`);
    }
  }

  async verifyRequiredFields() {
    await expect(this.firstNameInput).toHaveAttribute("required", "");
    await expect(this.lastNameInput).toHaveAttribute("required", "");
    await expect(this.emailInput).toHaveAttribute("required", "");
    await expect(this.jobInput).toHaveAttribute("required", "");
    await expect(this.deptInput).toHaveAttribute("required", "");
  }
}
