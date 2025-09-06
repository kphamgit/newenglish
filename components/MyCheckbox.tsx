import { useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { Checkbox } from "react-native-paper";
import { useQuestionAttemptContext } from "./context/QuestionAttemptContext";

export interface MyCheckboxProps {
    id: string;
    label: string;
    //parent_function: (id: string, value: any, label: string) => void;
    parent_function: (id: string, value: any, label: string) => void;
    ref: React.Ref<MyCheckboxRefProps>;
 }

 export interface MyCheckboxRefProps {
    setCorrectFlag: (isCorrect: boolean) => void;
    setDisabledFlag: (isDisabled: boolean) => void;
  }

const MyCheckbox: React.FC<MyCheckboxProps> = ({ id, label, parent_function, ref}) => {
    const [checked, setChecked] = useState(false); // 

    const {answerKey} = useQuestionAttemptContext();  // retrieve answer key stored in context
    // this state is set when user clicks on a checkbox
    const [correct, setCorrect] = useState<'correct' | 'incorrect' | 'undefined'>('undefined'); // Tracks the correctness state
   
    // all checkboxes will be disabled after user submits the answer (i.e. clicks on the Check button)
    const [disabled, setDisabled] = useState(false); // Tracks whether the checkbox is disabled

    console.log("MyCheckbox answerKey = ", answerKey);

    const handleCheckboxPress = () => {
      setChecked(!checked);
      parent_function(id, !checked, label);
      // You can add your custom logic here based on the checkbox state
      //console.log(`Checkbox is now ${!checked ? 'checked' : 'unchecked'}`);
       // Example logic to set correctness state
   
    }

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
            console.log("MyCheckbox getBackgroundColor answerKey = ", answerKey, " id = ", id);
            if (disabled) {
            if (answerKey && id) {
              const answerKeyParts = answerKey.split('/');
              if (answerKeyParts.includes(id)) {
                return 'lightgreen';
              } else {
                return 'lightgray'; // Not in answer key
              }
            }
          }
            return 'lightgray';
          

          } // Default color for 'undefined'
      }
    };

    return (
    
      <View
        style={{
          backgroundColor: getBackgroundColor(correct),
        }}
      >
        <Checkbox.Item label={label}
          status={checked ? "checked" : "unchecked"} // S
          disabled={disabled}
          onPress={handleCheckboxPress} />
      </View>
    );
  }

  export default MyCheckbox