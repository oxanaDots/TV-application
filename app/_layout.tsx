// App.js
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from '../GalleryScreen';
import LogIn from '../LogIn';
import { useEffect } from 'react';
import { writeToDir } from '../utility_functions/writeToDir';
import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native';

const Stack = createStackNavigator();
const DIRECTORY = FileSystem.documentDirectory + 'exhibition'
const IMAGES_DIR = `${DIRECTORY}/images`
const EXHIBITION_DETAILS_FILE = `${DIRECTORY}/exhibition_details.json`


export default function App() {
  const isTV = Platform.isTV;
  console.log('Is TV:', isTV);
 useEffect(() => {
    async function helper() {
      try {
          await FileSystem.makeDirectoryAsync(DIRECTORY, { intermediates: true });
          await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
     
        const files = await FileSystem.readDirectoryAsync(DIRECTORY);
        const images = await FileSystem.readDirectoryAsync(IMAGES_DIR);
          const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)
     
       
        if (files.length !== 0 ) {
          console.log('Directory is empty. Fetch images first.');
          await writeToDir(IMAGES_DIR, EXHIBITION_DETAILS_FILE);

        } else {
          console.log('Directory has images. No need to fetch.');
        }

       

 console.log('Files in directory:', files);

      } catch (error) {
        console.error('Error during setup:', error);
      }
    }


    helper();
  }, []);


//   useEffect(()=>{
//     async function clearDirectory(directoryPath: string) {
//   try {
//     // 1. Get all items inside the directory
//     const items = await FileSystem.readDirectoryAsync(directoryPath);
//     console.log('Found items:', items);

//     // 2. Delete each item
//     await Promise.all(
//       items.map(async (item) => {
//         const itemPath = `${directoryPath}/${item}`;
//         await FileSystem.deleteAsync(itemPath, { idempotent: true });
//       })
//     );

//     console.log('Directory contents deleted!');
//   } catch (error) {
//     console.error('Error clearing directory:', error);
//   }
// }
// clearDirectory(DIRECTORY)
//   }, [])


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


