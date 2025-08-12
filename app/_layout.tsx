// App.js
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from '../GalleryScreen';
import LogIn from '../LogIn';
import { useEffect, useState } from 'react';
import { writeToDir } from '../utility_functions/writeToDir';
import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native';


const Stack = createStackNavigator();
const [ cleared, setCleared] = useState(false)
// 
const DIRECTORY = FileSystem.documentDirectory + 'exhibition'
const IMAGES_DIR = `${DIRECTORY}/images`
const EXHIBITION_DETAILS_FILE = `${DIRECTORY}/exhibition_details.json`
const  todaysDate = new Date()
console.log('today', todaysDate)


export default function App() {
  const isTV = Platform.isTV;
  console.log('Is TV:', isTV);


  useEffect(()=>{
async function helper(){

const directory = await FileSystem.readDirectoryAsync(DIRECTORY);
const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)
    // CHECK IF CURRENT EXHIBITION HAS EXPIRED
      //  this condition means that the contents of the main directory, images and details json file, contain files and exhibition details of a current exhibition
  if(directory.length !== 0 && detailsDir.exists ){
           const link = detailsDir["uri"]
          const text = await FileSystem.readAsStringAsync(link);
          const parsed = JSON.parse(text);   
          const currentExhibitionExpireDate = parsed.expireAt
       // check if expire date of a current exhibition equals to today's date, if so, it has expired and contend of the main directory are deleted
          const expireBoolean = currentExhibitionExpireDate === todaysDate
          console.log('expire bool', expireBoolean)
          if(expireBoolean){
             await Promise.all(
              directory.map(async(file)=> {
                const path = `${DIRECTORY}/${file}`
                 return FileSystem.deleteAsync(path )
                }))
                setCleared(true)
            }else{
              return 
            }
        } 
       }
   helper()

  }, [])


  useEffect(() => {
    async function helper() {
      try {

        // read the contents of directories
        
        const directory = await FileSystem.readDirectoryAsync(DIRECTORY);
        const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)
        
        console.log('detailsDir exists',detailsDir)
        
        //  write images folder to main directory 
        if (directory.length === 0 || cleared ) {
           await FileSystem.makeDirectoryAsync(DIRECTORY, { intermediates: true });
           await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
           await writeToDir(IMAGES_DIR, EXHIBITION_DETAILS_FILE);
          
        } else{
          return 
        }
      } catch (error) {
        console.error( error);
      }
    }


    helper();
  }, []);


  useEffect(()=>{
    async function clearDirectory(directoryPath: string) {
  try {
    // 1. Get all items inside the directory
    const items = await FileSystem.readDirectoryAsync(directoryPath);
    console.log('Found items:', items);

    // 2. Delete each item
    await Promise.all(
      items.map(async (item) => {
        const itemPath = `${directoryPath}/${item}`;
        await FileSystem.deleteAsync(itemPath, { idempotent: true });
      })
    );

    console.log('Directory contents deleted!');
  } catch (error) {
    console.error('Error clearing directory:', error);
  }
}
// clearDirectory(DIRECTORY)
  }, [])


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


