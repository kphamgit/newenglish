

import { useNavigationContext } from '@/components/context/NavigationContext';
import { sharedStyles } from '@/components/shared_styles';
import { HeaderBackButton } from '@react-navigation/elements';
import { useQuery } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, View } from 'react-native';
import fetchUnits from '../../api/fetchUnits';
import { useDomainContext } from '../../components/context/DomainContext';
import { UnitProps } from '../../components/types';

export default function SubCategoryScreen() {
  const { id, subCategoryName} = useLocalSearchParams(); // Extract the dynamic route parameter 'id'
  //console.log('SubCategoryScreen render. Dynamic route id (sub category id):', id)
  //console.log('SubCategoryScreen render. Dynamic route categoryId:', categoryId) // Debug the extracted parameter
  //console.log('SubCategoryScreen render. Dynamic route categoryName:', categoryName); // Debug the extracted parameter
  //console.log('SubCategoryScreen render. Dynamic route subCategoryName:', subCategoryName); // Debug the extracted parameter
  // Debug the extracted parameter
 //const domain = useSelector((state: any) => state.domain.value); // Get domain from Redux store
 //const domain = useSelector((state: RootState) => state.domain.value);
 //const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
    // const [enableFindOrCreateQuizAttempt, setEnableFindOrCreateQuizAttempt] = useState(true);
      const {domain} = useDomainContext(); // Get domain from context
      const navigationContext = useNavigationContext(); // Get navigation context

      //console.log(" BBBBBBB inSubcategory Screen , categoryId from navigation context: ", navigationContext.categoryId);
      //console.log(" BBBBBBB inSubcategory Screen categoryName from navigation context: ", navigationContext.categoryName);
      const categoryId = navigationContext.categoryId; // Get categoryId from navigation context
      const categoryName = navigationContext.categoryName; // Get categoryName from navigation context

 
       useEffect(() => {
        navigationContext.setSubCategoryId(Array.isArray(id) ? id[0] : id); // Set subCategoryId in navigation context
        navigationContext.setSubCategoryName(Array.isArray(subCategoryName) ? subCategoryName[0] : subCategoryName); // Set subCategoryName in navigation context
  
       }, [id, subCategoryName, navigationContext]);
//const queryClient = new QueryClient();
const { data, isLoading, error } = useQuery({
  queryKey: ['units'],
  queryFn: async () => {
    const data = fetchUnits(domain, Array.isArray(id) ? id[0] : id);
    //console.log("in fetchUnit, Units Data: ", data);
    return data;
  },
});

  const handleClick = (unitId: string, unitName: string) => {
    //console.log(`Unit clicked: ${unitId}, Name: ${unitName}`);
    const queryParams = new URLSearchParams({
      unitName: unitName, // Ensure unitName is a string
    });
    router.replace(`/units/${unitId}?${queryParams.toString()}`);
  };

  return (
    <>
     
    <Stack.Screen 
        options={{
          title: Array.isArray(subCategoryName) ? subCategoryName[0] : subCategoryName, // Dynamically set the title
          headerStyle: {
            backgroundColor: 'orange', // Set the background color of the header
          },
          headerTitleStyle: {
            color: 'white', // Set the color of the title text
            fontWeight: 'bold', // Make the title text bold
            fontSize: 16, // Set the font size of the title text
          },
          headerLeft: () => (
            <HeaderBackButton onPress={() => {
              //console.log('Navigating back to categories screen');
              router.replace(`/categories/${categoryId}?categoryName=${categoryName}`); // Navigate to categories screen
 
            }} />
          ),
        }}
      />
      <SafeAreaView style={sharedStyles.safe_area_container}>
    <ScrollView contentContainerStyle ={{padding: 0,}}>
      <View style={sharedStyles.buttonWraper}>
       { data &&
         data.map((unit: UnitProps, index: number) => (
          <View key={index} style={[sharedStyles.button, ]}>
          <Button
            key={index}
            title={unit.name}
            onPress={() => handleClick(unit.id.toString(), unit.name)}

          />
          </View>
       
         ))}
         </View>
    </ScrollView>
    </SafeAreaView>
    </>
  );
}


