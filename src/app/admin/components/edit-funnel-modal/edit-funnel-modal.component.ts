import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  Scene,
  SceneWithPreview,
  WelcomeButton,
  Reminder,
} from '../../store/types/adminState.interface';

@Component({
  selector: 'app-edit-funnel-modal',
  templateUrl: './edit-funnel-modal.component.html',
  styleUrls: ['./edit-funnel-modal.component.scss'],
})
export class EditFunnelModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() scene: SceneWithPreview | null = null;
  @Input() loading: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{scene: Scene, files: {welcomeImage?: File, reminderImages: {[key: number]: File}}}>();

  @ViewChild('welcomeTextRef', { static: false })
  welcomeTextRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChildren('reminderTextRef')
  reminderTextRefs!: QueryList<ElementRef<HTMLTextAreaElement>>;

  sceneForm: FormGroup;

  // Файлы изображений
  welcomeImageFile: File | null = null;
  reminderImageFiles: { [reminderIndex: number]: File | null } = {};
  welcomeImageRemoved: boolean = false; // Флаг для отслеживания удаления изображения

  // Диалог для вставки ссылки
  linkDialogVisible: boolean = false;
  linkUrl: string = '';
  linkText: string = '';
  currentTextareaType: 'welcome' | 'reminder' = 'welcome';
  currentReminderIndex: number = -1;
  selectedTextForLink: string = '';

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.sceneForm = this.fb.group({
      sceneId: ['', [Validators.required]],
      name: [''],
      welcomeText: ['', [Validators.required]],
      welcomeButtons: this.fb.array([]),
      reminders: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.scene) {
      this.loadScene();
    } else {
      this.clearForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scene']) {
      if (this.scene) {
        this.loadScene();
      } else {
        this.clearForm();
      }
    }
  }

  clearForm(): void {
    const welcomeButtonsArray = this.sceneForm.get(
      'welcomeButtons'
    ) as FormArray;
    const remindersArray = this.sceneForm.get('reminders') as FormArray;

    while (welcomeButtonsArray.length !== 0) {
      welcomeButtonsArray.removeAt(0);
    }
    while (remindersArray.length !== 0) {
      remindersArray.removeAt(0);
    }

    this.sceneForm.patchValue({
      sceneId: '',
      name: '',
      welcomeText: '',
    });

    // Очистить файлы изображений
    this.welcomeImageFile = null;
    this.reminderImageFiles = {};
    this.welcomeImageRemoved = false;
  }

  loadScene(): void {
    if (!this.scene) {
      return;
    }

    // Очищаем форму
    const welcomeButtonsArray = this.sceneForm.get(
      'welcomeButtons'
    ) as FormArray;
    const remindersArray = this.sceneForm.get('reminders') as FormArray;

    while (welcomeButtonsArray.length !== 0) {
      welcomeButtonsArray.removeAt(0);
    }
    while (remindersArray.length !== 0) {
      remindersArray.removeAt(0);
    }

    // Загружаем данные сцены
    this.sceneForm.patchValue({
      sceneId: this.scene.sceneId,
      name: this.scene.name || '',
      welcomeText: this.scene.welcomeText,
    });

    // Загружаем URL изображений для отображения
    // Всегда сбрасываем флаг удаления и файл при загрузке сцены
    this.welcomeImageFile = null;
    this.welcomeImageRemoved = false;
    
    // Отладочная информация
    console.log('Loading scene:', this.scene.sceneId);
    console.log('welcomeImageUrl:', this.scene.welcomeImageUrl);

    // Добавляем welcomeButtons
    if (this.scene.welcomeButtons) {
      this.scene.welcomeButtons.forEach((button) => {
        welcomeButtonsArray.push(
          this.fb.group({
            text: [button.text, Validators.required],
            targetSceneId: [button.targetSceneId, Validators.required],
          })
        );
      });
    }

    // Добавляем reminders
    if (this.scene.reminders) {
      this.scene.reminders.forEach((reminder) => {
        const timeParts = this.millisecondsToTimeParts(reminder.timer);
        const reminderForm = this.fb.group({
          timerDays: [timeParts.days, [Validators.required, Validators.min(0)]],
          timerHours: [
            timeParts.hours,
            [Validators.required, Validators.min(0), Validators.max(23)],
          ],
          timerMinutes: [
            timeParts.minutes,
            [Validators.required, Validators.min(0), Validators.max(59)],
          ],
          timerSeconds: [
            timeParts.seconds,
            [Validators.required, Validators.min(0), Validators.max(59)],
          ],
          text: [reminder.text, Validators.required],
          buttons: this.fb.array([]),
        });

        const reminderButtonsArray = reminderForm.get('buttons') as FormArray;
        if (reminder.buttons) {
          reminder.buttons.forEach((button) => {
            reminderButtonsArray.push(
              this.fb.group({
                text: [button.text, Validators.required],
                action: [button.action, Validators.required],
              })
            );
          });
        }

        remindersArray.push(reminderForm);
      });
    }
  }

  getWelcomeButtonsArray(): FormArray {
    return this.sceneForm.get('welcomeButtons') as FormArray;
  }

  addWelcomeButton(): void {
    const buttonsArray = this.getWelcomeButtonsArray();
    buttonsArray.push(
      this.fb.group({
        text: ['', Validators.required],
        targetSceneId: ['', Validators.required],
      })
    );
  }

  removeWelcomeButton(buttonIndex: number): void {
    const buttonsArray = this.getWelcomeButtonsArray();
    buttonsArray.removeAt(buttonIndex);
  }

  getRemindersArray(): FormArray {
    return this.sceneForm.get('reminders') as FormArray;
  }

  addReminder(): void {
    const remindersArray = this.getRemindersArray();
    remindersArray.push(
      this.fb.group({
        timerDays: [0, [Validators.required, Validators.min(0)]],
        timerHours: [
          0,
          [Validators.required, Validators.min(0), Validators.max(23)],
        ],
        timerMinutes: [
          0,
          [Validators.required, Validators.min(0), Validators.max(59)],
        ],
        timerSeconds: [
          0,
          [Validators.required, Validators.min(0), Validators.max(59)],
        ],
        text: ['', Validators.required],
        buttons: this.fb.array([]),
      })
    );
  }

  removeReminder(reminderIndex: number): void {
    const remindersArray = this.getRemindersArray();
    remindersArray.removeAt(reminderIndex);
  }

  getReminderButtonsArray(reminderIndex: number): FormArray {
    const reminderForm = this.getRemindersArray().at(
      reminderIndex
    ) as FormGroup;
    return reminderForm.get('buttons') as FormArray;
  }

  addReminderButton(reminderIndex: number): void {
    const buttonsArray = this.getReminderButtonsArray(reminderIndex);
    buttonsArray.push(
      this.fb.group({
        text: ['', Validators.required],
        action: ['', Validators.required],
      })
    );
  }

  removeReminderButton(reminderIndex: number, buttonIndex: number): void {
    const buttonsArray = this.getReminderButtonsArray(reminderIndex);
    buttonsArray.removeAt(buttonIndex);
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onSave(): void {
    if (this.sceneForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Пожалуйста, заполните все обязательные поля',
      });
      this.sceneForm.markAllAsTouched();
      return;
    }

    // Преобразуем форму в сцену
    const welcomeButtons: WelcomeButton[] = (
      this.sceneForm.get('welcomeButtons') as FormArray
    ).controls.map((buttonControl) => {
      const buttonForm = buttonControl as FormGroup;
      return {
        text: buttonForm.get('text')?.value,
        targetSceneId: buttonForm.get('targetSceneId')?.value,
      };
    });

    const reminders: Reminder[] = (
      this.sceneForm.get('reminders') as FormArray
    ).controls.map((reminderControl, reminderIndex) => {
      const reminderForm = reminderControl as FormGroup;
      const buttons = (reminderForm.get('buttons') as FormArray).controls.map(
        (buttonControl) => {
          const buttonForm = buttonControl as FormGroup;
          return {
            text: buttonForm.get('text')?.value,
            action: buttonForm.get('action')?.value,
          };
        }
      );

      const days = reminderForm.get('timerDays')?.value || 0;
      const hours = reminderForm.get('timerHours')?.value || 0;
      const minutes = reminderForm.get('timerMinutes')?.value || 0;
      const seconds = reminderForm.get('timerSeconds')?.value || 0;
      const timerMs = this.timePartsToMilliseconds(
        days,
        hours,
        minutes,
        seconds
      );

      return {
        timer: timerMs,
        text: reminderForm.get('text')?.value,
        imageUrl: this.scene?.reminders[reminderIndex]?.imageUrl || undefined,
        buttons,
      };
    });

    const scene: Scene = {
      sceneId: this.sceneForm.get('sceneId')?.value,
      name: this.sceneForm.get('name')?.value || undefined,
      welcomeText: this.sceneForm.get('welcomeText')?.value,
      welcomeImageUrl: this.welcomeImageRemoved ? undefined : (this.scene?.welcomeImageUrl || undefined), // Очищаем URL если изображение удалено
      welcomeButtons,
      reminders,
    };

    // Собираем файлы для отправки
    const files: {welcomeImage?: File, reminderImages: {[key: number]: File}} = {
      welcomeImage: this.welcomeImageFile || undefined,
      reminderImages: {}
    };

    // Добавляем файлы изображений напоминаний
    Object.keys(this.reminderImageFiles).forEach(key => {
      const index = parseInt(key);
      if (this.reminderImageFiles[index]) {
        files.reminderImages[index] = this.reminderImageFiles[index]!;
      }
    });

    this.save.emit({scene, files});
  }

  // Конвертация миллисекунд в дни, часы, минуты, секунды
  millisecondsToTimeParts(ms: number): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }

  // Конвертация дней, часов, минут, секунд в миллисекунды
  timePartsToMilliseconds(
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  ): number {
    return (days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  // Получение текущего значения таймера в миллисекундах для отображения
  getCurrentTimerMs(reminderIndex: number): number {
    const reminderForm = this.getRemindersArray().at(
      reminderIndex
    ) as FormGroup;
    const days = reminderForm.get('timerDays')?.value || 0;
    const hours = reminderForm.get('timerHours')?.value || 0;
    const minutes = reminderForm.get('timerMinutes')?.value || 0;
    const seconds = reminderForm.get('timerSeconds')?.value || 0;
    return this.timePartsToMilliseconds(days, hours, minutes, seconds);
  }

  // Форматирование времени для отображения
  formatTimerDisplay(ms: number): string {
    const parts = this.millisecondsToTimeParts(ms);
    const partsArray: string[] = [];

    if (parts.days > 0) partsArray.push(`${parts.days} дн.`);
    if (parts.hours > 0) partsArray.push(`${parts.hours} ч.`);
    if (parts.minutes > 0) partsArray.push(`${parts.minutes} мин.`);
    if (parts.seconds > 0 || partsArray.length === 0)
      partsArray.push(`${parts.seconds} сек.`);

    return partsArray.join(' ') || '0 сек.';
  }

  // Методы форматирования текста для Telegram HTML
  applyFormatting(tag: 'b' | 's' | 'u'): void {
    if (!this.welcomeTextRef) {
      return;
    }

    const textareaElement = this.welcomeTextRef.nativeElement;
    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;
    const selectedText = textareaElement.value.substring(start, end);

    if (!selectedText) {
      return;
    }

    const formattedText = `<${tag}>${selectedText}</${tag}>`;
    const currentValue = textareaElement.value;
    const newValue =
      currentValue.substring(0, start) +
      formattedText +
      currentValue.substring(end);

    textareaElement.value = newValue;
    textareaElement.setSelectionRange(
      start + formattedText.length,
      start + formattedText.length
    );
    textareaElement.focus();

    // Обновляем значение в форме
    const control = this.sceneForm.get('welcomeText');
    if (control) {
      control.setValue(newValue);
    }
  }

  applyFormattingToReminder(reminderIndex: number, tag: 'b' | 's' | 'u'): void {
    const textareaRef = this.reminderTextRefs?.toArray()[reminderIndex];
    if (!textareaRef) {
      return;
    }

    const textareaElement = textareaRef.nativeElement;
    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;
    const selectedText = textareaElement.value.substring(start, end);

    if (!selectedText) {
      return;
    }

    const formattedText = `<${tag}>${selectedText}</${tag}>`;
    const currentValue = textareaElement.value;
    const newValue =
      currentValue.substring(0, start) +
      formattedText +
      currentValue.substring(end);

    textareaElement.value = newValue;
    textareaElement.setSelectionRange(
      start + formattedText.length,
      start + formattedText.length
    );
    textareaElement.focus();

    // Обновляем значение в форме
    const reminderForm = this.getRemindersArray().at(
      reminderIndex
    ) as FormGroup;
    const textControl = reminderForm.get('text');
    if (textControl) {
      textControl.setValue(newValue);
    }
  }

  // Методы для работы со ссылками
  openLinkDialog(type: 'welcome' | 'reminder', reminderIndex?: number): void {
    let textareaElement: HTMLTextAreaElement | null = null;
    let selectedText = '';

    if (type === 'welcome') {
      if (this.welcomeTextRef) {
        textareaElement = this.welcomeTextRef.nativeElement;
        const start = textareaElement.selectionStart;
        const end = textareaElement.selectionEnd;
        selectedText = textareaElement.value.substring(start, end);
      }
    } else if (type === 'reminder' && reminderIndex !== undefined) {
      const textareaRef = this.reminderTextRefs?.toArray()[reminderIndex];
      if (textareaRef) {
        textareaElement = textareaRef.nativeElement;
        const start = textareaElement.selectionStart;
        const end = textareaElement.selectionEnd;
        selectedText = textareaElement.value.substring(start, end);
      }
    }

    this.selectedTextForLink = selectedText;
    this.linkText = selectedText || '';
    this.linkUrl = '';
    this.currentTextareaType = type;
    this.currentReminderIndex =
      reminderIndex !== undefined ? reminderIndex : -1;
    this.linkDialogVisible = true;
  }

  insertLink(): void {
    if (!this.linkUrl.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Введите URL ссылки',
      });
      return;
    }

    const linkText = this.linkText.trim() || this.linkUrl;
    const linkHtml = `<a href="${this.linkUrl}">${linkText}</a>`;

    if (this.currentTextareaType === 'welcome') {
      this.insertLinkToWelcomeText(linkHtml);
    } else {
      this.insertLinkToReminder(linkHtml);
    }

    this.linkDialogVisible = false;
    this.linkUrl = '';
    this.linkText = '';
    this.selectedTextForLink = '';
  }

  private insertLinkToWelcomeText(linkHtml: string): void {
    if (!this.welcomeTextRef) {
      return;
    }

    const textareaElement = this.welcomeTextRef.nativeElement;
    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;

    const currentValue = textareaElement.value;
    const newValue =
      currentValue.substring(0, start) + linkHtml + currentValue.substring(end);

    textareaElement.value = newValue;
    textareaElement.setSelectionRange(
      start + linkHtml.length,
      start + linkHtml.length
    );
    textareaElement.focus();

    const control = this.sceneForm.get('welcomeText');
    if (control) {
      control.setValue(newValue);
    }
  }

  private insertLinkToReminder(linkHtml: string): void {
    if (this.currentReminderIndex === -1) {
      return;
    }

    const textareaRef =
      this.reminderTextRefs?.toArray()[this.currentReminderIndex];
    if (!textareaRef) {
      return;
    }

    const textareaElement = textareaRef.nativeElement;
    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;

    const currentValue = textareaElement.value;
    const newValue =
      currentValue.substring(0, start) + linkHtml + currentValue.substring(end);

    textareaElement.value = newValue;
    textareaElement.setSelectionRange(
      start + linkHtml.length,
      start + linkHtml.length
    );
    textareaElement.focus();

    const reminderForm = this.getRemindersArray().at(
      this.currentReminderIndex
    ) as FormGroup;
    const textControl = reminderForm.get('text');
    if (textControl) {
      textControl.setValue(newValue);
    }
  }

  cancelLinkDialog(): void {
    this.linkDialogVisible = false;
    this.linkUrl = '';
    this.linkText = '';
    this.selectedTextForLink = '';
  }

  // Методы для работы с изображениями
  onWelcomeImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.welcomeImageFile = file;
      this.welcomeImageRemoved = false; // Сбрасываем флаг удаления при загрузке нового файла
    }
    // Очищаем input, чтобы можно было загрузить тот же файл снова
    event.target.value = '';
  }

  onReminderImageSelected(event: any, reminderIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      this.reminderImageFiles[reminderIndex] = file;
    }
  }

  removeWelcomeImage(): void {
    this.welcomeImageFile = null;
    this.welcomeImageRemoved = true; // Помечаем, что изображение удалено
  }

  removeReminderImage(reminderIndex: number): void {
    this.reminderImageFiles[reminderIndex] = null;
  }

  // Получить URL для превью изображения сцены
  getWelcomeImagePreviewUrl(): string | null {
    // Если изображение было удалено, не показываем превью
    if (this.welcomeImageRemoved) {
      return null;
    }
    // Если загружен новый файл, показываем его
    if (this.welcomeImageFile) {
      return URL.createObjectURL(this.welcomeImageFile);
    }
    // Если есть превью из существующей сцены, показываем его
    if (this.scene?.welcomeImagePreviewUrl) {
      return this.scene.welcomeImagePreviewUrl;
    }
    // Если нет превью, но есть URL изображения, используем его
    const imageUrl = this.scene?.welcomeImageUrl;
    if (imageUrl && imageUrl.trim() !== '') {
      return imageUrl;
    }
    return null;
  }

  // Получить URL для превью изображения напоминания
  getReminderImagePreviewUrl(reminderIndex: number): string | null {
    // Если загружен новый файл, показываем его
    if (this.reminderImageFiles[reminderIndex]) {
      return URL.createObjectURL(this.reminderImageFiles[reminderIndex]!);
    }
    // Если есть превью из существующей сцены, показываем его
    if (this.scene?.reminderImagePreviewUrls?.has(reminderIndex)) {
      return this.scene.reminderImagePreviewUrls.get(reminderIndex) || null;
    }
    // Если нет превью, но есть URL изображения, используем его
    if (this.scene?.reminders[reminderIndex]?.imageUrl) {
      return this.scene.reminders[reminderIndex].imageUrl || null;
    }
    return null;
  }
}
