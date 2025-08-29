//export const processQuestion = (format: string | undefined, answer_key: string | undefined, user_answer: string | undefined) => {

export const processQuestion = (format: string | undefined, answer_key: string | undefined, user_answer: any | undefined) => {
  
    //console.log("processQuestion format = ", format)
    
  const default_results = {
    user_answer: '', 
    score: 0, 
    error_flag: true, 
 
}

    const process_button_select = (answer_key: string, user_answer: string) => {
   
   let error = false;
   let score = 0
   if (answer_key != user_answer)  {
      error = true
   }
   else {
        score += 5;
   }      
    return { ...default_results,
        user_answer:  user_answer,
        score: score,
        error_flag: error,
      
        }
}



const compare_cloze_answers = (user_answer: string, answer_key: string) => {
    let error = true;
    const multiple_answers = answer_key.indexOf('*') >= 0;
    if (multiple_answers) {
        //console.log(" multiple answers")
        let possible_answers = answer_key.split('*');
        //possible_answers.forEach((possible_answer: string) => {
        for (const possible_answer of possible_answers) {
            if (user_answer.replace(/\s+/g, '') === possible_answer.replace(/\s+/g, '')) {
                error = false;
                break;
            } 
        };
        return error;
    } 
       
    if (user_answer.replace(/\s+/g, '') === answer_key.replace(/\s+/g, '')) {
        error = false;
    }
    return error;
}


const process_cloze = (answer_key:string, user_answer: string[] ) => {
   //console.log("process_button_cloze answer_key = ", answer_key)
    //console.log("process_button_cloze user_answer = ", user_answer)
    // split answer_key into an array of strings
    let answer_key_parts = answer_key.split('/')
    // iterate through user_answer array and compare with corresponding answer_key_parts
    let error = false;
    for (let i = 0; i < user_answer.length; i++) {
        //console.log("process_words_scramble user_answer[i] = ", user_answer[i])
        //console.log("process_words_scramble answer_key_parts[i] = ", answer_key_parts[i]);
        error = compare_cloze_answers(user_answer[i], answer_key_parts[i]);
    }
    if (error) {
        return { ...default_results,
            user_answer: user_answer.join('/'),
        }
    }

    return { ...default_results,
        user_answer: user_answer.join('/'),
        score: 5,
        error_flag: false,  
    }
}

const process_button_cloze = (answer_key:string, user_answer: string[] ) => {
    
    //console.log("process_button_cloze answer_key = ", answer_key)
    //console.log("process_button_cloze user_answer = ", user_answer)

    // split answer_key into an array of strings
    let answer_key_parts = answer_key.split('/')
    // iterate through user_answer array and compare with corresponding answer_key_parts
    let error = false;
    for (let i = 0; i < user_answer.length; i++) {
        //console.log("process_words_scramble user_answer[i] = ", user_answer[i])
        //console.log("process_words_scramble answer_key_parts[i] = ", answer_key_parts[i]);
        if (user_answer[i] !== answer_key_parts[i]) {
            error = true;
            break;
        }
    }
    if (error) {
        return { ...default_results,
            user_answer: user_answer.join('/'),
        }
    }

    return { ...default_results,
        user_answer: user_answer.join('/'),
        score: 5,
        error_flag: false,  
    }
}


const process_radio = (question: any, user_answer: string) => {  // 4
    let error = false;
  let score = 0
  if (answer_key != user_answer)  {
     error = true
  }
  else {
       score += question.score;
  }
   
   return { ...default_results,
       user_answer: user_answer,
       score: score,
       error_flag: error,

       }
}

const process_words_scramble = (answer_key: string , user_answer:string[]) => {
    // answer_key is a string with words separated by slashes
    // user_answer is an array of strings 
    //console.log("process_words_scramble answer_key = ", answer_key)
    //console.log("process_words_scramble user_answer = ", user_answer)

    // split answer_key into an array of strings
    let answer_key_parts = answer_key.split('/')
    // iterate through user_answer array and compare with corresponding answer_key_parts
    let error = false;
    for (let i = 0; i < user_answer.length; i++) {
        //console.log("process_words_scramble user_answer[i] = ", user_answer[i])
        //console.log("process_words_scramble answer_key_parts[i] = ", answer_key_parts[i]);
        if (user_answer[i] !== answer_key_parts[i]) {
            error = true;
            break;
        }
    }
    if (error) {
        return { ...default_results,
            user_answer: user_answer.join('/'),
        }
    }

    return { ...default_results,
        user_answer: user_answer.join('/'),
        score: 5,
        error_flag: false,  
    }
}

const process_speech_recognition = (answer_key: string , user_answer:string) => {
 
    let error = false;
    let score = 0
    if (answer_key != user_answer)  {
        error = true
    }
    else {
        score += 5;
    }
    return { ...default_results,
        user_answer: user_answer,
        score: score,
        error_flag: error,
  
        }
}

const process_words_select = (answer_key: string, user_answer: string[]) => {
   
    // split answer_key into an array of strings
    let answer_key_parts = answer_key.split('/')
    // iterate through user_answer array and compare with corresponding answer_key_parts
    let error = false;
    for (let i = 0; i < user_answer.length; i++) {
        //console.log("process_words_scramble user_answer[i] = ", user_answer[i])
        //console.log("process_words_scramble answer_key_parts[i] = ", answer_key_parts[i]);
        if (user_answer[i] !== answer_key_parts[i]) {
            error = true;
            break;
        }
    }
    if (error) {
        return { ...default_results,
            user_answer: user_answer.join('/'),
        }
    }

    return { ...default_results,
        user_answer: user_answer.join('/'),
        score: 5,
        error_flag: false,  
    }
}

switch (format) {
    case '1': // cloze
        return process_cloze(
            answer_key!,
            user_answer!
        );
    case '2': // button cloze
        return process_button_cloze(
            answer_key!,
            user_answer!
        );
    case '3': // button select
        return process_button_select(
            answer_key!,
            user_answer!
        );
    case '4': // radio
        return process_radio(
            answer_key,
            user_answer!
        );
    case '6': // word scramble
        return process_words_scramble(
            answer_key!,
            user_answer!
        );
    case '7': // word scramble
        return process_speech_recognition(
            answer_key!,
            user_answer!
        );
    case '8': // words select
        return process_words_select(
            answer_key!,
            user_answer!
        );
    case '10': // 
        return process_cloze(
            answer_key!,
            user_answer!
        );
    case '11': // dropdown
        return process_cloze(
            answer_key!,
            user_answer!
        );
    default:
        // Handle other cases or do nothing
        break;
}

}

