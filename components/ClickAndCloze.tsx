import { AudioPlayer, AudioSource, createAudioPlayer } from 'expo-audio';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { ChildQuestionRef } from './type';
//import { useAnswerRefContext } from './context/AnswerRefContext';




interface DraggableItemProps {
  id: number;
  word: string;
  available_slots_array: boolean[]; // Array to track available drop boxes
  parent_funct: (droppedIndex: number, availability: boolean) => void; // Function to call when an item is dropped
}


interface InputItem {
  type: 'text' | 'input';
  value: string;
  id: string; // Optional for text items
}

interface ClickAndClozeProps {
    content: string | undefined;
    choices: string;
    enableCheckButton: () => void; // Optional parent function to call
    ref?: React.Ref<ChildQuestionRef>;
  }

 const ClickAndCloze: React.FC<ClickAndClozeProps> = ({ ref, content, choices, enableCheckButton }) => {
 
  const [inputFields, setInputFields] = useState<InputItem[] | undefined>([]);
  //const [maxLength, setMaxLength] = useState<number>(0);

  const charWidth = useRef<number>(10); // Default width

  const answer_arr = useRef<string[]>([]); // Store the answer string

 const MAX_ITEMS = 100;

 const [maxDropBoxWidth, setMaxDropBoxWidth] = useState<number>(0); // default max width for drop box is 10 characters

 const draggableTranslateXs = Array.from({ length: MAX_ITEMS }, () => useSharedValue(0));
 const draggableTranslateYs = Array.from({ length: MAX_ITEMS }, () => useSharedValue(0));

 const [readyToRenderDropView, setReadyToRenderDropView] = useState<boolean>(false);

      const availableDropBoxes = useRef<boolean[]>([]);
  
    // coordinates of dropBoxRects is relative to dropViewRect
   const dropBoxRects = useRef<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
   const dropBoxContainerRects = useRef<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const dropViewRect = useRef<{ x1: number; y1: number; x2: number; y2: number }>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const containerRect = useRef<{ x1: number; y1: number; x2: number; y2: number }>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });


   // coordinates of draggableRects is relative to draggableViewRects
    const draggableRects = useRef<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
    // coordinates of dragViewRec is relative to container
    const [dragViewRect, setDragViewRect] = useState({
      x1: 0, y1: 0, x2: 0, y2: 0
    })

  useImperativeHandle(ref, () => ({
      getAnswer,
  }));

  const getAnswer = () => {
    //console.log("******** ClickAndCloze getAnswer user answer = ", answer_arr.current);
    //setInputFields(undefined)
    return answer_arr.current; // Return the answer as a string
  }

  
  

  useEffect(() => {
        // reset availableDropBoxes
        availableDropBoxes.current = [];
    // spliet content by spaces
        const array = content?.split(' ');
        // ["How ", "are", " you? # I'm fine, ", "thank"," you." ]
        //[ "How ","are", " you? ", "<br />", " I'm fine, ","thank", " you." ]
        // Filter out empty strings that might result from consecutive brackets
        //const filteredArray = array?.filter(item => item.trim() !== "");
        let drop_box_count = 0;
        const cloze_content_array = array?.map((part, index) => {
          if (part.includes('#')) {
            //console.log(" found new line tag =", part)
            return { id: "new_line_" + index.toString(),  type: 'newline_tag', value: part,}
          }
          else if (part.includes('[')) {
            const drop_box_id = "drop_box_" + drop_box_count.toString();
            drop_box_count += 1;
            return { id: drop_box_id,  type: 'input', value: " ",}
          }
          else {
            return { id: "word_"+ index.toString(), type: 'text', value: part}
          }
        })
       
        availableDropBoxes.current = new Array(drop_box_count).fill(true); // Initialize all drop zones as available
        console.log("cloze_content_array=", cloze_content_array)
        setInputFields(cloze_content_array as InputItem[] | undefined);
        
      const myWorklet = () => {
        'worklet';
        // Perform UI-related operations here, e.g., start an animation
       // console.log('Worklet executed on UI thread!');
        choices.split('/').forEach((_, index) => {
          draggableTranslateXs[index].value = 0; // Reset X position
          draggableTranslateYs[index].value = 0; // Reset Y position
        });
        // You can also perform other UI-related tasks here
        // For example, you can log the content or perform animations
      };
  
      // Call runOnUI to execute the worklet on the UI thread
      runOnUI(myWorklet)(); 
  
    }, [content, choices]);
  
 

    //const combinedGesture = Gesture.Simultaneous(tabGesture, panGesture);

    const handleDropBoxOnLayout = (event: LayoutChangeEvent, item_id: string) => {
      const {width, x, y, height} = event.nativeEvent.layout;
       //console.log("&&&&&&&&&&& DropBox Layout::: width=", width, "height = ", height, " x = ", x, "y = ", y);
      // console.log(" drop box: item id = ", item_id);
         const index = parseInt(item_id.split('_')[2]); // Extract the index from the item id
       if (width === 0 || height === 0) {
        console.warn("DropBox width or height is 0, skipping layout update.");
        return; // Skip if width or height is 0
      }
        const newDropBoxRect = {
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height,
        };
        //dropBoxRects.current.push(newDropBoxRect);
        dropBoxRects.current[index] = newDropBoxRect; // Update the specific index
    };

    const handleDropBoxContainerOnLayout = (event: LayoutChangeEvent, item_id: string) => {
      const {width, x, y, height} = event.nativeEvent.layout;
         //console.log(" drop box container, item id = ", item_id);
         const index = parseInt(item_id.split('_')[2]); // Extract the index from the item id
      //console.log("&&&&&&&&&&&&&&&&& DropBoxContainer Layout::: width=", width, "height = ", height, " x = ", x, "y = ", y);
         //console.log(" &&&&&&&&&&&&&&&&&  handleDropBoxContainerOnLayout::: width=", width, "height = ", height, " x = ", x, "y = ", y);
         if (width === 0 || height === 0) {
        console.warn("DropBoxContainer width or height is 0, skipping layout update.");
        return; // Skip if width or height is 0
      }
        const newDropBoxContainerRect = {
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height,
        };
        //dropBoxContainerRects.current.push(newDropBoxContainerRect);
        dropBoxContainerRects.current[index] = newDropBoxContainerRect; // Update the specific index
    };
  
   
      const handleDragViewOnLayout = (event: LayoutChangeEvent) => {
        const { width, x, y, height } = event.nativeEvent.layout;
         if (width === 0 || height === 0) {
          console.warn("DragView width or height is 0, skipping layout update.");
          return; // Skip if width or height is 0
        }
        //console.log("DragView Layout::: width=", width, "height = ", height, " x = ", x, "y = ", y);
        //console.log("DragView Layout is relative to the parent container which is dragView");
        setDragViewRect({
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height,
        });

      }

      const handleDropViewOnLayout = (event: LayoutChangeEvent) => {
        const { width, x, y, height } = event.nativeEvent.layout;
        //console.log("DropView Layout::: width=", width, "height = ", height, " x = ", x, "y = ", y);
        if (width === 0 || height === 0) {
          console.warn("DropView width or height is 0, skipping layout update.");
          return; // Skip if width or height is 0
        }
        //console.log("DropView Layout is relative to the parent container which is container");
        // Update the ref value directly
        dropViewRect.current = {
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height,
        };
      
        //console.log("Updated dropViewRect:", dropViewRect.current);
      };

      const handleContainerOnLayout = (event: LayoutChangeEvent) => {
        const { width, x, y, height } = event.nativeEvent.layout;
        //console.log("Container Layout::: width=", width, "height = ", height, " x = ", x, "y = ", y);
      
        // Update the ref value directly
        containerRect.current = {
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height,
        };
        //console.log("Updated dropViewRect:", containerRect.current);
      };
      const parent_function = (dropped_index: number, availability: boolean) => {
        // this function is called from the DraggableItem component to set the avaibility of the drop box
        // 
        //console.log(" ******** parent_function availableDropBoxes = ", availableDropBoxes.current);
        //console.log("parent_function dropped_index = ", dropped_index);
        availableDropBoxes.current[dropped_index] = availability; // Update the ref value directly
        //console.log("Updated availableDropBoxes:", availableDropBoxes.current);
        // find the next available drop box
        // are there any available drop boxes?
        const dropBoxesAvailable = availableDropBoxes.current.some((available) => available === true);
        if( !dropBoxesAvailable) {
          // No available drop boxes left. This mean the user's finished dropping. Send message to parent component (question_attempt) so that it can enable Check button.");
          enableCheckButton();
          //return; // No available drop box found
        }
       // nextAvailableDropBoxIndex.current = availableDropBoxes.current.findIndex((available) => available === true);
        //console.log("Next available drop box index:", nextAvailableDropBoxIndex.current);
       // if (nextAvailableDropBoxIndex.current !== -1) {
      //   console.log("Next available drop box index:", nextAvailableDropBoxIndex);
      //  }
      }

      const DraggableItem: React.FC<DraggableItemProps> = (
          {id, word, available_slots_array, parent_funct }
        ) => {

        const offsetX = useSharedValue(0); // Example shared value for animation
        const offsetY = useSharedValue(0); // Example shared value for animation

        const [droppedIndex, setDroppedIndex] = useState<number | undefined>(undefined); // State to track the dropped index
      
        const draggableRect = useRef<{ x1: number; y1: number; x2: number; y2: number }>({
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
        });

            
        const [mp3, setMp3] = useState<string>('');
        const [player, setPlayer] = useState<AudioPlayer>();

        const animatedStyles = useAnimatedStyle(() => {
          return {
            transform: [
              { translateX: offsetX.value },
              { translateY: offsetY.value }
            ],
          };
        });
      
        useEffect(() => {
            const my_mp3 = `https://kphamazureblobstore.blob.core.windows.net/tts-audio/${word}.mp3`
              //console.log('SortableWord mounted my_mp3 =', my_mp3);
              setMp3(my_mp3);
              setPlayer(createAudioPlayer(my_mp3));
        }
        , [word]);

        const handleDraggableOnLayout = (event: LayoutChangeEvent) => {
          const {width, x, y, height} = event.nativeEvent.layout;
          //console.log("********* handleDraggableOnLayout dragable index =", index);
          //console.log("handle Draggable onLayout::: ********* width=", width, "height = ", height, " x = ", x, "y = ", y);
          if (width === 0 || height === 0) {
            console.warn("Draggable width or height is 0, skipping layout update.");
            return; // Skip if width or height is 0
          }
            const newDraggableRect = {
              x1: x,
              y1: y,
              x2: x + width,
              y2: y + height,
            };
            draggableRect.current = newDraggableRect;  // rectangle of this draggable item
            draggableRects.current.push(newDraggableRect);  // array of all draggable rects
        
            //console.log("DraggableRects current length =", draggableRects.current.length, " choices length =", choices.split('/').length);
            if (draggableRects.current.length === choices.split('/').length) {
               //console.log("all draggables have been mounted");
               // get the max width among all draggables
               let maxWidth = 0;
               draggableRects.current.forEach((rect) => {
                const width = rect.x2 - rect.x1;
                //console.log(" draggable width =", width, " current maxDropBoxWidth =", maxDropBoxWidth);
                if (width > maxWidth) {
                  maxWidth = width;
                }
               });
                //console.log(" maxWidth among all draggables =", maxWidth);
                setMaxDropBoxWidth(maxWidth);
               setReadyToRenderDropView(true);
              // find the draggble with the largest width

              //console.log("All draggables have been mounted. DraggableRects:", draggableRects.current);
            }
        };
        // You would likely update 'offset.value' based on some interaction or prop
        // For example, if 'itemData' had a property that triggered animation:

         const handleTapGesture = (e: any) => {
           // play audio
           const mySrc: AudioSource = { uri: mp3 };
           //console.log('XXXXXXX Audio Source:', mySrc);
           player?.replace(mySrc);
            /* END do this to make player play the audio on every click */
           player?.play();
           player?.remove()
           // end play audio
          if (droppedIndex !== undefined) {
            // If the item has already been dropped, return item to original position
            offsetX.value = withTiming(0); // Reset X position
            offsetY.value = withTiming(0); // Reset Y position
            setDroppedIndex(undefined); // Reset the dropped index state
            // calll parent function to set this slot to be available again
            parent_funct(droppedIndex, true); // Call the parent function to set the slot as available
            return;
          }
         // console.log(" available_slots_array = ",available_slots_array);
          // look for the first available slot in available_slots_array
          const available_slot_index = available_slots_array.findIndex((available) => available === true);
     
          //console.log(" draggableRect", draggableRect.current);
        if (!available_slots_array || available_slot_index === -1) {
          //console.log("No available drop box found for the draggable item.");
          
          return; // No available drop box found
        }
          
          const dropbox_to_container_x1 = dropBoxRects.current[available_slot_index].x1 + dropBoxContainerRects.current[available_slot_index].x1 + dropViewRect.current.x1;
          //console.log("XXXXXX dropbox_to_container_x1 = ", dropbox_to_container_x1);
          //console.log("dropbox_to_container_x1 = ", dropbox_to_container_x1);
          const drop_box_width = dropBoxRects.current[available_slot_index].x2 - dropBoxRects.current[available_slot_index].x1;
          //console.log("drop_box_width = ", drop_box_width);
          const draggable_rect_width = draggableRect.current.x2 - draggableRect.current.x1;
          //console.log("draggable_rect_width = ", draggable_rect_width);
          const total_magin = (drop_box_width - draggable_rect_width) / 2;
          //console.log("total_magin = ", total_magin);
          
          const tempX = dropbox_to_container_x1 - dragViewRect.x1 - draggableRect.current.x1 // - draggableViewRects.current[index].x1
          
          //offsetX.value = withTiming(tempX + (total_magin / 2) ); // Add the margin to center the draggable item in the drop box
          offsetX.value = withTiming(tempX + total_magin); // Add the margin to center the draggable item in the drop box
         // offset.value = withTiming(tempX+ (total_magin / 2) ); // Add the margin to center the draggable item in the drop box
         const dropbox_to_container_y1 = dropBoxRects.current[available_slot_index].y1 + dropBoxContainerRects.current[available_slot_index].y1 + dropViewRect.current.y1;
         const tempY = dropbox_to_container_y1 - dragViewRect.y1 - draggableRect.current.y1; //
         offsetY.value = withTiming(tempY); // 
      
          answer_arr.current.push(word);
          // set the available slot at available_slot_index to false
          available_slots_array[available_slot_index] = false; // Update the ref value directly
          //console.log(" ******* available_slots_array = ", available_slots_array);

          setDroppedIndex(available_slot_index); // Update the dropped index state
         
          parent_funct(available_slot_index, false); // Call the parent function to set the slot as unavailable
         }
      
       // style={[  { width: charWidth.current * maxLength, height: 25, }, 
        return (
          <GestureDetector  gesture={Gesture.Tap().onStart((e) => runOnJS(handleTapGesture)(e)).onFinalize((e) => {
          })
          }>
          <Animated.View 
            onLayout={(e) => handleDraggableOnLayout(e)}
            style={[
              styles.draggableItem, 
              animatedStyles
              ]}>
            <Text style={styles.draggableText}>{word}</Text>
          </Animated.View>
          </GestureDetector>
        );
      };
      
   return (
     <GestureHandlerRootView>

       <View style={styles.container}
         onLayout={handleContainerOnLayout}
       >
         { readyToRenderDropView &&
         <View style={styles.dropView} onLayout={handleDropViewOnLayout}>
           {inputFields && inputFields.length > 0 &&
             inputFields!.map((item, index) => {
               if (item.type === 'text') {
                 return (
                   <Text key={item.id} style={styles.sentenceText}>
                     {item.value}
                   </Text>
                 );
               } else if (item.type === 'input' && item.id) {
                 return (
                   <View key={item.id} style={styles.dropBoxContainer}
                     onLayout={(event) => handleDropBoxContainerOnLayout(event, item.id)} //
                   >
                    <View
                       style={[
                         { width: maxDropBoxWidth, height: 43, marginVertical: 3, },
                         styles.dropBox,
                       ]}
                       onLayout={(event) => handleDropBoxOnLayout(event, item.id)} //
                     />
                    </View>
                 );
               }
               else
                 return null;
             })
           }
         </View>
 }
        
         <View style={styles.dragView} onLayout={handleDragViewOnLayout}>
           {
             choices.split('/').map((item, index) => {
               return (
                 <DraggableItem
                   key={index}
                   id={index}
                   word={item}
                   available_slots_array={availableDropBoxes.current}
                   parent_funct={parent_function}
                 />
               );
             })
           }
         </View>

       </View>
     </GestureHandlerRootView>
   )
};

export default ClickAndCloze;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: 'pink'
  },
  dragView: {
    height: hp(20),
    width: wp(93),
    marginHorizontal: 1,
    borderWidth: 0,
   
    flexWrap: 'wrap',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "purple",
    gap: 5,
},

  draggableItem: { 
    //height: 25,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: 'lightgray',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  draggableText: {
    color: 'black',
    fontSize: 16,
  
  },
  
  sentenceText: {
    color: 'black',
    backgroundColor: 'white',
    marginHorizontal: 3,
    fontSize: 16,
  },
  textUnderLine: {
    position: 'relative',
    top: -5,
    color: 'gray',
    backgroundColor: 'white',
    marginHorizontal: 2,
    textDecorationLine: 'underline',
    textDecorationColor: 'red',
    textDecorationStyle: 'solid',
  },
  
  gridLineStyle: {
    width: 100,
    height: 10,
   
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    
  },

  monospaceText: {  // this style is only used to calculate the width of a single character
    fontFamily: 'monospace', // Use a monospaced font for consistent character width
    fontSize: 16,
  },
  monospaceChar: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Use 'Courier' on iOS and 'monospace' on Android
    fontSize: 16,
  },
   
   
    dropView:{ 
      height: hp(20),
      width: wp(93),
      flexDirection: 'row', 
      justifyContent: 'flex-start',
      alignItems: 'center', 
      flexWrap: 'wrap', 
      backgroundColor: 'amber', 
    },

    dropBoxContainer: 
    { flexDirection: 'column', 
      alignItems: 'center',
      //backgroundColor: 'yellow',
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },

    dropBox: {
        borderWidth: 0,
        backgroundColor: "white",
        //borderBottomWidth: 1, // Thickness of the underline
        //borderBottomColor: "black", // Color of the underline
        zIndex: 0, // Ensure the drop zone is above the drag view
    },
    
});