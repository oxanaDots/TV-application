
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';




export async function fetchExhibitionMaterial (){

 try{
   const snapshot = await getDocs(collection(db,'exhibitions'))
   const data = snapshot.docs.map(doc => ({
      id: doc.id,         
  ...doc.data() 
   }))

   if (data.length === 0){
    return
   }
   const exhibition = data[0]
  
   if (exhibition.status === 'accepted'){
  
     return exhibition
   } else{
    return undefined
   }

 } catch(err){
   console.error(err)
 }

}