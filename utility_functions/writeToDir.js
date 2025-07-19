import * as FileSystem from 'expo-file-system';
import { fetchExhibitionMaterial } from './fetchExhibitionMaterial';

 const DIRECTORY = FileSystem.documentDirectory + 'exhibition'
const IMAGES_DIR = DIRECTORY+'/images'
const EXHIBITION_DETAILS_FILE = `${DIRECTORY}/exhibition_details.json`

export async function writeToDir(IMAGES_DIR, EXHIBITION_DETAILS_FILE){
try{


 const dirFiles = await FileSystem.readDirectoryAsync(IMAGES_DIR)
 const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)


const data =  await fetchExhibitionMaterial()

 if(dirFiles.length === 0){
   const images = data.images
   await Promise.all(
    images.map((url, index)=>{
        const path = `${IMAGES_DIR}/artwork_${index}`
        return FileSystem.downloadAsync(url, path)
    })
)
 } 

const exhibitionDetails = {
     artistFirstName: data.artistFirstName,
      artistLastName: data.artistLastName,
     title: data.title,
     medium: data.medium,
     descr: data.descr,
     links: data.links

     
}

const detailsJsonString = JSON.stringify(exhibitionDetails)

if(!detailsDir.exists ){
   await FileSystem.writeAsStringAsync(EXHIBITION_DETAILS_FILE, detailsJsonString)
    console.log('true')

} else{
    console.log('false')

}


console.log('detailsdirAFTER', detailsDir)

}catch(err){
    console.error(err)
} 
}

