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
  const [maxLength, setMaxLength] = useState<number>()
  const [charWidth, setCharWidth] = useState<number>(10); // Default width

  const firstInputRef = useRef<TextInput>(null); // Create a ref for the first TextInput

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
    const array = content?.split(' ');
    // ["How ", "are", " you? # I'm fine, ", "thank"," you." ]
    //[ "How ","are", " you? ", "<br />", " I'm fine, ","thank", " you." ]
    // Filter out empty strings that might result from consecutive brackets
    //const filteredArray = array?.filter(item => item.trim() !== "");
    let input_count = 0;
    let static_text_count = 0;
    const cloze_content_array = array?.map((part, index) => {
      if (part.includes('#')) {
        //console.log(" found new line tag =", part)
        return { id: "new_line_" + index.toString(),  type: 'newline_tag', value: part,}
      }
      else if (part.includes('[')) {
        console.log(" found input tag =", part)
        // use regular expression to remove the square brackets
        part = part.replace('[', '').replace(']', '')
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
   
    console.log("cloze_content_array=", cloze_content_array)
    setInputFields(cloze_content_array as InputItem[] | undefined);
  

}, [content,]);



//const combinedGestur
/*
useEffect(() => {
    //console.log('Content prop:', content);

    const regExp = /\[.*?\]/g
    const  matches = content?.match(regExp);
    //console.log("aaaa matches =", matches)
    //[ "[are]", "[thank]"]
  //console.log("XXXXXXX matches=", matches)
    let length_of_longest_word = 0;
    // remove square brackets from matches
    const matches_with_no_brackets = matches?.map((item) => {
      return item.replace('[', '').replace(']', '')
    })
    if (matches_with_no_brackets) {
      for (var i = 0; i < matches_with_no_brackets.length; i++) {
        if (matches_with_no_brackets[i].length > length_of_longest_word) {
          //console.log(" longest", (matches[i].length + 1))
          length_of_longest_word = matches_with_no_brackets[i].length
          
        }
      }
      //console.log(" longest",length_of_longest_word)
      setMaxLength(length_of_longest_word)
    }

    //remove the square brackets from matches
    const matches_no_brackets =  matches?.map((item) => {
        return item.replace('[', '').replace(']', '')
    })
    //console.log("MMMM matches no brackets=", matches_no_brackets)
    // ["are", "thank"]
    //[ "are","<br />","thank"]
  
    // Use a regular expression to split the sentence
    const array = content?.split(/\[|\]/);
    //console.log("NNN array=", array)
    // ["How ", "are", " you? # I'm fine, ", "thank"," you." ]
    //[ "How ","are", " you? ", "<br />", " I'm fine, ","thank", " you." ]
  
    // Filter out empty strings that might result from consecutive brackets
    const filteredArray = array?.filter(item => item.trim() !== "");
    //console.log("OOO filteredArray=", filteredArray)
    //["How ", "are", " you? # I'm fine, ", "thank"," you." ]
    //[ "How ","are", " you? ", "<br />", " I'm fine, ","thank", " you." ]
  
    let new_line_count = 0;
    let input_count = 0;
    let static_text_count = 0;

    const cloze_content_array = filteredArray?.map((part, index) => {
      const found = matches_no_brackets?.find((match) => part === match);
      if (found) {
        if (part.includes('#')) {
          //console.log(" found new line tag =", part)
          const the_id = `newline_${new_line_count}`;
          new_line_count++;
          return { id: the_id,  type: 'newline_tag', value: part,}
        }
        else {
          const the_id = `input_${input_count}`;
          input_count++;
          return { id: the_id,  type: 'input', value: " ",}
        }
      }
      else {
        //console.log(" found static text part =", part)
        const the_id = `static_text_${static_text_count}`;
        static_text_count++;
        return { id: the_id, type: 'text', value: part}
      }
    })
    console.log("cloze_content_array=", cloze_content_array)
   setInputFields(cloze_content_array as InputItem[] | undefined);
  }, [content]);
*/

  useEffect(() => {
   // console.log("MultipleInputs: useEffect to focus first input field");
   // You have to make sure that inputFields is populated and firstInputRef.current is not null
   
   // because at the time the useEffect hook runs (after the initial render), 
   // the TextInput component may not exist in the DOM so the ref remains NULL.

    if (inputFields && inputFields.length > 0 && firstInputRef.current) {
      //console.log("Focusing first input field");
      firstInputRef.current.focus();
    } else {
      console.log("firstInputRef.current is null or inputFields is not populated");
    }
  }, [inputFields]); // Add inputFields as a dependency

  const handleInputChange = (id: string, value: any) => {
   //console.log("handleInputChange called with id=", id, "value=", value);
    enableCheckButton(); // Call the function to enable the Check button
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  
  const renderElements = inputFields?.map((item, index) => {
    if (item.type === 'text') {
      console.log("Rendering static text with id=", item.id, "value=", item.value);
      return (
        <Text key={item.id} style={styles.text}>
          {item.value === ' '? 'space' : item.value
          
          }
        </Text>
      );
    } else if (item.type === 'input' && item.id) {
      console.log("Rendering input field with id=", item.id);
      return (
        <TextInput
          key={item.id}
          ref={item.id === 'input_0' ? firstInputRef : undefined} // Assign the ref to the first input field
          style={[{width: charWidth * 10}, styles.input]}
          value={inputValues[item.id] || ''}
          onChangeText={(text) => item.id && handleInputChange(item.id, text)}
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete="off" // Disable auto-complete
          spellCheck={false} 
        />
      );
    }
    else 
      return null;
  });

  const computedBlankLayouts = inputFields?.map((item, index) => {
    // this function display the text inside the brackets with 0 opacity to calculate the width of the longest word
    console.log("computedBlankLayouts: item=", item);
    if (item.type === 'input' && item.id ) {
      //console.log("Rendering input field with id=", item.id);
      return (
        <Text
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            console.log(`Width of item ${item.id} ("${item.value}") :`, width);
            
      
          }
          }
          key={item.id}
          style={[styles.computed_blank_layout, {opacity: 1, backgroundColor: 'green'}]}
        >
          {item.value}
          </Text>
      );
    }
    else 
      return null;
  });

   return (
    <>
     <View style={styles.container}>
       <View style={[{flexDirection: 'row'}]}>
         {renderElements}
       </View>
     </View>
      <View>
      {computedBlankLayouts}
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
    padding: 10,
    backgroundColor: 'blue',
    //marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize:  16,
    marginHorizontal: 3,
    //fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Use 'Courier' on iOS and 'monospace' on Android
    
  }, 
  computed_blank_layout: {
    color: 'white',
    fontSize:  16,
    marginHorizontal: 3,
    //fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Use 'Courier' on iOS and 'monospace' on Android
    
  }, 
  input: {
    color: 'white',
    borderBottomWidth: 1,
    borderColor: 'blue',
    marginBottom: 10,
    fontSize: 16,
    //fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Use 'Courier' on iOS and 'monospace' on Android
   
  },
  monospaceText: {  // this style is only used to calculate the width of a single character
    fontFamily: 'monospace', // Use a monospaced font for consistent character width
    fontSize: 16,
  
   
  },
});