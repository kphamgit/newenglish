import React, { useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import MyRadioButton, { MyRadioButtonRefProps } from './MyRadioButton';
import { TakeQuestionProps } from './types';


  const RadioGroup: React.FC<TakeQuestionProps> = ({ ref,content, enableCheckButton }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const radioButtonRefs = useRef<MyRadioButtonRefProps[]>([]);

  useImperativeHandle(ref, () => ({
      checkAnswer,
  }));

  const checkAnswer = (answer_key: string) => {
    // disable all checkboxes via the refs
    //console.log("RadioGroup checkAnswer called");
    // get the index in the radioButtonRefs array of the answer_key, i.e, choice1 -> index 0
    const correct_answer_index = parseInt(answer_key.replace('choice', '')) - 1;
    //console.log("RadioGroup checkAnswer ******* correct_answer_index = ", correct_answer_index);
    const selected_answer_index = parseInt(selectedValue.replace('choice', '')) - 1;
    //console.log("RadioGroup checkAnswer ******* selected_answer_index = ", selected_answer_index);
    
    // set the correct flag of the correct answer to true
    if (correct_answer_index >= 0 && correct_answer_index < radioButtonRefs.current.length) {
      radioButtonRefs.current[correct_answer_index].setCorrectFlag(true);
    }
    if (selected_answer_index !== correct_answer_index ) {
        radioButtonRefs.current[selected_answer_index].setCorrectFlag(false);
    }

    radioButtonRefs.current.forEach((radiobutton) => {
      radiobutton.setDisabledFlag(true);
    })
    return {user_answer: selectedValue ?? "", 
      score: (correct_answer_index === correct_answer_index) ? 5 : 0, 
      error_flag: (selected_answer_index !== correct_answer_index)
    };
  }

  const handleRadioButtonPress = (value: any) => {
    //console.log("RadioGroup handleRadioButtonPress value = ", value);
    setSelectedValue(value);
    enableCheckButton(true); // Call the function to enable the Check button
    // You can add your custom logic here based on the selected value
    /*
    switch (value) {
      case 'choice1':
        // Execute actions for Option 1
        console.log('Option 1 selected');
        break;
      case 'choice2':
        // Execute actions for Option 2
        console.log('Option 2 selected');
        break;
      case 'choice3':
        // Execute actions for Option 3
        console.log('Option 3 selected');
        break;
      default:
        break;
    }
        */
  };

  return (
    <View>
      
      <RadioButton.Group
        onValueChange={(value) => handleRadioButtonPress(value)}
        value={selectedValue}
      >
        { content && 
            content.split('/').map((item, index) => (
              <View key={index} style={{backgroundColor: 'orange', marginHorizontal: 2, borderRadius: 5, padding: 2, marginBottom: 5}}>
                <MyRadioButton 
                  label={item} 
                  id={`choice${index + 1}`} 
                  ref = {(el) => {
                    if (el) {
                      radioButtonRefs.current[index] = el;
                    }
                  }}
                  />
                  
              </View>
            ))
        }
      </RadioButton.Group>

 
    </View>
  );
}

export default RadioGroup

/*
export interface MyRadioButtonProps {
    id: string;
    label: string;
    //parent_function: (id: string, value: any, label: string) => void;
    parent_function: (id: string, value: any, label: string) => void;
    ref: React.Ref<MyRadioButtonRefProps>;
 }
*/

//         <RadioButton.Item style={{backgroundColor: 'lightgreen', borderRadius: 25}} label={item} value={`choice${index + 1}`} />
/*
  <View style={{backgroundColor: 'orange', marginHorizontal: 10, borderRadius: 5, padding: 5, marginBottom: 5}}>
          <RadioButton.Item label={serverChoices.choice_1_text} value="choice1" />
          </View>
      
          <View style={{backgroundColor: 'orange', marginHorizontal: 10, borderRadius: 5, padding: 5, marginBottom: 5}}>
        <RadioButton.Item label={serverChoices.choice_2_text} value="choice2" />
        </View>
    
        <View style={{backgroundColor: 'orange', marginHorizontal: 10, borderRadius: 5, padding: 5, marginBottom: 5}}>
        <RadioButton.Item label={serverChoices.choice_3_text} value="choice3" />
        </View>

        { serverChoices.choice_4_text &&
        <View style={{backgroundColor: 'orange', marginHorizontal: 10, borderRadius: 5, padding: 5, marginBottom: 5}}>
        <RadioButton.Item label={serverChoices.choice_4_text} value="choice4" />
        </View>
*/

/*
 <Text>Selected Value: {selectedValue}</Text>
     <Button
            mode="contained"
            onPress={() => {
             // You can perform an action based on the selected value here as well
             switch (selectedValue) {
               case 'choice1':
                 // Execute actions for Option 1 when the button is pressed
                 console.log('Performing action for Option 1');
                 break;
               case 'choice2':
                 // Execute actions for Option 2 when the button is pressed
                 console.log('Performing action for Option 2');
                 break;
               case 'choice3':
                 // Execute actions for Option 3 when the button is pressed
                 console.log('Performing action for Option 3');
                 break;
               default:
                 break;
             }
           }}
         >
          Do something with selected value
         </Button>

*/