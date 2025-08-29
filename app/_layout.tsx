import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { DomainProvider } from "../components/context/DomainContext";
import { NavigationContextProvider } from "../components/context/NavigationContext";
import { QuestionAttemptProvider } from "../components/context/QuestionAttemptContext";
import { QuizAttemptProvider } from "../components/context/QuizAttemptContext";

/*
export default function Home() {
  return (
    <View style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome tt to the Home Screen!</Text>
    </View>
  )
}
*/
const queryClient = new QueryClient();


export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContextProvider>
      <DomainProvider>
      <QuizAttemptProvider>
      <QuestionAttemptProvider>
      <Stack
        screenOptions={{
          headerShown: true, //do not show header (the word index on top of home screen) kpham
        }}>
      </Stack>
      </QuestionAttemptProvider>
      </QuizAttemptProvider>
      </DomainProvider>
      </NavigationContextProvider>
    </QueryClientProvider>
  )
}

// use Stack component from expo-router to create a stack navigator
// this will allow us to navigate between screens in the app
// the Stack component will automatically create a stack navigator for us
// we can use the screenOptions prop to customize the stack navigator
// for example, we can set the headerShown option to false to hide the header
// we can also use the Stack.Screen component (in index.tsx) to define the screens in the stack navigator
// the Stack.Screen component will automatically create a screen for us





