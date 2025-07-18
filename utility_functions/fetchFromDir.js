import * as FileSystem from 'expo-file-system';

const DIRECTORY = FileSystem.documentDirectory + 'exhibition'
const IMAGES_DIR = `${DIRECTORY}/images`
const EXHIBITION_DETAILS_FILE = `${DIRECTORY}/exhibition_details.json`


export async function fetchFromDir( ){
    try{
        const images = await FileSystem.readDirectoryAsync(IMAGES_DIR)
       
        const files = images.map((file)=> `${IMAGES_DIR}/${file}`)
       
       let exhibitionDetails = null
        const exhibitionDetailsInfo = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE)

        if(exhibitionDetailsInfo.exists ){
            const detailsAsString = await FileSystem.readAsStringAsync(EXHIBITION_DETAILS_FILE)
             exhibitionDetails = JSON.parse(detailsAsString)
           
        }

        return {
            images: files,
            details: exhibitionDetails
        }
    } catch(err){
        console.error('error is',err)
    }
}