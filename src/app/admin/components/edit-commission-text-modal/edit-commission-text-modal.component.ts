import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Lang } from 'src/app/shared/types/lang.enum';

interface Variable {
  key: string;
  val: string;
  label: string;
}

@Component({
  selector: 'app-edit-commission-text-modal',
  templateUrl: './edit-commission-text-modal.component.html',
  styleUrls: ['./edit-commission-text-modal.component.scss'],
})
export class EditCommissionTextModalComponent
  implements OnChanges, AfterViewInit
{
  @Input() visible: boolean = false;
  @Input() currentTexts: { ru: string; en: string } = { ru: '', en: '' };
  @Input() currentLanguage: string = 'ru';
  @Input() loading: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ text: string; lang: Lang }>();

  @ViewChild('commissionTextarea', { static: false })
  commissionTextarea!: ElementRef<HTMLTextAreaElement>;

  commissionForm: FormGroup;

  languages = [
    { label: 'Русский', value: 'ru' },
    { label: 'English', value: 'en' },
  ];

  variables: Variable[] = [
    { key: '@walletBalance@', val: 'walletBalance', label: 'Баланс кошелька' },
    { key: '@dateStart@', val: 'dateStart', label: 'Дата начала' },
    { key: '@dateEnd@', val: 'dateEnd', label: 'Дата окончания' },
    { key: '@earningsAmount@', val: 'earningsAmount', label: 'Сумма доходов' },
    {
      key: '@commissionAmount@',
      val: 'commissionAmount',
      label: 'Сумма комиссии',
    },
    // { key: '@topUpAmount@', val: 'topUpAmount', label: 'Сумма пополнения' },
    // {
    //   key: '@topUpTokenAmount@',
    //   val: 'topUpTokenAmount',
    //   label: 'Сумма токенов пополнения',
    // },
    // {
    //   key: '@conversionRate@',
    //   val: 'conversionRate',
    //   label: 'Курс конвертации',
    // },
    // { key: '@token@', val: 'token', label: 'Токен' },
    // { key: '@network@', val: 'network', label: 'Сеть' },
    // { key: '@apiName@', val: 'apiName', label: 'Имя API' },
  ];

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.commissionForm = this.fb.group({
      text: ['', Validators.required],
      language: ['ru', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.commissionForm) {
      const patchValue: any = {};

      if (
        changes['currentTexts'] &&
        changes['currentTexts'].currentValue !== undefined
      ) {
        const texts = changes['currentTexts'].currentValue;
        const language = this.currentLanguage || 'en';
        patchValue.text = texts[language as keyof typeof texts] || '';
      }

      if (
        changes['currentLanguage'] &&
        changes['currentLanguage'].currentValue !== undefined
      ) {
        patchValue.language = changes['currentLanguage'].currentValue;
        // Обновляем текст при смене языка
        const language = changes['currentLanguage'].currentValue;
        if (this.currentTexts) {
          patchValue.text =
            this.currentTexts[language as keyof typeof this.currentTexts] || '';
        }
      }

      if (Object.keys(patchValue).length > 0) {
        this.commissionForm.patchValue(patchValue);
      }
    }
  }

  ngAfterViewInit() {
    // Компонент готов к использованию
  }

  onLanguageChange(language: string) {
    this.currentLanguage = language;
    // Обновляем текст при смене языка
    if (this.commissionForm && this.currentTexts) {
      const text =
        this.currentTexts[language as keyof typeof this.currentTexts] || '';
      this.commissionForm.patchValue({
        text: text,
        language: language,
      });
    }
  }

  onShow() {
    // Модальное окно открылось
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onSave() {
    if (!this.commissionForm) {
      return;
    }

    const { text, language } = this.commissionForm.value;
    if (!text || text.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Текст не может быть пустым',
      });
      return;
    }

    if (!language) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Выберите язык',
      });
      return;
    }

    this.save.emit({ text: text.trim(), lang: language as Lang });
  }

  insertVariable(variable: Variable) {
    if (!this.commissionTextarea?.nativeElement) {
      return;
    }

    const textarea = this.commissionTextarea.nativeElement;
    const cursorPosition = textarea.selectionStart || 0;
    const currentText = textarea.value;

    // Вставляем переменную на место курсора
    let insertText = variable.key;

    // Добавляем пробелы если нужно
    const textBefore = currentText.substring(0, cursorPosition);
    const textAfter = currentText.substring(cursorPosition);

    if (textBefore.length > 0 && !textBefore.endsWith(' ')) {
      insertText = ' ' + insertText;
    }
    if (textAfter.length > 0 && !textAfter.startsWith(' ')) {
      insertText = insertText + ' ';
    }

    // Формируем новый текст
    const newText = textBefore + insertText + textAfter;

    // Обновляем форму
    this.commissionForm.patchValue({ text: newText });

    // Устанавливаем курсор после вставленной переменной
    setTimeout(() => {
      const newCursorPosition = cursorPosition + insertText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
}
