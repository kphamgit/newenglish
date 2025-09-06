import React, { useImperativeHandle, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TakeQuestionProps } from './types';

const default_results = {
  user_answer: '', 
  score: 0, 
  error_flag: true, 

}

const WordsSelect: React.FC<TakeQuestionProps> = ({ ref, content, enableCheckButton }) => {
  
  const words = content?.split(" ");

  // State to track which word is toggled
  const [activeWords, setActiveWords] = useState<string[]>([]);

  const toggleWord = (word: string) => {
    enableCheckButton(true); // Call the function to enable the Check button
    // remove punctuation marks such as . , ? ! from the word and save word without punctuation
    setActiveWords((prev) =>
      prev.includes(word)
        ? prev.filter((w) => w !== word) // Remove word if already active
        : [...prev, word] // Add word if not active
    );
  };

useImperativeHandle(ref, () => ({
      checkAnswer,
  }));

  const checkAnswer = (answer_key: string) => {
     // split answer_key into an array of strings
     const user_answer = activeWords.map(word => word.replace(/[.,?!]/g, '')); // Remove punctuation
    
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

  return (
    <View style={styles.container}>
      { words && words.length > 0 &&
      words.map((word, index) => (
        <Pressable
          key={index}
          onPress={() => toggleWord(word)}
          style={({ pressed }) => [
            styles.word,
            activeWords.includes(word) && styles.activeWord, // Add bottom border if active
            pressed && styles.pressedWord, // Optional pressed effect
          ]}
        >
          <Text style={styles.text}>{word}</Text>
        </Pressable>
      ))
      }
    </View>
  );
}

export default WordsSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  word: {
    marginHorizontal: 5,
    paddingBottom: 0,
  },
  activeWord: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    
  },
  pressedWord: {
    opacity: 0.5, // Optional pressed effect
  },
  text: {
    fontSize: 16,
  },
});