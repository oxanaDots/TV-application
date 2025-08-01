import { useEffect } from 'react';
import { useState } from 'react';
import Swiper from 'react-native-swiper';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { fetchFromDir } from './utility_functions/fetchFromDir';
import { getAuth } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function GalleryScreen() {
const currentUser = getAuth().currentUser

const [images, setImages] = useState([]);
const[details, setDetails] = useState({})
console.log('CURENT user',currentUser)


async function handleFetch ()  {
  //update businessDoc
try{
   const fetched = await fetchFromDir();
  console.log(fetched)
  if (fetched) {
    setImages(fetched.images);
     console.log('detailss',fetched.details)
    setDetails(fetched.details)
  }

    const businessRef = doc(db, 'businesses', currentUser.uid);
    if(businessRef){
      console.log('businessref 🔑', businessRef)

    } else{
      console.error(error)
    }
  await updateDoc(businessRef, { currentlyDisplaying: true });
}catch(err){
console.error(err)
}
 

};

 useEffect(() => {
  console.log('Images updated:', images);
  console.log('details',details)
}, [images]);


  return (
    <View style={styles.displayCont}>

   {images.length === 0 &&
  
   <View style={styles.cont}>

    <View style={styles.textCont}>
    <Text style={styles.mainHeader}>Current artist: Name Surname</Text>
     </View>
<View style={styles.buttonCont}>
       <TouchableOpacity style={styles.displayButton} onPress={()=>handleFetch()}>
        <Text style={styles.buttonText}>Start Displaying</Text>
      </TouchableOpacity>
    </View>
   </View>
    }

 {images.length > 0 && <View  style={styles.mainDisplayCont} >
 
 <Swiper
  autoplay={true}
  
  autoplayTimeout={7}
  loop={true}
  showsPagination={true}> 
 {images.map((url, index) =>{
  console.log('url is',url)
  return(
  <View key={index} style={styles.imagesDisplayCont}>
      <Image source={{ uri: url }} style={styles.image} />
    </View>)}
  )}
 </Swiper>  



<View style={styles.textCont}>

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

</View>
  
  }
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
     justifyContent:'space-between',
    gap:10,
    
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
 justifyContent:'space-between',
flex:1


  },

  imagesDisplayCont:{
  
     width: '100%',
    height:'auto'
  },
  image:{
  
      width:'80%',             
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
   
  }
})