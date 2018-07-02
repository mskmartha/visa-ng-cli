export class QuestionBase<T>{
  questionType: string;
  value: T;
  questionId: string;
  questionLabel: string;
  required: boolean;
  order: number;
  controlType: string;
  options: any[];
  placeHolder: string;
  info: string;
  description: string;
  validation: any;
  jumpLogic: string;
  answers: any[];
  autocomplete: any;
  constructor(options: {
      questionType?: string,
      value?: T,
      questionId?: string,
      questionLabel?: string,
      required?: boolean,
      order?: number,
      controlType?: string,
      options?: any[],
      placeHolder?: string;
      info?: string;
      description?: string;
      validation?: any;
      jumpLogic?: string;
      answers?: any[];
      autocomplete?: any;
    } = {}) {
    this.questionType = options.questionType;
    this.value = options.value;
    this.questionId = options.questionId || '';
    this.questionLabel = options.questionLabel || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.options = options.options;
    this.placeHolder = options.placeHolder;
    this.info = options.info;
    this.description = options.description;
    this.validation = options.validation;
    this.jumpLogic = options.jumpLogic;
    this.answers = options.answers;
    this.autocomplete = options.autocomplete;
  }
}
