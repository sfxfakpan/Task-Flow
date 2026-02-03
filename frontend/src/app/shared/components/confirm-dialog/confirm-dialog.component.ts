import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    @Input() title: string = 'Are you sure?';
    @Input() message: string = 'This action cannot be undone.';
    @Input() confirmText: string = 'Confirm';
    @Input() cancelText: string = 'Cancel';
    @Input() type: 'danger' | 'warning' | 'info' = 'danger';


    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
}