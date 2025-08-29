import { AudioSource, createAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const mp3 = 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-bounce.m4a'
//const mp3 = "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3"
//const mp3 = "https://kevinphambucket.s3.us-east-1.amazonaws.com/audios/recordings/giahuy/0b031b14-9512-4762-8f08-938b81f832bb-giahuy"
export default function MyAudioPlayer(props: { text_str: string | undefined, domain: string | undefined}) {

  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
  //const audioSource = { uri: mp3 };
  //const player = useAudioPlayer(audioSource);
  //const player = createAudioPlayer(audioSource);
  //const [player, setPlayer] = useState<AudioPlayer | null>(null);
  //const player = createAudioPlayer(audioSrc)
  //const playerStatus = useAudioPlayerStatus(player)

 // const [playing, setPlaying] = useState(false);

  const player = createAudioPlayer(audioSrc)



//const {domain} = useDomainContext(); // Get domain from context
//console.log('MyAudioPlayer: domain from context:', props.domain);
//const domain = "https://kphamenglish-f26e8b4d6e4b.herokuapp.com"; // hardcode for now, to be replaced with context
//const domain = "http://localhost:5001"; // hardcode for now, to be replaced with context

  const handleButtonPress = () => {
    //console.log('Button pressed');
    /* START do this to make player play the audio on every click.
    Otherwise, it plays only once and then does not play again
    kpham May 28, 2025 */
    const mySrc: AudioSource = { uri: audioSrc ?? mp3 };
    //console.log('XXXXXXX Audio Source:', mySrc);
    player.replace(mySrc);
     /* END do this to make player play the audio on every click */
    player?.play();
    player?.remove()
    
  };

  /*
  useEffect(() => {
    async function clearCache() {
      try {
        if (!FileSystem.cacheDirectory) {
          throw new Error('Cache directory is not available');
        }
        const cacheFiles = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
        for (const file of cacheFiles) {
          await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${file}`, { idempotent: true });
        }
        console.log('Cache cleared');
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }
  
    clearCache();
  }, []);
*/

/*
  useEffect(() => {
    let fileUri: string | null = null;
    async function sendRequest() {
      if (!props.text_str) {
        //console.error('MyAudioPlayer: Text string is undefined');
        return;
      }
      try {
        const url = `${props.domain}/api/tts/text_to_speech`
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: props.text_str ?? "error",
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
        // 1. Extract the base64 data
        //const base64Data = audioSrc.split(',')[1];//

        // 2. Create a temporary file
        const filename = `audio-${Date.now()}.mp3`;
        fileUri = `${FileSystem.cacheDirectory}${filename}`;
        //console.log('File URI:', fileUri);
        // Decode and write to a temporary file in the cache directory
        await FileSystem.writeAsStringAsync(fileUri, data.audioContent, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // 3. Create an audio player with the file URI 
        setAudioSrc(fileUri);
      } catch (error: any) {
        console.error('Error:', error.message);
      }
    }
    //FileSystem.deleteAsync(FileSystem.cacheDirectory ?? '')
    sendRequest();
    return () => {
      // Cleanup: Delete the temporary file when the component unmounts
      if (fileUri) {
        FileSystem.deleteAsync(fileUri, { idempotent: true }).catch((err) =>
          console.error('Error deleting file:', err)
        );
      }
    };
  }, [props.text_str, props.domain]);
*/

  /*
  useEffect(() => {
    return () => {
      console.log('MyAudioPlayer Component will unmount');
      //player?.release();
      //FileSystem.deleteAsync(FileSystem.cacheDirectory ?? '')
    };
  }, []);
*/

/* 
  useEffect(() => {
   console.log('Player status changed: ', playerStatus);
   if (playerStatus.didJustFinish) {
      console.log('Player just finished playing');
      // Do something when the player finishes playing
      playerStatus.playing = false;
    
      console.log('Player status: ', playerStatus.playing);
    }
  }, [playerStatus]);
  */

  useEffect(() => {
    async function sendRequest() {
      if (!props.text_str) {
        return;
      }
      try {
        const url = `${props.domain}/api/tts/text_to_speech`;
        console.log('MyAudioPlayer: Sending request to URL:', url);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: props.text_str ?? 'error',
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
  
        // Reuse a single temporary file
        const fileUri = `${FileSystem.cacheDirectory}audio-temp.mp3`;
        await FileSystem.writeAsStringAsync(fileUri, data.audioContent, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setAudioSrc(fileUri);
      } catch (error: any) {
        console.error('Error:', error.message);
      }
    }
  
    sendRequest();
  }, [props.text_str, props.domain]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center', backgroundColor: 'orange', padding: 0, borderRadius: 50 }}>
        <MaterialCommunityIcons name="arrow-right-drop-circle-outline" size={30} color="green" />
        </View>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  button: {
    backgroundColor: 'lightgray',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 50,
  },
  buttonText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

