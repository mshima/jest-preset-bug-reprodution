import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Ticket e2e test', () => {
  const ticketPageUrl = '/ticket';
  const ticketPageUrlPattern = new RegExp('/ticket(\\?.*)?$');

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login('admin', 'admin');
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/tickets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/tickets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/tickets/*').as('deleteEntityRequest');
  });

  it('should load Tickets', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ticket');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Ticket').should('exist');
    cy.url().should('match', ticketPageUrlPattern);
  });

  it('should load details Ticket page', function () {
    cy.visit(ticketPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('ticket');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', ticketPageUrlPattern);
  });

  it('should load create Ticket page', () => {
    cy.visit(ticketPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Ticket');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', ticketPageUrlPattern);
  });

  it('should load edit Ticket page', function () {
    cy.visit(ticketPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('Ticket');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', ticketPageUrlPattern);
  });

  it('should create an instance of Ticket', () => {
    cy.visit(ticketPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Ticket');

    cy.get(`[data-cy="title"]`)
      .type('hard hacking withdrawal', { force: true })
      .invoke('val')
      .should('match', new RegExp('hard hacking withdrawal'));

    cy.get(`[data-cy="description"]`)
      .type('Keyboard up Buckinghamshire', { force: true })
      .invoke('val')
      .should('match', new RegExp('Keyboard up Buckinghamshire'));

    cy.get(`[data-cy="dueDate"]`).type('2021-04-20').should('have.value', '2021-04-20');

    cy.get(`[data-cy="date"]`).type('2021-04-20T03:30').invoke('val').should('equal', '2021-04-20T03:30');

    cy.get(`[data-cy="status"]`).select('WONT_IMPLEMENT');

    cy.get(`[data-cy="type"]`).select('FEATURE');

    cy.get(`[data-cy="priority"]`).select('HIGH');

    cy.setFieldSelectToLastOfEntity('project');

    cy.setFieldSelectToLastOfEntity('assignedTo');

    cy.setFieldSelectToLastOfEntity('reportedBy');

    cy.setFieldSelectToLastOfEntity('label');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', ticketPageUrlPattern);
  });

  it('should delete last instance of Ticket', function () {
    cy.visit(ticketPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('ticket').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
