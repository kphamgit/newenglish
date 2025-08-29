import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { RadioButton } from 'react-native-paper';
import { ChildQuestionRef } from './types';

  type ButtonSelectQuestionProps = {
    content: string | undefined; // Content of the question, if needed
    //serverChoices: ServerRadioProps; // {"choice_1_text": "one", "choice_2_text": "two", "choice_3_text": "three",  "choice_4_text": "four", "id": 296, "questionId": 5689, "selected": ""}
    ref?: React.Ref<ChildQuestionRef>;
    enableCheckButton: () => void; // Function to enable the Check button
  };

  const ButtonSelect: React.FC<ButtonSelectQuestionProps> = ({ ref, content, enableCheckButton }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [disabledArray, setDisabledArray] = useState<boolean[]>([]); // Array to track disabled state of buttons

  useImperativeHandle(ref, () => ({
      getAnswer,
  }));

  const getAnswer = () => {
    // Return the selected value when requested, defaulting to an empty string if not set
    return selectedValue ?? "";
  }
  const handleButtonPress = (value: any, index: number) => {
    // get the clicked button from the event and disable it
    //const clickedButton = e.currentTarget;

    // Disable the clicked button by updating the disabledArray state
    const newDisabledArray = Array(content?.split('/').length).fill(false); // Create a new array with the same length as content
    newDisabledArray[index] = true; // Set the clicked button's index to true (disabled)
    setDisabledArray(newDisabledArray); // Update the state with the new disabled array
    // set the selected value
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
    <View style = {{  flexDirection: 'row', margin: 10,  justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', rowGap: 15, gap: 5,  borderRadius: 5 }}>
    
      {content && (
        content.split('/').map((choice, index) => (
           <View key={index}>
                  <TouchableOpacity
                    style={[styles.button, { opacity:(disabledArray[index]) ? 0.5 : 1 }]} // Adjust opacity
                    onPress={() => {
                        handleButtonPress(choice, index); // Call the handle_check function when Check button is pressed
                    }
                    }
                    disabled={disabledArray[index]} // Disable the button when not visible
                  >
                    <Text style={styles.textStyle}>{choice}</Text>
                  </TouchableOpacity>
                </View>
        ))
      )}
    </View>
  );
}

export default ButtonSelect

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
       
    },
    button: {
        backgroundColor: 'green',
        marginRight: 10,
        padding: 10,
        borderRadius: 5,
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        zIndex: 2, // Ensure the button is above other content
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
    },
  
    });