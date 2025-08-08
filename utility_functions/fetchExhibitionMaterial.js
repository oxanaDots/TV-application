
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebase';




export async function fetchExhibitionMaterial (){
const currentDay = Timestamp.fromDate(new Date());

 try{
   const querry = query(
          collection(db, 'exhibitions'),
          where('startsAt', '<=', currentDay),
          where ('status', '==', 'accepted'),
          where('expireAt', '>', currentDay))
          
          const currentExhibitionSnapShot = await getDocs(querry)
          const currentExhibition = currentExhibitionSnapShot.docs.map(doc => ({...doc.data(), docId: doc.id}))

   if (currentExhibition.length === 0){
    return null
   } else{
 
      return currentExhibition[0]
   }


 } catch(err){
   console.error(err)
 }

}