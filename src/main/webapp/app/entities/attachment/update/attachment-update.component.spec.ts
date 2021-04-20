jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AttachmentService } from '../service/attachment.service';
import { IAttachment, Attachment } from '../attachment.model';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';

import { AttachmentUpdateComponent } from './attachment-update.component';

describe('Component Tests', () => {
  describe('Attachment Management Update Component', () => {
    let comp: AttachmentUpdateComponent;
    let fixture: ComponentFixture<AttachmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let attachmentService: AttachmentService;
    let ticketService: TicketService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AttachmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AttachmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AttachmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      attachmentService = TestBed.inject(AttachmentService);
      ticketService = TestBed.inject(TicketService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Ticket query and add missing value', () => {
        const attachment: IAttachment = { id: 456 };
        const ticket: ITicket = { id: 57956 };
        attachment.ticket = ticket;

        const ticketCollection: ITicket[] = [{ id: 94762 }];
        spyOn(ticketService, 'query').and.returnValue(of(new HttpResponse({ body: ticketCollection })));
        const additionalTickets = [ticket];
        const expectedCollection: ITicket[] = [...additionalTickets, ...ticketCollection];
        spyOn(ticketService, 'addTicketToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        expect(ticketService.query).toHaveBeenCalled();
        expect(ticketService.addTicketToCollectionIfMissing).toHaveBeenCalledWith(ticketCollection, ...additionalTickets);
        expect(comp.ticketsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const attachment: IAttachment = { id: 456 };
        const ticket: ITicket = { id: 61870 };
        attachment.ticket = ticket;

        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(attachment));
        expect(comp.ticketsSharedCollection).toContain(ticket);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const attachment = { id: 123 };
        spyOn(attachmentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: attachment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(attachmentService.update).toHaveBeenCalledWith(attachment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const attachment = new Attachment();
        spyOn(attachmentService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: attachment }));
        saveSubject.complete();

        // THEN
        expect(attachmentService.create).toHaveBeenCalledWith(attachment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const attachment = { id: 123 };
        spyOn(attachmentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(attachmentService.update).toHaveBeenCalledWith(attachment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTicketById', () => {
        it('Should return tracked Ticket primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTicketById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
