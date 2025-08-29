type QuizAttemptProps = {
    completion_status: string;
    createdAt: string;
    id: number;
    questions_exhausted: boolean;
    quizId: number;
    updatedAt: string;
    userId: number;
}

export type QuizAttempFindCreateProps = {
    question: QuestionProps;
    question_attempt_id: number;
    quiz_attempt: QuizAttemptProps;
}

export type QuestionProps = {
    id: number
    question_number: number,
    format: number,
    audio_src: string,
    audio_str : string,
    video_src : string,
    instruction : string,
    display_instruction: boolean,
    prompt : string,
    content : string,
    words_scramble_direction : string,
    answer_key : string,
    score : number,
    show_help : boolean,
    help1 : string,
    help2 : string,
    coding : boolean,
    quizId : number,
    radio : ServerRadioProps,
    speech_recognition : boolean,
    button_cloze_options: string,
    timeout: number
}

export type ServerRadioProps =
  {
    choice_1_text: string
    choice_2_text: string
    choice_3_text: string
    choice_4_text: string
  }

export type QuestionAttemptProps = {
    end_of_quiz: boolean,
    question : QuestionProps,
    question_attempt_id: number
  }

  export interface QuestionAttemptAttributes {
    user_answer: string;
    score: number;
    error_flag: boolean;
    
  }

  export interface UnitProps {
        id: number
        name: string
        unit_number: number
        level: string
        content: string
        subCategoryId: string
        quizzes: {
            id: number
            name: string
            quiz_number: number
            disabled: boolean
            video_url: string
            unitId: number
        }[]
  }

  export interface QuizProps {
        id: number
        name: string
        quiz_number: number
        disabled: boolean
        video_url: string
        unitId: number
}

 export interface CategoryProps {
    id: number
    name: string
    level: string
    category_number: number
    sub_categories: SubCategoryProps[]
  }
  //{"categoryId": 1, "id": 1, "level": "beginner,basic,intermediate,advanced", "name": "Grammar", "category_number": 1}
  
  //{"category_number": 1, "id": 1, "level": "beginner,basic,intermediate,advanced", "name": "Grammar", 

export interface SubCategoryProps {
    id: number
    name: string
    level: string
    sub_category_number: number
    categoryId: number
  }

  export interface ChildQuestionRef {
    // answer can be a string (ButtonSelect)
    // or an array of strings (WordScramble, WordsSelect, ClickAndCloze)
    getAnswer: () => string | string[] | undefined;
  }



 