import { AudioModule, useAudioPlayer, useAudioRecorder } from 'expo-audio';
import React, { useEffect, useImperativeHandle } from 'react';
import { Pressable, Text, View } from 'react-native';

import { File } from 'expo-file-system/next';
import { fetch } from 'expo/fetch';
import { useDomainContext } from './context/DomainContext';
import { ChildQuestionRef } from './types';
/*
@/ is a shortcut alias for your project's root or src directory.    
*/

interface TranscriptionResult {
  text: string;
  usage: {
    seconds: number;
    type: string;
  };
}

interface SRQuestionProps {
    ref?: React.Ref<ChildQuestionRef>;
  }

    const MyRecorderNew: React.FC<SRQuestionProps> = ({ ref}) => {
//export default function MyRecorder(props: any) {
    const [playing, setPlaying] = React.useState(false);
    const [recording, setRecording] = React.useState(false);
    const [audioUri, setAudioUri] = React.useState('');
    const [transcription, setTranscription] = React.useState<TranscriptionResult>();
    const player = useAudioPlayer(audioUri)

     const {domain} = useDomainContext(); //

    const LowQualityWAV = {
      extension: '.wav',
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 64000,
      android: {
        outputFormat: 'AndroidOutputFormat.WAVE',
        audioEncoder: 'AndroidAudioEncoder.PCM_16BIT',
        audioEncodingBitRate: 64000,
        sampleRate: 16000,
        numberOfChannels: 1,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      ios: {
        audioQuality: 127,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
    };

    const audioRecorder = useAudioRecorder( LowQualityWAV)
    //const audioRecorder = useAudioRecorder( RecordingPresets.HIGH_QUALITY)
    //const audioRecorder = useAudioRecorder()
    console.log("audioRecorder", audioRecorder);
    useEffect(() => {
        getPermissions()
    }, [])

    const getPermissions = async () => {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (status.granted) {
            console.log("Recording permission granted");
        } else {
            console.log("Recording permission denied");
        }
    }
    
    const startRecording = () => {
        setRecording(true);
        audioRecorder.record()
    }

    const stopRecording = async () => {
        setRecording(false);
        //the recording will be available in audioRecorder.uri
        await audioRecorder.stop();
        //console.log("YYYYYYY Recording stopped audio URI = ", audioRecorder.uri);
        if (!audioRecorder.uri) {
            console.error("No audio URI found after recording");
            return;
        }
        console.log("******************** Recording stopped audio URI = ", audioRecorder.uri);
       
        //console.log("ZZZZZZYYYYYYYYY File Info URI:", fileInfo.uri);
        setAudioUri(audioRecorder.uri || '');
        const s = `file://${audioRecorder.uri}`;
        const src = new File(s || '');
        //src.
        const blob = src.blob();
        const formData = new FormData();

        formData.append('audio', blob );
        const url = `${domain}/api/upload/do_openai_transcribe` 
        console.log("***************XXXXXX  upload to openai_transcribe: url=", url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
        
          const result = await response.json();
          console.log(result);
          setTranscription(result);
          //{"text": "1, 2, 3, 4", "usage": {"seconds": 3, "type": "duration"}}

    }

    async function upload_to_google_transcribe(formData: any, config: any): Promise<any> {
        //const url = `${domain}/api/upload/do_upload_single_s3`;
     
        const url = `${domain}/api/upload/do_google_cloud_transcribe` 
        console.log("****** upload to do_google_cloud_transcribe: url=", url);
        const response = await fetch('url', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
        
          const result = await response.json();
          console.log(result);
      }

    async function upload_to_openAI_for_recognition(formData: any, config: any): Promise<any> {
        //const url = `${domain}/api/upload/do_upload_single_s3`;
     
        const url = `${domain}/api/upload/do_upload_openai` 
        console.log("****** upload_to_openAI_for_recognition: url=", url);
        try {
          const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: config?.headers || {} // Only set headers if present
          });
      
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Response error:', response.status, errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          return data;
        } catch (error: any) {
          console.error('Unexpected error:', error.message || error);
        }
      }

      useImperativeHandle(ref, () => ({
            getAnswer,
        }));
      
        const getAnswer = () => {
          //console.log("******** ClickAndCloze getAnswer called");
          if (!transcription) {
            console.log("No transcription available");
            return 'no transcription available';
          }
          return transcription.text; // Return the answer as a string
        }
    
  return (
    <>
      <View>
        <Pressable onPress={recording ? stopRecording : startRecording}>
          {recording ? <Text>Stop</Text> : <Text>Start</Text>}
        </Pressable>
        {transcription &&
          <View>
            <Text>{transcription.text}</Text>
          </View>
        }
      </View>

    </>
  )
}

export default MyRecorderNew
