import { element, by, ElementFinder } from 'protractor';

export class TicketComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-ticket div table .btn-danger'));
  title = element.all(by.css('jhi-ticket div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class TicketUpdatePage {
  pageTitle = element(by.id('jhi-ticket-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  titleInput = element(by.id('field_title'));
  descriptionInput = element(by.id('field_description'));
  dueDateInput = element(by.id('field_dueDate'));
  dateInput = element(by.id('field_date'));
  statusSelect = element(by.id('field_status'));
  typeSelect = element(by.id('field_type'));
  prioritySelect = element(by.id('field_priority'));

  projectSelect = element(by.id('field_project'));
  assignedToSelect = element(by.id('field_assignedTo'));
  reportedBySelect = element(by.id('field_reportedBy'));
  labelSelect = element(by.id('field_label'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setDueDateInput(dueDate: string): Promise<void> {
    await this.dueDateInput.sendKeys(dueDate);
  }

  async getDueDateInput(): Promise<string> {
    return await this.dueDateInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async setStatusSelect(status: string): Promise<void> {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect(): Promise<string> {
    return await this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }

  async setTypeSelect(type: string): Promise<void> {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect(): Promise<string> {
    return await this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption(): Promise<void> {
    await this.typeSelect.all(by.tagName('option')).last().click();
  }

  async setPrioritySelect(priority: string): Promise<void> {
    await this.prioritySelect.sendKeys(priority);
  }

  async getPrioritySelect(): Promise<string> {
    return await this.prioritySelect.element(by.css('option:checked')).getText();
  }

  async prioritySelectLastOption(): Promise<void> {
    await this.prioritySelect.all(by.tagName('option')).last().click();
  }

  async projectSelectLastOption(): Promise<void> {
    await this.projectSelect.all(by.tagName('option')).last().click();
  }

  async projectSelectOption(option: string): Promise<void> {
    await this.projectSelect.sendKeys(option);
  }

  getProjectSelect(): ElementFinder {
    return this.projectSelect;
  }

  async getProjectSelectedOption(): Promise<string> {
    return await this.projectSelect.element(by.css('option:checked')).getText();
  }

  async assignedToSelectLastOption(): Promise<void> {
    await this.assignedToSelect.all(by.tagName('option')).last().click();
  }

  async assignedToSelectOption(option: string): Promise<void> {
    await this.assignedToSelect.sendKeys(option);
  }

  getAssignedToSelect(): ElementFinder {
    return this.assignedToSelect;
  }

  async getAssignedToSelectedOption(): Promise<string> {
    return await this.assignedToSelect.element(by.css('option:checked')).getText();
  }

  async reportedBySelectLastOption(): Promise<void> {
    await this.reportedBySelect.all(by.tagName('option')).last().click();
  }

  async reportedBySelectOption(option: string): Promise<void> {
    await this.reportedBySelect.sendKeys(option);
  }

  getReportedBySelect(): ElementFinder {
    return this.reportedBySelect;
  }

  async getReportedBySelectedOption(): Promise<string> {
    return await this.reportedBySelect.element(by.css('option:checked')).getText();
  }

  async labelSelectLastOption(): Promise<void> {
    await this.labelSelect.all(by.tagName('option')).last().click();
  }

  async labelSelectOption(option: string): Promise<void> {
    await this.labelSelect.sendKeys(option);
  }

  getLabelSelect(): ElementFinder {
    return this.labelSelect;
  }

  async getLabelSelectedOption(): Promise<string> {
    return await this.labelSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class TicketDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-ticket-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-ticket'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
