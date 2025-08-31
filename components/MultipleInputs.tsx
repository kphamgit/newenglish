import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ChildQuestionRef } from './types';

interface InputItem {
  id: string; //
  type: 'text' | 'input';
  value: string;
  
}

interface MultipleInputsProps {
    content: string | undefined;
    ref: React.Ref<ChildQuestionRef>;
    enableCheckButton: () => void; 
  }

 const MultipleInputs: React.FC<MultipleInputsProps> = ({ ref, content, enableCheckButton }) => {
  const [inputFields, setInputFields] = useState<InputItem[] | undefined >([])
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({ name: '', city: '' });
 
  //const [blankWidths, setBlankWidths] = useState<number[]>([]);
  const blankWidthsRef = useRef<number[]>([]);

  const longestBlankWidth = useRef<number>(0);
  // array to store the widths of each blank, used to set the max width of each blank
  const firstInputRef = useRef<TextInput>(null); // Create a ref for the first TextInput

  const [ready, setReady] = useState(false);

 useImperativeHandle(ref, () => ({
      getAnswer,
  }));

  const getAnswer = () => {
    //console.log("******** ClickAndCloze getAnswer called");
    //console.log("********* inputValues=", inputValues);
    // filter inputValues to only include those that are not empty
    const filteredValues = Object.entries(inputValues)
      .filter(([key, value]) => value.trim() !== '')
      .map(([key, value]) => value);
    //console.log("********* filteredValues=", filteredValues);
    return filteredValues // Return the answer as a string
  }

  
  useEffect(() => {
    // split content by spaces or brackets
    const array = content?.split(/(\[.*?\]|\s+|#)/).filter(item => item.trim() !== '');
    //console.log(" my_array =", my_array);
    
    // ["How ", "are", " you? # I'm fine, ", "thank"," you." ]
    //[ "How ","are", " you? ", "<br />", " I'm fine, ","thank", " you." ]
    // Filter out empty strings that might result from consecutive brackets
    //const filteredArray = array?.filter(item => item.trim() !== "");
    //console.log(" array =", array);
    let input_count = 0;
    let static_text_count = 0;
    const cloze_content_array = array?.map((part, index) => {
      //console.log(" begin of loop: found input tag =", part)
      if (part.includes('#')) {
        //console.log(" found new line tag =", part)
        return { id: "new_line_" + index.toString(),  type: 'newline_tag', value: part,}
      }
      else if (part.includes('[')) {
        //console.log(" found input tag =", part)
        // use regular expression to remove the square brackets
        part = part.replace('[', '').replace(']', '')
        //console.log(" after removing brackets, input tag =", part)
        const input_id = "input_" + input_count.toString();
        input_count += 1;
        return { id: input_id,  type: 'input', value: part,}
      }
      else {
        const static_text_id = "static_text_" + static_text_count.toString();
        static_text_count += 1;
        return { id: static_text_id, type: 'text', value: part}
      }
    })
   
   // console.log("cloze_content_array=", cloze_content_array)
    setInputFields(cloze_content_array as InputItem[] | undefined);
  

}, [content,]);

  useEffect(() => {
   // console.log("MultipleInputs: useEffect to focus first input field");
   // You have to make sure that inputFields is populated and firstInputRef.current is not null
   // because at the time the useEffect hook runs (after the initial render), 
   // the TextInput component may not exist in the DOM so the ref remains NULL.

    if (inputFields && inputFields.length > 0 && firstInputRef.current && ready) {
       // set Focus to the first input field so that the the virtual keyboard pops up
       // when the component is rendered
      firstInputRef.current.focus();
    } else {
      console.log("firstInputRef.current is null or inputFields is not populated");
    }
  }, [inputFields, ready]); // Add inputFields as a dependency

  const handleInputChange = (id: string, value: any) => {
   //console.log("handleInputChange called with id=", id, "value=", value);
    enableCheckButton(); // Call the function to enable the Check button
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  
  const renderElements = inputFields?.map((item, index) => {
    if (item.type === 'text') {
      //console.log("Rendering static text with id=", item.id, "value=", item.value);
      return (
        <Text key={item.id} style={styles.text}>
          {item.value === ' '? ' ' : item.value
          
          }
        </Text>
      );
    } else if (item.type === 'input' && item.id) {
      //console.log("Rendering input field with id=", item.id);
      return (
        <TextInput
          key={item.id}
          ref={item.id === 'input_0' ? firstInputRef : undefined} // Assign the ref to the first input field
          style={[{width: longestBlankWidth.current + 6}, styles.input]} // add some padding
          value={inputValues[item.id] || ''}
          onChangeText={(text) => item.id && handleInputChange(item.id, text)}
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete="off" // Disable auto-complete
          spellCheck={false} 
          textAlign='left'
        />
      );
    }
    else 
      return null;
  });

  const handleComputedBlankLayout = (event: any, itemId: string) => {
    const { width } = event.nativeEvent.layout;
     const itemIndex = parseInt(itemId.split('_')[1], 10);
     blankWidthsRef.current[itemIndex] = width;
     //console.log(" blankqWidthsRef.curren length =", blankWidthsRef.current.length);
     const num_blanks = inputFields?.filter(item => item.type === 'input').length || 0;
     if (blankWidthsRef.current.length === num_blanks) {
        //console.log("All blank widths measured (from ref):", blankWidthsRef.current);
        longestBlankWidth.current = Math.max(...blankWidthsRef.current);
        //console.log("Longest blank width (from ref):", longestBlankWidth.current);
        setReady(true);
      }
  }

  const computedBlankLayouts = inputFields?.map((item, index) => {
    // this function display the text inside the brackets with 0 opacity to calculate the width of the longest word
    //console.log("computedBlankLayouts: item=", item, "index=", index);
    if (item.type === 'input' && item.id ) {
      //console.log("computedBlankLayouts, input field with id=", item.id);
      return (
        <Text
          onLayout={(event) => {
            handleComputedBlankLayout(event, item.id as string)
          }
          }
          key={item.id}
          style={[styles.computed_blank_layout, {position: 'absolute', opacity: 0, backgroundColor: 'transparent'}]}
        >
          {item.value}
        </Text>
      );
    }
    else 
      return null;
  });

   return (
    <>{ ready &&
     <View style={styles.container}>
       <View style={[{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}]}>
         {renderElements}
       </View>
     </View>
 }
    <View>
    <View>
      {computedBlankLayouts}
    </View>
    </View>
    
    </>
   )
 };

//<View style={[styles.container, {backgroundColor: 'transparent', position: 'absolute', top: -1000}]}>
export default MultipleInputs;

const styles = StyleSheet.create({
  container: {
    //flexDirection: 'row',
    //flexWrap: 'wrap',
    borderRadius: 15,
    padding: 10,
    width: '100%',
    backgroundColor: 'lightgray',
    //marginBottom: 10,
  },
  text: {
    //color: 'white',
    fontSize:  16,
    marginHorizontal: 3,
    //fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Use 'Courier' on iOS and 'monospace' on Android
    
  }, 
  computed_blank_layout: {
    color: 'orange',
    fontSize:  16,
    //marginHorizontal: 3,
    //fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Use 'Courier' on iOS and 'monospace' on Android
    
  }, 
  input: {
    //color: 'white',
  
    paddingTop: 4,
    borderBottomWidth: 2,
    paddingLeft: 3,
    borderColor: 'gray',
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: 'lightgray',
    textAlign: 'center',
    //fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Use 'Courier' on iOS and 'monospace' on Android
   
  },
});