import { StyleSheet } from 'react-native';

export const sharedStyles =  StyleSheet.create({
  safe_area_container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'green',
    marginTop: 0,
},
    container: {
      //marginHorizontal: 70,
        
        flex: 1,
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center', // Center the container horizontally
        backgroundColor: 'green',
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