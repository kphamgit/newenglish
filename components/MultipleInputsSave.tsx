import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
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

 const MultipleInputsSave: React.FC<MultipleInputsProps> = ({ ref, content, enableCheckButton }) => {
  const [inputFields, setInputFields] = useState<InputItem[] | undefined >([])
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({ name: '', city: '' });
  const [maxLength, setMaxLength] = useState<number>()
  const [charWidth, setCharWidth] = useState<number>(10); // Default width

  const [keyboardHeight, setKeyboardHeight] = useState(0); // State to store keyboard height
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // State to track keyboard visibility


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
  
    //
  
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
    //console.log("XXXX cloze_content_array=", cloze_content_array)
    /*
  {id: '0', type: 'static_text', value: 'How '}
  {id: '1', type: 'input', value: '  '}
  {id: '2', type: 'static_text', value: " you? # I'm fine, "}
  {id: '3', type: 'input', value: '  '}
    */
   //console.log("cloze_content_array=", cloze_content_array)
   setInputFields(cloze_content_array as InputItem[] | undefined);

  }, [content]);

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

  useEffect(() => {
    // Listen for keyboard events
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height); // Get the keyboard height
        setKeyboardVisible(true); // Set keyboard visibility to true
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0); // Reset keyboard height
        setKeyboardVisible(false); // Set keyboard visibility to false
      }
    );

    // Cleanup listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleInputChange = (id: string, value: any) => {
   //console.log("handleInputChange called with id=", id, "value=", value);
    enableCheckButton(); // Call the function to enable the Check button
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  
  const renderElements = inputFields?.map((item, index) => {
    if (item.type === 'text') {
      return (
        <Text key={item.id} style={styles.text}>
          {item.value}
        </Text>
      );
    } else if (item.type === 'input' && item.id && maxLength) {
      //console.log("Rendering input field with id=", item.id);
      return (
        <TextInput
          key={item.id}
          ref={item.id === 'input_0' ? firstInputRef : undefined} // Assign the ref to the first input field
          style={[{width: charWidth * maxLength}, styles.input]}
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

  return ( 
  <View style={styles.container}>
      {/* Measure the width of a single character by displaying it and use onLayout to get its width
        // in this case, use letter 'h' as it is a good representative of character width
        // kpham: you can also use a monospace font to ensure consistent character width
        // in IOS, you use 'Courier' font to ensure the font is TRULY monospace
        // because "fontFamily: 'monospace'" does not guarantee a monospace font in iOS
      */}
     <Text
        style={{
            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Use 'Courier' on iOS and 'monospace' on Android
            fontSize: 16,
          }}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setCharWidth(Math.round(width)); // Set the width of a single character
        }}
      >
        b
      </Text>
      <View style={[styles.container]}>
    {renderElements}
    </View>
  
  </View>)
};

export default MultipleInputsSave;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: 'green',
    marginBottom: 10,
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
  input: {
    color: 'blue',
    borderBottomWidth: 1,
    borderColor: 'blue',
    marginBottom: 10,
    fontSize: 16,
  },
  monospaceText: {  // this style is only used to calculate the width of a single character
    fontFamily: 'monospace', // Use a monospaced font for consistent character width
    fontSize: 16,
  
   
  },
});