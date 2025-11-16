import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BotStrategy } from '../../store/types/adminState.interface';

@Component({
  selector: 'app-edit-bot-strategy-modal',
  templateUrl: './edit-bot-strategy-modal.component.html',
  styleUrls: ['./edit-bot-strategy-modal.component.scss'],
})
export class EditBotStrategyModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() strategy: BotStrategy | null = null;
  @Input() loading: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{
    strategyId: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
  }>();

  strategyForm: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.strategyForm = this.fb.group({
      name: ['', Validators.required],
      nameEn: ['', Validators.required],
      description: ['', Validators.required],
      descriptionEn: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['strategy'] &&
      changes['strategy'].currentValue &&
      this.strategyForm
    ) {
      const strategy = changes['strategy'].currentValue as BotStrategy;
      this.strategyForm.patchValue({
        name: strategy.name || '',
        nameEn: strategy.nameEn || '',
        description: strategy.description || '',
        descriptionEn: strategy.descriptionEn || '',
      });
    }
  }

  onShow() {
    // Модальное окно открылось
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.strategyForm.reset();
  }

  onSave() {
    if (!this.strategyForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Заполните все обязательные поля',
      });
      return;
    }

    if (!this.strategy) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Стратегия не выбрана',
      });
      return;
    }

    const { name, nameEn, description, descriptionEn } =
      this.strategyForm.value;

    this.save.emit({
      strategyId: this.strategy.strategyId,
      name: name.trim(),
      nameEn: nameEn.trim(),
      description: description.trim(),
      descriptionEn: descriptionEn.trim(),
    });
  }
}
