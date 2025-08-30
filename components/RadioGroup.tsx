import React, { useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { ChildQuestionRef } from './types';

  type RadioButtonQuestionProps = {
    //serverChoices: ServerRadioProps; // {"choice_1_text": "one", "choice_2_text": "two", "choice_3_text": "three",  "choice_4_text": "four", "id": 296, "questionId": 5689, "selected": ""}
    ref?: React.Ref<ChildQuestionRef>;
    content: string | undefined; // Content of the question, if needed
    enableCheckButton: () => void; // Function to enable the Check button
  };

  const RadioGroup: React.FC<RadioButtonQuestionProps> = ({ ref,content, enableCheckButton }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  useImperativeHandle(ref, () => ({
      getAnswer,
  }));

  const getAnswer = () => {
    // Return the selected value when requested, defaulting to an empty string if not set
    return selectedValue ?? "";
  }
  const handleRadioButtonPress = (value: any) => {
    setSelectedValue(value);
    enableCheckButton(); // Call the function to enable the Check button
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
                <RadioButton.Item style={{backgroundColor: 'lightgreen', borderRadius: 25}} label={item} value={`choice${index + 1}`} />
              </View>
            ))
        }
      </RadioButton.Group>

 
    </View>
  );
}

export default RadioGroup

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