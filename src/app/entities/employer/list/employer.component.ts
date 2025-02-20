import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployer } from '../employer.model';
import { EntityArrayResponseType, EmployerService } from '../service/employer.service';
import {filter} from "rxjs";
import {ConfirmationService, MessageService} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {EventLogsComponent} from "../../../components/event-logs/event-logs.component";

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
})
export class EmployerComponent implements OnInit {

  employers!: IEmployer[];
  loading = false;

  constructor(
    protected employerService: EmployerService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected messageService: MessageService,
    protected dialogService: DialogService,
  ) {
    this.loading = true;
  }

  trackId = (_index: number, item: IEmployer): number => this.employerService.getEmployerIdentifier(item);

  ngOnInit(): void {
    this.loadAll();
  }

  delete(id: number): void {
    this.confirmationService.confirm({
      header: 'Confirm delete operation',
      message: `Are you sure you want to delete :${id}`,
      accept: () => {
        this.employerService.delete(id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: `Employer is deleted with identifier ${id}`
          });
          this.loadAll();
        });
      }
    });
  }

  loadAll(): void {
    const requestQuery = { with: 'account' };
    this.employerService.query(requestQuery).pipe(
      filter(res => res.ok)
    ).subscribe(res => {
      this.onResponseSuccess(res);
    })
  }

  openHistoryDialog(id: number): void {
    const data = { objectType: 'employers', objectId: id };
    this.dialogService.open(EventLogsComponent, {
      header: 'Employer History',
      data
    });
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.loading = false;
    this.employers = response.body!;
  }

}
