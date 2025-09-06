import React, { useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import MyCheckbox, { MyCheckboxRefProps } from './MyCheckbox';
import { QuestionAttemptResults, TakeQuestionProps } from './types';

  const CheckboxGroup: React.FC<TakeQuestionProps> = ({ ref,content, enableCheckButton }) => {
  //const [selectedValues, setSelectedValues] = useState<{id: string, label: string}[]>([]);
  //const [selectedValues, setSelectedValues] = useState<string>('');
  const selectedValues = useRef<string[]>([]);

  // create an array of ref of type MyCheckboxRefProps
  const checkboxRefs = useRef<MyCheckboxRefProps[]>([]);

  useImperativeHandle(ref, () => ({
      checkAnswer,
  }));

  
  const checkAnswer = (answer_key: string) : QuestionAttemptResults => {
    // Compare selectedValues with answer_key
    //console.log("CheckboxGroup checkAnswer called, answer_key=", answer_key, " selectedValues=", selectedValues.current);
    //console.log("^^^^^^^^^^^^^^^ process_checkbox answer_key = ", answer_key)
   //console.log("^^^^^^^^^^^^^^^ process_checkbox selectedValues = ", selectedValues.current)
    //const user_answer = selectedValues.current.join('/');
   // console.log("process_checkbox user_answer = ", user_answer)
    let error = false;
    let score = 0
    let answer_key_parts = answer_key?.split('/')
    //console.log("^^^^^^^^^^^^^^^ process_checkbox answer_key_parts = ", answer_key_parts)
    let num_correct_selections = 0;
    selectedValues.current.forEach((item) => {
      //console.log("BEGIN OF LOOP item= ", item);
      if (!answer_key_parts?.includes(item)) {
       // console.log("******* process_checkbox item ", item, "not in answer_key_parts: ");
        // get the item "number" which is the last letter of the item label (e.g. choice3 -> 3)
        const item_number = parseInt(item.replace('choice', ''));
        // get the index of the item in the checkboxRefs array with item_number - 1,
        // i.e, choice1 -> index 0
        // and set the correct flag to false
        checkboxRefs.current[item_number - 1].setCorrectFlag(false);
      }
      else {
        //console.log("******* process_checkbox item ", item, "IS in answer_key_parts: ");
        const item_number = parseInt(item.replace('choice', ''));
        // get the index of the item in the checkboxRefs array with item_number - 1,
        // i.e, choice1 -> index 0
        // and set the correct flag to false
        checkboxRefs.current[item_number - 1].setCorrectFlag(true);
        num_correct_selections++;
        //console.log("******* process_checkbox num_correct_selections = ", num_correct_selections);
      }
    })
    // disable all checkboxes via the refs
    checkboxRefs.current.forEach((checkbox) => {
      checkbox.setDisabledFlag(true);
    })
    //console.log("&&&&&&&&&& process_checkbox num_correct_selections = ", num_correct_selections)
    if (num_correct_selections === answer_key_parts?.length) {
      return {
        user_answer: selectedValues.current.join('/'),
        score: 5,
        error_flag: false,
      }
    
    }
    else {
      return {
        user_answer: selectedValues.current.join('/'),
        score: 0,
        error_flag: true,
      }
    }
  }
  
  const check_box_clicked = (id: string, isSelected: any, text: string) => {
    //console.log("Checkboxxxxx clicked, id = ", id,  "value=", isSelected);
    // You can add your custom logic here based on the checkbox state
    //console.log(`Checkbox is now ${value ? 'checked' : 'unchecked'}`);
    // if value is true, add to selectedValues, else remove from selectedValues
    if (isSelected) {
      selectedValues.current.push(id);
    }
    else {
      selectedValues.current = selectedValues.current.filter(item => item !== id) ;
    }
   //console.log("New selected values: ", selectedValues.current);
    if (selectedValues.current.length === 2) {
      enableCheckButton(true); // Call the function to enable the Check butto
    }
    else {
      enableCheckButton(false);
    }
    /*
    let new_selected = [...selectedValues];
    if (isSelected) {
      //new_selected.push({id: id, label: `item_label_${id}`});
     // new_selected.push({id, label: text});
      new_selected.push(id);
    }
    else {
      //new_selected = new_selected.filter(item => item.id !== id);
      new_selected = new_selected.filter(item => item !== id) ;
    }
    console.log("New selected values: ", new_selected);
    if (new_selected.length === 2) {
      enableCheckButton(true); // Call the function to enable the Check button
      //disableCheckButton();
    }
    else {
      enableCheckButton(false);
    }
    setSelectedValues(new_selected.join('/'));
    */
    //enableCheckButton(); // Call the function to enable the Check button
  }

  return (
    <View>
      
        { content && 
            content.split('/').map((item, index) => (
              <View key={index} style={{backgroundColor: 'lightgreen', marginHorizontal: 2, borderRadius: 5, padding: 2, marginBottom: 5}}>
              
              <MyCheckbox 
                id = {`choice${index+1}`} 
                label = {item} 
                parent_function={(check_box_clicked)}
                ref = {(el) => {
                  if (el) {
                    checkboxRefs.current[index] = el;
                  }
                }}
                />
              </View>
            ))
        }
    
 
    </View>
  );
}

export default CheckboxGroup

/*
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