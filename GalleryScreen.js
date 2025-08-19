

import { useEffect } from 'react';

import { useState } from 'react';
import Swiper from 'react-native-swiper';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { fetchFromDir } from './utility_functions/fetchFromDir';
import { getAuth, signOut } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system'
import { writeToDir } from './utility_functions/writeToDir';

 const DIRECTORY = FileSystem.documentDirectory + 'exhibition'
 const IMAGES_DIR = `${DIRECTORY}/images`
 const EXHIBITION_DETAILS_FILE = `${DIRECTORY}/exhibition_details.json`
 const  todaysDate = new Date().toISOString()



function GalleryScreen() {
const currentUser = getAuth().currentUser

const [images, setImages] = useState([]);
const[details, setDetails] = useState({})
const [hasImages, setHasImages] = useState(false)
const [displaying, setDisplaying] = useState(false)
const navigation = useNavigation();
const [cleared, setCleared] = useState(false)


useEffect( ()=>{
  async function helper (){
  try{
    const directory = await FileSystem.readDirectoryAsync(DIRECTORY);
 
  await Promise.all(
      directory.map(async(file)=> {
        const path = `${DIRECTORY}/${file}`
        return FileSystem.deleteAsync(path )
        }))
  } catch(err){
    console.error(err)
  }
  }
    //  helper()
}, [])



useEffect(()=>{
  async function helper(){
  
  
  const directory = await FileSystem.readDirectoryAsync(DIRECTORY);
  const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)
  console.log('Details Directory', detailsDir)
      // CHECK IF CURRENT EXHIBITION HAS EXPIRED
        //  this condition means that the contents of the main directory, images and details json file, contain files and exhibition details of a current exhibition
    if(directory.length !== 0 && detailsDir.exists ){
   
    
            const link = detailsDir["uri"]
            console.log('link', link)
            const text = await FileSystem.readAsStringAsync(link);
            console.log('text', text)
            const parsed = JSON.parse(text);   
            const currentExhibitionExpireDate = parsed.expireAt.toString().slice(0, 10)
            console.log('expireDatefor current TYPE', currentExhibitionExpireDate)
            console.log('todays date',  todaysDate)
         // check if expire date of a current exhibition equals to today's date, if so, it has expired and contend of the main directory are deleted
            const expireBoolean = currentExhibitionExpireDate === todaysDate.slice(0, 10)
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
      
          console.log('-------------------')
          
          const directory = await FileSystem.readDirectoryAsync(DIRECTORY);
        
          const imagesDir = await FileSystem.getInfoAsync(IMAGES_DIR);
  
          const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)
          console.log('directory',directory)
             console.log('images',imagesDir.isDirectory)
              console.log('details',detailsDir)
          
          //  write images folder to main directory 
          if (currentUser){
             if ( !detailsDir.exists && !imagesDir.isDirectory|| cleared ) {
             console.log('no details')
              await FileSystem.makeDirectoryAsync(IMAGES_DIR);
             await writeToDir(IMAGES_DIR, EXHIBITION_DETAILS_FILE);
            
          } else{
            console.log('has images')
            return 
          }
          }
         
        } catch (error) {
          console.error( "Error is", error.message);
        }
      }
  
  
      helper();
    }, [cleared]);
    console.log(cleared)

  
  
  

useEffect(()=>{
async function handleFetch ()  {
  //update businessDoc
try{
   const fetched = await fetchFromDir();
  console.log(fetched)
  if (fetched ) {
    setHasImages(true)
  }
}catch(err){
console.error(err)
}
};

handleFetch()
}, [])


console.log(details)
 useEffect(() => {
  console.log('Images updated:', images);
  console.log('details',details)
}, [images]);

// fetch exhibition material from the filesystem and add current busienss to the list of currently displaying locations
  async function onClick(){
    const fetched = await fetchFromDir()
    if (fetched){
     setImages(fetched.images);
     setDetails(fetched.details)
     setDisplaying(true)
    }
     const businessRef = doc(db, 'businesses', currentUser.uid);
     await updateDoc(businessRef, { currentlyDisplaying: true });
}


async function onclose(){
  try{
     const businessRef = doc(db, 'businesses', currentUser.uid);
    await updateDoc(businessRef, { currentlyDisplaying: false });
     await signOut(auth);  
   
     navigation.navigate('Log In');
   
     console.log('click')
  } catch(err){
    console.error(err)
  }
}

console.log('Dsplaying', displaying)
console.log('HAsImages', hasImages)
  return (
    <View testID='display-cont' style={styles.displayCont}>

   
 { !hasImages && 
 <View style={styles.cont}>
        <Text style={{fontWeight:'800', fontSize: 20, paddingVertical: 10}}>No exhibitions to show </Text>
         <Text>Come back later</Text>
 </View>}

{ !displaying  && hasImages&&

  <View style={styles.cont}>
    <View style={styles.textCont}>
     </View>
      <View style={styles.buttonCont}>
       <TouchableOpacity  testID='disply-btn' style={styles.displayButton} onPress={()=>onClick()}>
        <Text style={styles.buttonText}>Start Displaying</Text>
      </TouchableOpacity>
    </View>
   </View>
}

{displaying  && hasImages&&
 <View  style={styles.mainDisplayCont} >

 <Swiper
  autoplay={true}
  
  autoplayTimeout={7}
  loop={true}
  showsPagination={true}> 
 {images.length>0 &&images.map((url, index) =>{
  console.log('url is',url)
  return(
  <View key={index} style={styles.imagesDisplayCont}>
      <Image source={{ uri: url }} style={styles.image} />
    </View>)}
  )}
 </Swiper>  

    {/* <Image source={{uri: images[0]}} style={styles.image} /> */}

<View style={styles.textCont}>
  <View  style={{display:'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
     paddingHorizontal: 10}}>
 <QRCode
        value="https://final-project-red-delta.vercel.app/"
        size={50}
        backgroundColor="white"
        color="black"
        />
        <TouchableOpacity  testID="close-btn" onPress={()=>onclose()} >
          <Text style={{fontSize: 25, paddingHorizontal: 10}}>&times;</Text>
        </TouchableOpacity>
        </View>
  <View style={{display:'flex'}}>
<View style={styles.textNameCont}>
   <Text style={{fontWeight:'800'}}>{details.artistFirstName} {details.artistLastName}</Text>
</View>
<Text style={{fontWeight:'800', fontStyle:'italic'}}>{details.title}</Text>
<Text>{details.medium}</Text>
</View>


<Text>{details.descr}</Text>
<View>
  {details.links?.map((link, index) => (
    <Text key={index}>{link}</Text>
  ))}
</View>


</View>

</View>}

   </View>
  );
}

export default GalleryScreen;

const styles= StyleSheet.create({
  mainCont:{
    display:'flex',
     alignItems:'center',
     alignContent:'center',
    
  
  },
  
  buttonCont:{


    alignSelf:'center',
    
  },
  cont:{
   flexDirection:'column',
      display:'flex',
   
    gap:10,
    paddingVertical: 30
  },

  mainHeader:{
      fontSize: 40,
      paddingVertical: 10,
      fontWeight:'bold',
      color: 'rgb(82, 82, 91)',


  },


  displayButton:{
    display:'flex',
    
    marginBottom:20,
    alignSelf:'baseline',

    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: 'rgb(46, 16, 101)',
    borderRadius: 3,

  },
  buttonText:{
    color: 'rgb(255, 247, 237)',
    fontWeight: 'bold',
    fontSize: 20,

  },

  mainDisplayCont:{
  flexDirection:'row',
 
     display:'flex',
     width: '100%',
     height: '100%'
  },

  displayCont:{
    display: 'flex',
flexDirection:'column',
     backgroundColor: 'rgb(244, 244, 245)',
 alignItems:'center',
 justifyContent:'center',
flex:1


  },

  imagesDisplayCont:{
  
     width: '100%',
    height:'auto'
  },
  image:{
  
      width:'95%',             
    height: '100%',             
 
  },
  cont:{
    display:'flex',
    alignContent:'center',
    flexDirection:'column',
    alignItems:'center'

  },
  textNameCont:{
    display: 'flex',
     flexDirection:'row',
  },
  textCont:{
    display: 'flex',
 display:'row',
 width:'30%',
    justifyContent:'space-between',
    paddingVertical: 10
   
  },
  qrCodeCont:{
 paddingVertical: 20
  }
})



