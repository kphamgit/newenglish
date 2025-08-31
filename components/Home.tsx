
import { useQuery } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { Button, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import fetchCategories from "../api/fetchCategories";
import { useDomainContext } from "./context/DomainContext";
import { sharedStyles } from "./shared_styles";
import { CategoryProps } from "./types";

 function Home() {
    //const theme = useTheme();
    const {setDomain} = useDomainContext();
    
    let domain = '';
    if (process.env.NODE_ENV === "production") {
      domain = 'https://kphamenglish-f26e8b4d6e4b.herokuapp.com';
      // set domain in context for other components to use
      //setDomain(domain);
     
    }
    else if (process.env.NODE_ENV === "development") {
       //domain = 'http://localhost:5001';
       domain = 'https://kphamenglish-f26e8b4d6e4b.herokuapp.com'; //for local development on physical iphone,
       // http://localhost:5001 doesn't work. 
      // set domain in context for other components to use
       //setDomain(domain);
      
    }
    else {
      console.log("invalid NODE_ENV ")
    }

    //  setDomain has to be called in useEffect, which happends after the component has mounted, i.e, after the rendering phase
    //  so that the context is updated correctly (kpham. 2025-07-03, error)
    //Cannot update a component (`DomainProvider`) while rendering a different component (`Home`)....
    
    useEffect(() => {
      //console.log("Home: useEffect: setting domain to ", domain);
      setDomain(domain); // Update the domain in context
    }, [domain, setDomain]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
          const data = fetchCategories(domain);
          //console.log("Categories Data: ", data);
          return data;
        },
      });

  const handleClick = (categoryId: string, categoryName: string) => {
    //console.log(`Category clicked: ${categoryId}, Name: ${categoryName}`);
    const queryParams = new URLSearchParams({
      categoryName: categoryName,
     });
    router.replace(`/categories/${categoryId}?${queryParams.toString()}`);
  };


  return (
    <>
       <Stack.Screen
        
        options={{
          title: 'Tieng Anh Phu Yen', // Set a static title for the home screen
          //headerTitle: 'Tieng Anh Phu Yen', // Dynamically set the title
          //headerShown: false,
          headerLeft: undefined, // Hide the back button
        }}
      />
  <SafeAreaView style={sharedStyles.safe_area_container}>
    <ScrollView contentContainerStyle ={{padding: 0,}}>
      <View style={{ flex: 1, gap: 10, justifyContent: 'center', marginHorizontal: 25, backgroundColor: 'red', marginTop: 10}}>
         {data && 
          data.map((category: CategoryProps, index: number) => (
          <View key={index} style={[sharedStyles.button, ]}>
          <Button
            key={index}
              title={category.name}
              onPress={() => handleClick(category.id.toString(), category.name)}
          />
          </View>
       
         ))}
         </View>
    </ScrollView>
    </SafeAreaView>
    </>
  )

}


/*
  <SafeAreaView style={sharedStyles.safe_area_container}>
    <ScrollView contentContainerStyle ={{padding: 0,}}>
      <View style={{ flex: 1, gap: 10, justifyContent: 'center', marginHorizontal: 25, backgroundColor: 'red', marginTop: 10}}>
         {data && 
          data.map((category: CategoryProps, index: number) => (
          <View key={index} style={[sharedStyles.button, ]}>
          <Button
            key={index}
              title={category.name}
              onPress={() => handleClick(category.id.toString(), category.name)}
          />
          </View>
       
         ))}
         </View>
    </ScrollView>
    </SafeAreaView>
*/


//   <DroppedItemsMapExample  onBack={() => console.log("HERE")} />
export const styles =  StyleSheet.create({
  safe_area_container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray',
},
    container: {
      //marginHorizontal: 70,
        flex: 1,
        
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center', // Center the container horizontally
        backgroundColor: 'lightgray',
    },
    button: {
      backgroundColor: 'lightgreen',
      padding: 10,
      borderRadius: 25,
      marginVertical: 5,
      //width: '100%', // Make the button full width
      alignItems: 'center', // Center the text inside the button
      borderWidth: 1,
      borderColor: 'gray', // Add a border to the button
      
    },

});

export default Home;

