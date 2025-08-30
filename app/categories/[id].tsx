

import { useNavigationContext } from '@/components/context/NavigationContext';
import { HeaderBackButton } from '@react-navigation/elements';
import { useQuery } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Button, SafeAreaView, View } from 'react-native';
//import { Button } from 'react-native-paper';
import { sharedStyles } from '@/components/shared_styles';
import fetchSubCategories from '../../api/fetchSubCategories';
import { useDomainContext } from '../../components/context/DomainContext';
import { SubCategoryProps } from '../../components/types';

export default function CategoryScreen() {
  const { id , categoryName} = useLocalSearchParams(); // Extract the dynamic route parameter 'id'
 //const domain = useSelector((state: any) => state.domain.value); // Get domain from Redux store
 //const domain = useSelector((state: RootState) => state.domain.value);
 //const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
    // const [enableFindOrCreateQuizAttempt, setEnableFindOrCreateQuizAttempt] = useState(true);
      const {domain} = useDomainContext(); // Get domain from context
      const navigationContext = useNavigationContext(); // Get navigation context
      
      //const catName = categoryName ? categoryName : ''; // Ensure categoryName is a string
      const catName = Array.isArray(categoryName) ? categoryName[0] : categoryName; // Ensure categoryName is a string
      useEffect(() => {
        navigationContext.setCategoryId(Array.isArray(id) ? id[0] : id); // Set categoryId in navigation context
        navigationContext.setCategoryName(Array.isArray(categoryName) ? categoryName[0] : categoryName); // Set categoryName in navigation context
      }
      , [id, categoryName, navigationContext]);


//const queryClient = new QueryClient();
const { data, isLoading, error } = useQuery({
  queryKey: ['sub_categories'],
  queryFn: async () => {
    const data = fetchSubCategories(domain, Array.isArray(id) ? id[0] : id);
   //console.log("SubCategories Data: ", data);
    return data;
  },
});

  const handleClick = (subCategoryId: string, subCategoryName: string) => {
    //console.log(`SubCategory clicked: ${subCategoryId}, Name: ${subCategoryName}`);
    const queryParams = new URLSearchParams({
      subCategoryName: subCategoryName,
    });
    router.replace(`/sub_categories/${subCategoryId}?${queryParams.toString()}`);
  };
  

  return (

    <SafeAreaView style={sharedStyles.safe_area_container}>
      <Stack.Screen
        options={{
          title: catName, // Dynamically set the title
          //title: Array.isArray(categoryName) ? categoryName[0] : categoryName, // Dynamically set the title
            headerLeft: () => (
               <HeaderBackButton onPress={() => {
               
                 router.replace(`/`); // Navigate to home screen
    
               }} />
             ),
        }}
      />
      <View style={sharedStyles.container}>
         {data &&
           data.map((sub_category: SubCategoryProps, index: number) => (
            <View key={index} style={sharedStyles.button}>
            <Button
              key={index}
              title={sub_category.name}
              onPress ={() => handleClick(sub_category.id.toString(), sub_category.name)}
            />
             </View>
           
           ))}
      </View>

    </SafeAreaView>

  );
}

//textColor="white" // Change the text color
/*
const styles =  StyleSheet.create({
  safe_area_container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray'
  
},
    container: {
        flex: 1,
        gap: 10,
        justifyContent: 'center',
        marginHorizontal: 70,

    },

});

*/