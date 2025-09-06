import { useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";
import { useQuestionAttemptContext } from "./context/QuestionAttemptContext";

export interface MyRadioButtonProps {
    id: string;
    label: string;
    //parent_function: (id: string, value: any, label: string) => void;
    //parent_function: (id: string, value: any, label: string) => void;
    ref: React.Ref<MyRadioButtonRefProps>;
 }

 export interface MyRadioButtonRefProps {
    setCorrectFlag: (isCorrect: boolean) => void;
    setDisabledFlag: (isDisabled: boolean) => void;
  }

const MyRadioButton: React.FC<MyRadioButtonProps> = ({ id, label, ref}) => {
    const [checked, setChecked] = useState(false); // 

    const {answerKey} = useQuestionAttemptContext();  // retrieve answer key stored in context
    // this state is set when user clicks on a checkbox
    const [correct, setCorrect] = useState<'correct' | 'incorrect' | 'undefined'>('undefined'); // Tracks the correctness state
   
    // all checkboxes will be disabled after user submits the answer (i.e. clicks on the Check button)
    const [disabled, setDisabled] = useState(false); // Tracks whether the checkbox is disabled

    console.log("MyRadioButton answerKey = ", answerKey);


    const setCorrectFlag = (isCorrect: boolean) => {
      setCorrect(isCorrect ? 'correct' : 'incorrect');
    };

    const setDisabledFlag = (isDisabled: boolean) => {
      setDisabled(isDisabled);
    };

    useImperativeHandle(ref, () => ({
      setCorrectFlag,
      setDisabledFlag
    }));

    const getBackgroundColor = (correct: 'correct' | 'incorrect' | 'undefined'): string => {
      
      switch (correct) {
        case 'correct':
          return 'green';
        case 'incorrect':
          return 'red';
        default:
          {
            // if label is in answerKey, return blue
            console.log("MyRadioButton getBackgroundColor answerKey = ", answerKey, " id = ", id);
            if (disabled) {
              if (answerKey && id) {

                if (answerKey === id) {
                  return 'lightgreen';
                } else {
                  return 'lightgray'; // Not in answer key
                }
              }
            }
            return 'lightgray';


          } // Default color for 'undefined'
      }
          
        // return 'lightgray';
    };

    //<RadioButton.Item style={{backgroundColor: 'lightgreen', borderRadius: 25}} label={item} value={`choice${index + 1}`} />
    return (
    
      <View
        style={{
          backgroundColor: getBackgroundColor(correct),
        }}
      >
        <RadioButton.Item style={{ borderRadius: 25}} 
        disabled={disabled}
        label={label} 
        value={id} />
      </View>
    );
  }

  export default MyRadioButton