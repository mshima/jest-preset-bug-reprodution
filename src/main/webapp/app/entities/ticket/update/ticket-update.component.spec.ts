jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TicketService } from '../service/ticket.service';
import { ITicket, Ticket } from '../ticket.model';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ILabel } from 'app/entities/label/label.model';
import { LabelService } from 'app/entities/label/service/label.service';

import { TicketUpdateComponent } from './ticket-update.component';

describe('Component Tests', () => {
  describe('Ticket Management Update Component', () => {
    let comp: TicketUpdateComponent;
    let fixture: ComponentFixture<TicketUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ticketService: TicketService;
    let projectService: ProjectService;
    let userService: UserService;
    let labelService: LabelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TicketUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TicketUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TicketUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ticketService = TestBed.inject(TicketService);
      projectService = TestBed.inject(ProjectService);
      userService = TestBed.inject(UserService);
      labelService = TestBed.inject(LabelService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Project query and add missing value', () => {
        const ticket: ITicket = { id: 456 };
        const project: IProject = { id: 93697 };
        ticket.project = project;

        const projectCollection: IProject[] = [{ id: 18958 }];
        spyOn(projectService, 'query').and.returnValue(of(new HttpResponse({ body: projectCollection })));
        const additionalProjects = [project];
        const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
        spyOn(projectService, 'addProjectToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ ticket });
        comp.ngOnInit();

        expect(projectService.query).toHaveBeenCalled();
        expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(projectCollection, ...additionalProjects);
        expect(comp.projectsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const ticket: ITicket = { id: 456 };
        const assignedTo: IUser = { id: 87926 };
        ticket.assignedTo = assignedTo;
        const reportedBy: IUser = { id: 47918 };
        ticket.reportedBy = reportedBy;

        const userCollection: IUser[] = [{ id: 13820 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [assignedTo, reportedBy];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ ticket });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Label query and add missing value', () => {
        const ticket: ITicket = { id: 456 };
        const labels: ILabel[] = [{ id: 30804 }];
        ticket.labels = labels;

        const labelCollection: ILabel[] = [{ id: 69681 }];
        spyOn(labelService, 'query').and.returnValue(of(new HttpResponse({ body: labelCollection })));
        const additionalLabels = [...labels];
        const expectedCollection: ILabel[] = [...additionalLabels, ...labelCollection];
        spyOn(labelService, 'addLabelToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ ticket });
        comp.ngOnInit();

        expect(labelService.query).toHaveBeenCalled();
        expect(labelService.addLabelToCollectionIfMissing).toHaveBeenCalledWith(labelCollection, ...additionalLabels);
        expect(comp.labelsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const ticket: ITicket = { id: 456 };
        const project: IProject = { id: 52057 };
        ticket.project = project;
        const assignedTo: IUser = { id: 8136 };
        ticket.assignedTo = assignedTo;
        const reportedBy: IUser = { id: 62330 };
        ticket.reportedBy = reportedBy;
        const labels: ILabel = { id: 50231 };
        ticket.labels = [labels];

        activatedRoute.data = of({ ticket });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ticket));
        expect(comp.projectsSharedCollection).toContain(project);
        expect(comp.usersSharedCollection).toContain(assignedTo);
        expect(comp.usersSharedCollection).toContain(reportedBy);
        expect(comp.labelsSharedCollection).toContain(labels);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ticket = { id: 123 };
        spyOn(ticketService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ticket });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ticket }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ticketService.update).toHaveBeenCalledWith(ticket);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ticket = new Ticket();
        spyOn(ticketService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ticket });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ticket }));
        saveSubject.complete();

        // THEN
        expect(ticketService.create).toHaveBeenCalledWith(ticket);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ticket = { id: 123 };
        spyOn(ticketService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ticket });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ticketService.update).toHaveBeenCalledWith(ticket);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProjectById', () => {
        it('Should return tracked Project primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProjectById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackLabelById', () => {
        it('Should return tracked Label primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLabelById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedLabel', () => {
        it('Should return option if no Label is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedLabel(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Label for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedLabel(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Label is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedLabel(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
