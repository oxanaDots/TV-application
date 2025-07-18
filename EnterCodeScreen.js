import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import styles  from './styles';
import { collection, updateDoc, getDocs, doc, where, query } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

function EnterCodeScreen() {
    const authentication = getAuth()
    const user = authentication.currentUser
    const navigation = useNavigation()
    const [code, setCode] = useState()
    const [codeStatus, setCodeStatus] = useState(false)

    async function handleChange(text){

       setCode(text)

        if (text.length === 6){
            const match = await checkCode(text)
            setCodeStatus(match)

        } else{
            setCodeStatus(false)
            
        }
     
    }

    async function checkCode(code){

        try{

            const querry = query(collection(db,  'sessions'), where ('code', '==', code))
            const data = await getDocs(querry)
            

            if (!data.empty ){
                const sessionsDoc = data.docs[0]
                const sessionData = sessionsDoc.data()
                if(sessionData.userId === user.uid){
                     await updateDoc(doc(db, 'sessions', sessionsDoc.id),{
                    connected: true
                 })
                 return true
                }
                
            }

        }catch (err){
          console.error(err)
        }
    }

  return (
   <View style={styles.mainCont}>
    <Text style={styles.header}>
        Enter connection code:
    </Text>
    <TextInput
    value={code}
    onChangeText={handleChange}
    style={[currentStyles.textInput, codeStatus && {borderColor: 'rgb(57, 181, 88)'}]}
    placeholder=''
    maxLength={6}
    autoCapitalize="characters"
     keyboardType="default" 
     editable={!codeStatus}
     autoFocus
    />

  

{/* {codeStatus === true ?
<TouchableOpacity style={currentStyles.successButton} onPress={()=> navigation.navigate('Gallery')}>
    <Text style={styles.buttonText}>Next</Text>
</TouchableOpacity>:
''

} */}
<TouchableOpacity style={currentStyles.successButton} onPress={()=> navigation.navigate('Gallery')}>
    <Text style={styles.buttonText}>Next</Text>
</TouchableOpacity>

   </View>
  );
}

export default EnterCodeScreen;


const currentStyles=StyleSheet.create({

    successButton:{
     display:'flex',
     width: 30 * 6 - 18,
    alignItems:'center',
    marginTop: 20,
    paddingHorizontal: 5,
    paddingVertical: 20,
    backgroundColor: 'rgb(57, 181, 88)',
    borderRadius: 100,
    },
      textInput:{
        backgroundColor: 'rgb(244, 244, 245)',
        width: 30 * 6 - 18,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor:'rgb(212, 212, 216)',
        paddingVertical: 15,
       borderRadius: 3,
       fontSize: 30,
       color: 'rgb( 82, 82, 91)'
        
    },


})