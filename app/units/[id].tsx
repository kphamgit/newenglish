

import { useNavigationContext } from '@/components/context/NavigationContext';
import { sharedStyles } from '@/components/shared_styles';
import { HeaderBackButton } from '@react-navigation/elements';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import fetchQuizzes from '../../api/fetchQuizzes';
import { useDomainContext } from '../../components/context/DomainContext';
import { useQuizAttemptContext } from '../../components/context/QuizAttemptContext';
import { QuizProps } from '../../components/types';

export default function UnitScreen() {
  //const { id, categoryId, categoryName, subCategoryName} = useLocalSearchParams(); // Extract the dynamic route parameter 'id'
  const { id, unitName,} = useLocalSearchParams(); // Extract the dynamic route parameter 'id'

  const navigationContext = useNavigationContext(); // Get navigation context
  const subCategoryId = navigationContext.subCategoryId; // Get subCategoryId from navigation context
  const subCategoryName = navigationContext.subCategoryName; // Get subCategoryName from navigation context
  const categoryId = navigationContext.categoryId; // Get categoryId from navigation context
  const categoryName = navigationContext.categoryName; // Get categoryName from navigation context
  
//categoryId, categoryName,
     const router = useRouter(); // Get the router object

     // const {  setId: setQuestionAttemptId } = useQuestionAttemptContext(); 

      const { domain } = useDomainContext(); // Get domain from context
      //const navigationContext = useNavigationContext(); // Get navigation context

       const { setId: setQuizAttemptId } = useQuizAttemptContext();
      
      const queryClient = new QueryClient();

      useEffect(() => {
        //needs to turn off any active quiz attempts queries upon entering this screen
        //console.log("UnitScreen ENTRY: Resetting quiz_attempt queries");
        queryClient.resetQueries({ queryKey: ['quiz_attempt'] });
      }, []);

      useEffect(() => {
        navigationContext.setUnitId(Array.isArray(id) ? id[0] : id); // Set unitId in navigation context
        navigationContext.setUnitName(Array.isArray(unitName) ? unitName[0] : unitName); // Set unitName in navigation context
      }, [id, unitName, navigationContext]);
        const user_id = "57"; // replace with actual user id  (user_name: 'b')
        //const quiz_id = "271"; // replace with actual quiz id

      const { data: quizzes } = useQuery({
            queryKey: ['quizzes'],
            queryFn: async () => {
              const data = fetchQuizzes(domain, Array.isArray(id) ? id[0] : id);
              //console.log("Quizzes Data: ", data);
              return data;
            },
      });

      const findOrCreateQuiz = (quiz_id: number) => {
        // use fetch to find or create a quiz attempt
        //console.log("Unit: findOrCreateQuiz");
        const url = `${domain}/api/quiz_attempts/find_create/${quiz_id}/${user_id}`;
        fetch(url)
          .then(response => response.json())
          .then( data => {
            //console.log("findOrCreateQuiz, Quiz Attempt Data fetched: ", data);
            //const question_id = data?.question.id;
            //const quiz_attempt_id = data?.quiz_attempt.id;
            setQuizAttemptId(data?.quiz_attempt.id); // Set the quiz attempt ID in the context
            const base_url = `/question_attempts/${data?.question_attempt_id}`; // Base URL for question attempt
            //console.log(" Unit: findOrCreateQuiz, base_url: ", base_url);
            const queryParams = new URLSearchParams({ 
              quizAttemptId: String(data?.quiz_attempt.id), // Ensure quizAttemptId is a string
              questionId: String(data?.question.id),
              //unitId: String(id)
            });
            
            const fullUrl = `${base_url}?${queryParams.toString()}`;
            //console.log(" Unit: findOrCreateQuiz, fullUrl: ", fullUrl);
            router.replace(fullUrl as `/question_attempts/${string}?${string}${string}`); // Navigate to the route programmatically
          })
          .catch(error => {
            console.error("Error fetching quiz attempt:", error);
          });
      }

  return (
  <>
   <Stack.Screen
        options={{
          title: unitName ? (Array.isArray(unitName) ? unitName[0] : unitName) : 'Unit', // Dynamically set the title
          headerLeft: () => (
            <HeaderBackButton onPress={() => {
              const queryParams = new URLSearchParams({
                //categoryId: Array.isArray(id) ? id[0] : id, // Ensure categoryId is a string
                subCategoryName: Array.isArray(subCategoryName) ? subCategoryName[0] : subCategoryName, // Ensure categoryName is a string
                categoryId: Array.isArray(categoryId) ? categoryId[0] : categoryId, // Ensure categoryName is a string
                categoryName: Array.isArray(categoryName) ? categoryName[0] : categoryName, // Ensure categoryName is a string
              });
              router.replace(`/sub_categories/${subCategoryId}?${queryParams.toString()}`); // Navigate to sub_categories screen
            }} />
          ),
        }}
      />
      <SafeAreaView style={sharedStyles.safe_area_container}>
     <ScrollView contentContainerStyle ={{padding: 0,}}>
       <View style={{ flex: 1, gap: 10, justifyContent: 'center', marginHorizontal: 25, backgroundColor: 'red', marginTop: 10}}>
         {quizzes && quizzes.map((quiz: QuizProps, index: number) => (
           <View key={index} style={[sharedStyles.button, ]}>
           <Button
             key={index}
               title={quiz.name}
                onPress={() => findOrCreateQuiz(quiz.id)}
           />
           </View>
        
          ))}
          </View>
     </ScrollView>
     </SafeAreaView>
  </>
   
  );
}

/*
  <SafeAreaView style={sharedStyles.safe_area_container}>
     <ScrollView contentContainerStyle ={{padding: 0,}}>
       <View style={{ flex: 1, gap: 10, justifyContent: 'center', marginHorizontal: 25, backgroundColor: 'red', marginTop: 10}}>
         {quizzes && quizzes.map((quiz: QuizProps, index: number) => (
           <View key={index} style={[sharedStyles.button, ]}>
           <Button
             key={index}
               title={category.name}
                onPress={() => findOrCreateQuiz(quiz.id)}
           />
           </View>
        
          ))}
          </View>
     </ScrollView>
     </SafeAreaView>
*/

const styles =  StyleSheet.create({
  safe_area_container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray'
  
},
scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        //backgroundColor: 'lightblue',
    },
    container: {
        flex: 1,
        gap: 2,
        justifyContent: 'center',
        marginHorizontal: 50,
      //  alignItems: 'center',
        backgroundColor: 'yellow',
    },
    pressable: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 5,
      //borderWidth: 1,
      //borderColor: 'blue',
    },
    pressableText: {
      color: 'blue',
      fontSize: 16,
      //fontWeight: 'bold',
    },
});
