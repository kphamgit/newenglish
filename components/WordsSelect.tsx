import React, { useImperativeHandle, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChildQuestionRef } from './types';

interface WordsSelectProps {
    content: string | undefined;
    ref?: React.Ref<ChildQuestionRef>;
    enableCheckButton: () => void; 
  }

const WordsSelect: React.FC<WordsSelectProps> = ({ ref, content, enableCheckButton }) => {
//export default function WordsSelect() {
  
  const words = content?.split(" ");

  // State to track which word is toggled
  const [activeWords, setActiveWords] = useState<string[]>([]);

  const toggleWord = (word: string) => {
    enableCheckButton(); // Call the function to enable the Check button
    // remove punctuation marks such as . , ? ! from the word and save word without punctuation
    setActiveWords((prev) =>
      prev.includes(word)
        ? prev.filter((w) => w !== word) // Remove word if already active
        : [...prev, word] // Add word if not active
    );
  };

useImperativeHandle(ref, () => ({
      getAnswer,
  }));

  const getAnswer = () => {
    //console.log("******** ClickAndCloze getAnswer called");
    // go through activeWords and remove punctuation marks such as . , ? ! from the word
    const cleanedWords = activeWords.map(word => word.replace(/[.,?!]/g, '')); // Remove punctuation
    return cleanedWords; // Return the answer as a string
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