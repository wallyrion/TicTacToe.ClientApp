import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, finalize, map, switchMap, tap } from 'rxjs';
import { UserModel } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search-opponent',
  templateUrl: './search-opponent.component.html',
  styleUrls: ['./search-opponent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchOpponentComponent implements OnInit {
  @Output() selected = new EventEmitter<string | undefined>()
  selectedUserId: string | undefined;
  searchOpponentCtrl = new FormControl();
  filteredUsers: UserModel[] = [];
  isLoading = false;

  constructor(
    private readonly userService: UserService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.searchOpponentCtrl.valueChanges
    .pipe(
      debounceTime(500),
      filter(x => !x),
      tap(() => this.filteredUsers = [])
    ).subscribe(() => {
      this.cdr.markForCheck();
    })


    this.searchOpponentCtrl.valueChanges
      .pipe(
        tap(() => {
          this.selected.next(undefined);
          this.searchOpponentCtrl.setErrors(null);
          this.cdr.markForCheck();
        }),
        debounceTime(500),
        map(x => x?.toString().trim() as any as string),
        filter(value => !!value && value.length > 1),
        filter(value => value !== this.selectedUserId),
        tap(() => {
          this.filteredUsers = [];
          this.isLoading = true;
          this.cdr.markForCheck();
        }),
        switchMap(value => this.userService.findOpponent(value)
          .pipe(
            tap(val => {
              if (!val?.length) {
                this.searchOpponentCtrl.setErrors({noResults: true});
              }
              this.isLoading = false
              this.cdr.markForCheck();
            }),
            )),
      )
      .subscribe(data => {
        this.filteredUsers = data;
        this.cdr.markForCheck();
      });
  }

  onSelected() {
    this.selected.next(this.searchOpponentCtrl.value)
    this.selectedUserId = this.searchOpponentCtrl.value;
    console.log('selected ', this.selectedUserId);
  }

  displayFn(id: string | undefined): string {
    if (!id) {
      return ''
    };

    let selectedUser = this.filteredUsers?.find(user => user.id === id);
    return selectedUser?.email || '';
  }

}
