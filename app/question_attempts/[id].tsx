import ButtonSelect from '@/components/ButtonSelect';
import ClickAndCloze from '@/components/ClickAndCloze';
import { useDomainContext } from '@/components/context/DomainContext';
import { useNavigationContext } from '@/components/context/NavigationContext';
import { useQuestionAttemptContext } from '@/components/context/QuestionAttemptContext';
import MultipleInputs from '@/components/MultipleInputs';
import MyRecorderNew from '@/components/MyRecorderNew';
import QuestionAttemptHelper from '@/components/QuestionAttemptHelper';
import RadioGroup from '@/components/RadioGroup';
import DuoDragDrop from '@/components/reanimated/duolingo/DuoDragDrop';
import { ChildQuestionRef, QuestionAttemptResults, QuestionProps } from '@/components/types';
import WordsSelect from '@/components/WordsSelect';
import { processQuestion } from '@/utils/processQuestion';
import { HeaderBackButton } from '@react-navigation/elements';
import { AudioSource, createAudioPlayer } from 'expo-audio';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dimensions, Keyboard, KeyboardEvent, StyleSheet, Text, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import RenderHTML from 'react-native-render-html';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function QuestionAttemptScreen() {
  
  const opacityImage = useSharedValue<number>(1);
  const opacityResults = useSharedValue<number>(0);

  const test_image = require('../../assets/images/dragdrop/carpet.png');

  const [showContinueButton, setShowContinueButton] = React.useState<boolean>(false);

  const childQuestionRef = useRef<ChildQuestionRef>(null);

  const { id, questionId, quizAttemptId} = useLocalSearchParams(); // Extract the dynamic route parameter 'id'
  //console.log('QuestionAttemptScreen Dynamic route id:', id); // Debug the extracted parameter
  //console.log('QuestionAttemptScreen Dynamic route questionId:', questionId);

  const navigationContext = useNavigationContext(); // Get navigation context
  const unitId = navigationContext.unitId; // Get unitId from navigation context
  
  const [theQuestion, setTheQuestion] = useState<QuestionProps | undefined>()

  const [keyboardHeight, setKeyboardHeight] = useState(0); // State to store keyboard height

  const {  setId, setFormat, setAnswerKey } = useQuestionAttemptContext(); 

  const [endOfQuiz, setEndOfQuiz] = useState<boolean>(false); // State to track if the end of quiz is reached
 const router = useRouter(); // Get the router object
 const {domain} = useDomainContext(); // Get domain from context

 //const [questionFinished, setQuestionFinished] = useState<boolean>(false); // State to track if the question is finished
 const [questionAttemptResults, setQuestionAttemptResults] = useState<QuestionAttemptResults>(); // State t

 const endOfQuizAudioSource = require('../../assets/sounds/finish-quiz.mp3'); // Import the audio file
 const errorAudioSource = require('../../assets/sounds/failure.mp3'); // Import the error audio file
 const error_player = createAudioPlayer(errorAudioSource as AudioSource); // Create an audio player for the error sound
  const successAudioSource = require('../../assets/sounds/success.mp3'); // Import the success audio file
  const success_player = createAudioPlayer(successAudioSource as AudioSource); // Create an audio player for the success
  const end_of_quiz_player = createAudioPlayer(endOfQuizAudioSource as AudioSource); 
  
const proceedToNextQuestion = async (finished: boolean) => {
  //console.log("QUESTION FINISHED for opacityImage has finished.");
  // Perform any additional actions here
  setShowContinueButton(false);
  const url = `${domain}/api/quiz_attempts/${quizAttemptId}/create_next_question_attempt_native`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to fetch question");
    return;
  }
  const data = await response.json();
  if (data) {
    //console.log("XXXXXXX eee Fetched Question Attempt Data:", data);
    if (data.end_of_quiz) {
      //console.log("End of quiz reached");
      end_of_quiz_player.play(); // Play the end of quiz audio
      setEndOfQuiz(true); // Set endOfQuiz state to true
    }
    //console.log("YYYYYY eee question_attempt:", data?.question_attempt);
    const base_url = `/question_attempts/${data.question_attempt.id}`;
    //console.log(" #### Unit: handleContinue, base_url: ", base_url);

    //console.log(" www", data.question_attempt.quizAttemptId, typeof data.question_attempt.quizAttemptId);
    //console.log(" zzz", data.question_attempt.questionId, typeof data.question_attempt.questionId);
    console.log(" id", id, typeof id);
   
    const queryParams = `quizAttemptId=${data.question_attempt.quizAttemptId}&questionId=${data.question_attempt.questionId}`;
    //console.log(" #### Unit: handleContinue, queryParams: ", queryParams);
    const fullUrl = `${base_url}?${queryParams.toString()}`;
    //console.log(" #### Unit: handleContinue, fullUrl: ", fullUrl);
    // Navigate to the next question attempt
   
    router.replace(fullUrl as `/question_attempts/${string}?${string}${string}`);
  }
}

  const handleContinue = async () => {
    //translateX.value += 50;
    opacityResults.value = withTiming(0, { duration: 400 });
    //opacityImage.value = withTiming(0, { duration: 100 });
    opacityImage.value = withTiming(0, { duration: 400 }, async (finished) => {
      if (finished) {
        console.log("XXXXXX Opacity animation to 0 has finished.");
        console.log("XXXXXX Now setting questionFinished to true.");
        runOnJS(proceedToNextQuestion)(true);
      }
    });
  };

  
  const handleCheck = async () => {
    // show Keyboard
    

    //translateY.value = withTiming(0, { duration: 1000 }); // Animate to its original p
    // if keyboard is present, dismiss it

    Keyboard.dismiss();
    setKeyboardHeight(0); // Reset keyboard height
     opacityResults.value = withTiming(1, { duration: 800 });
     setShowContinueButton(true);

     const user_answer = childQuestionRef.current?.getAnswer(); // Get the answer from the child component
     const results = processQuestion(theQuestion?.format.toString(), theQuestion?.answer_key, user_answer );
     const url = `${domain}/api/question_attempts/${id}/update`;
     const response = await fetch(url, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({  score: results?.score, error_flag: results?.error_flag, user_answer: results?.user_answer }),
     });
 
     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
     else {
      //console.log("EEEEE results=", results);
      if (results?.error_flag) {
        error_player.play(); // Play the error sound
      }
      else {
        success_player.play(); // Play the success sound
      }
       setQuestionAttemptResults(results); // Store results in state
     
     }


  }

  const animatedStylesResults = useAnimatedStyle(() => ({
    //transform: [{ translateX: withSpring(translateX.value * 2) }],
    opacity: opacityResults.value,
  }));

  const animatedStylesImage = useAnimatedStyle(() => ({
    opacity: opacityImage.value,
  }));

  const displayQuestionInstruction = (question: QuestionProps) => {
    //console.log("displayQuestionInstruction called with question: ", question);
    const screenWidth = Dimensions.get('window').width; // Get screen width for responsive rendering
    return (
      <View style={[{ width: screenWidth * 0.9, padding: 10 }, animatedStylesImage]}>
        <RenderHTML
          contentWidth={screenWidth * 0.9}
          source={{ html: question.instruction }} // Render the HTML content
        />
      </View>
    );
  };

  const displayQuestion = (format: string, content: string, button_cloze_options: string | undefined) => {
    // console.log("displayQuestion called with format: ", format, " content: ", content, " button_cloze_options: ", button_cloze_options);
    <Animated.Image source={test_image} style=
    {[{ width: 100, height: 100, resizeMode: 'contain', marginBottom: 5 }, animatedStylesImage]}
  />
       switch (format) {
        case '1':
          return <MultipleInputs ref={childQuestionRef} content={content} enableCheckButton={userFinishedAction} />;
        case '2':
          return <ClickAndCloze ref={childQuestionRef} content={content} choices={button_cloze_options || ''} enableCheckButton={userFinishedAction} />;
        case '3':
            return <ButtonSelect ref={childQuestionRef} content={content}  enableCheckButton={userFinishedAction} />;
        case '4':
          return <RadioGroup ref={childQuestionRef} content={content} enableCheckButton={userFinishedAction} />;
        case '6':
          return (
           
             <DuoDragDrop ref={childQuestionRef} words={content.split('/')} enableCheckButton={userFinishedAction} />
          )
        case '7':
          return <MyRecorderNew ref={childQuestionRef} />
        case '8':
          return <WordsSelect ref={childQuestionRef} content={content} enableCheckButton={userFinishedAction} />;
        default:
          //console.warn("Unknown question format:", format);
          return null;
     }
   };
 
   const userFinishedAction = () => {
    // user finishing an action means the user has completed making all the selections, filling in the blanks, or recording an audio...
    // and the question is ready for checking
    //console.log("MMMMMM User userFinishedAction");
    // enable the Check button in ButtonSection
    //setCheckButtonDisabled(false); // Enable the Check button
    //buttonSelectionRef.current?.enableCheckButton(); // This will enable the Check button in ButtonSection
    // ask ButtonSection to show the Check button
  }

  useEffect(() => {
    // Listen for keyboard events
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        console.log("Keyboard shown with height: ", event.endCoordinates.height);
        setKeyboardHeight(event.endCoordinates.height); // Get the keyboard height
        //setKeyboardVisible(true); // Set keyboard visibility to true
      }
    );
/*
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0); // Reset keyboard height
        setKeyboardVisible(false); // Set keyboard visibility to false
      }
    );
  */
    // Cleanup listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      //keyboardDidHideListener.remove();
    };
  }, []);


  useEffect(() => {
    // this hook is only called once after link to quiz (in unit) is clicked
    const fetchQuestion = async () => {
      if (id) {
        //console.log("Fetching question with id: ", id);
        const url = `${domain}/api/questions/${questionId}`;
        //console.log("^^^^^^^^^^^^^ Fetching question from URL: ", url);
        const response = await fetch(url);
        if (!response.ok) {
          console.error("Failed to fetch question");
          return;
        }
        const questionData = await response.json();
        //console.log("************** Fetched Question Data:", questionData);
       // if (questionData.end_of_quiz) {
        //  setEndOfQuiz(true); // Set endOfQuiz state to true
       //   return;
       // } else {
          //setId(questionData.question_attempt_id); // Ensure question_attempt_id is a string before setting it
          setFormat(questionData.format); // Ensure format is a string before setting it
          setAnswerKey(questionData.answer_key);
          setTheQuestion(questionData); // Set the question data in state
          if (questionData.format.toString() === '1')
          {
            //setJustifyContentValue('center')
            //setButtonMarginBottom(keyboardHeight > 0 ? keyboardHeight : null);
          }
      }
    };
    fetchQuestion().catch(console.error);
   
  }, [id, domain]);
  
  const memoizedDisplayQuestion = useMemo(() => {
    if (!theQuestion) return null; // Return null if theQuestion is not available
    return displayQuestion(
      theQuestion.format.toString(),
      theQuestion.content,
      theQuestion.button_cloze_options
    );
  }, [theQuestion]); // Recompute only when theQuestion changes

  const renderButtonRow = (format: string) => {
      return (
        <>
          {showContinueButton ? (
            <Button title="Continue" onPress={handleContinue} />
          ) : (
            <Button title="Check" onPress={handleCheck} />
          )}
        </>
      );
  };

  if (endOfQuiz) {
    //end_of_quiz_player.play(); // Play the end of quiz audio
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'purple' }}>
      <Text style={{ fontSize: 20, color: 'black' }}>End of Quiz Reached</Text>
      <Text style={{ fontSize: 16, color: 'gray' }}>Thank you for completing the quiz!</Text>
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe_area_container}>
      <Stack.Screen
        options={{
        title: theQuestion ? `Question: ${theQuestion.question_number}` : '',
          headerTitleAlign: 'center',
          headerTitleStyle: theQuestion
          ? { color: 'black',  fontSize: 16 } // Style when theQuestion is loaded
          : { color: 'gray', fontSize: 16 }, // Style when theQuestion is not loaded
          headerLeft: () => (
            <HeaderBackButton onPress={() => {
              // Navigate back to the quiz attempt screen
              router.replace(`/units/${unitId}`)
            }} />
          ),
        }
        }
      />

        <Animated.View style={[{ justifyContent: 'space-around', alignItems: 'center', height: '75%', backgroundColor: 'orange' }, animatedStylesImage]}>
        
           <View style={styles.questionContainer}>
                      {memoizedDisplayQuestion}
          </View>
        </Animated.View>
        <Animated.View style={[styles.resultsContainer, animatedStylesResults]}>
          <Text>{ 
            questionAttemptResults?.error_flag ? 'Sorry. The correct answer is: ' + QuestionAttemptHelper.format_answer_key( theQuestion?.answer_key || '', theQuestion?.format, theQuestion?.content || '')
             : 'Great Job'
                   
            }</Text>
        </Animated.View>
        <View style= {[styles.buttonContainer, { marginBottom: keyboardHeight > 0 ? keyboardHeight : 25 ,}]}>
         {renderButtonRow(theQuestion?.format.toString() || '')} 
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/*
(answer_key: string, format: number | undefined, content: string): string | undefined => {
theQuestion?.answer_key
 QuestionHelper.format_user_answer(arg.user_answer, arg.answer_key!, 
  questionAttemptResults
                      ? `Score: ${questionAttemptResults.score}, ${questionAttemptResults.error_flag ? 'Sorry' : 'Great Job'}, 
                      Correct Answer: ${theQuestion?.answer_key}`
                      : 'Results will be displayed here after checking the answer.'
*/

  const styles = StyleSheet.create({
    safe_area_container: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: 'blue',
  },
    container: {
      //flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    questionContainer: {  
      flex: 1, // the parent allows the children to expand fully.
      width: '90%', // allows children take up full screen width
      
      //position: 'relative',
      //top: 0,
      //left: 0,
    
   },
    resultsContainer: { 
      position: 'absolute',  // meaning it is positioned relative to the viewport (screen)
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'lightgreen', 
      height: '30%' ,
      zIndex: -1,
      //opacity: 0,
    },
    buttonContainer: {
      position: 'absolute',  // meaning it is positioned relative to the viewport (screen)
      left: 0,
      right: 0,
      bottom: 20,
      marginHorizontal: 20,
      borderRadius: 15,
      //justifyContent: 'center', 
      //alignItems: 'center', 
      backgroundColor: 'red', 
      //height: '10%' ,
      opacity: 1,
      zIndex: 0,  // Ensure the button container is above the results container
    },
  });

