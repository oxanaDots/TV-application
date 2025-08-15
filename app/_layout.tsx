// App.js
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from '../GalleryScreen';
import LogIn from '../LogIn';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native';


const Stack = createStackNavigator();

// 
const DIRECTORY = FileSystem.documentDirectory + 'exhibition'
const IMAGES_DIR = `${DIRECTORY}/images`
const EXHIBITION_DETAILS_FILE = `${DIRECTORY}/exhibition_details.json`
const  todaysDate = new Date()
// console.log('today', todaysDate)


export default function App() {
  const isTV = Platform.isTV;
  console.log('Is TV:', isTV);

 
 const [dirsCreated, setDirsCreated] = useState(false)



useEffect( ()=>{
  async function helper (){
  try{
    
    await FileSystem.deleteAsync(DIRECTORY)
  } catch(err){
   console.log(err)
  }
  }

//  helper()

}, [])

 useEffect(()=>{
    async function helper(){
        try{
        const directory = await FileSystem.getInfoAsync(DIRECTORY);
        console.log('directory', directory)
        if (!directory.isDirectory){

          console.log('dir does not exist')
        await FileSystem.makeDirectoryAsync(DIRECTORY, { intermediates: true });
        setDirsCreated(true)
        } else{
          console.log('directory exists')
        }


      
         
         
        } catch(err){
          console.log(err)
        }
    }
      helper()
 }, [])

console.log('dircreated2',dirsCreated)
 




  return (
      <Stack.Navigator 
        initialRouteName="Log In"
        screenOptions={{
          headerShown: !isTV, 
          gestureEnabled: !isTV, 
          cardStyle: {
            backgroundColor: isTV ? '#000' : '#fff',
          },
        }}>
        <Stack.Screen name="Log In" component={LogIn} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
      </Stack.Navigator>
  );
}


