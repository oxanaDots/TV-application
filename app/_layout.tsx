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

 const [cleared, setCleared] = useState(false)
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
        await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
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
 

//   useEffect(()=>{
// async function helper(){


// const directory = await FileSystem.readDirectoryAsync(DIRECTORY);
// const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)

//     // CHECK IF CURRENT EXHIBITION HAS EXPIRED
//       //  this condition means that the contents of the main directory, images and details json file, contain files and exhibition details of a current exhibition
//   if(directory.length !== 0 && detailsDir.exists ){
  
//           const link = detailsDir["uri"]
//           const text = await FileSystem.readAsStringAsync(link);
//           const parsed = JSON.parse(text);   
//           const currentExhibitionExpireDate = parsed.expireAt
//        // check if expire date of a current exhibition equals to today's date, if so, it has expired and contend of the main directory are deleted
//           const expireBoolean = currentExhibitionExpireDate === todaysDate
//           console.log('expire bool', expireBoolean)
//           if(expireBoolean){
//              await Promise.all(
//               directory.map(async(file)=> {
//                 const path = `${DIRECTORY}/${file}`
//                  return FileSystem.deleteAsync(path )
//                 }))
//                 setCleared(true)
//             }else{
//               return 
//             }
//         } 
//        }
//   // helper()

//   }, [])


//   useEffect(() => {
//     async function helper() {
//       try {

//         // read the contents of directories
    
        
//         const directory = await FileSystem.readDirectoryAsync(DIRECTORY);
//         const images = await FileSystem.readDirectoryAsync(IMAGES_DIR);

//         const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)
//        console.log('-------------------')
//         console.log('directory',directory)
//            console.log('images',images)
//             console.log('details',detailsDir)
        
//         //  write images folder to main directory 
//         if (images.length === 0 && !detailsDir.exists || cleared ) {
         
//            await writeToDir(IMAGES_DIR, EXHIBITION_DETAILS_FILE);
          
//         } else{
//           console.log('has images')
//           return 
//         }
//       } catch (error) {
//         console.error( error);
//       }
//     }


//     // helper();
//   }, [cleared]);





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


