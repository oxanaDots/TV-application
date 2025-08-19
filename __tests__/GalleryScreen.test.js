jest.mock('firebase/auth', ()=>({
    getAuth: jest.fn(() => ({
    currentUser: { uid: 'user_id' }})),
    signOut: jest.fn()
}))


jest.mock('firebase/firestore', ()=>({
    updateDoc: jest.fn(),
    doc: jest.fn()

}))


jest.mock('../firebase', ()=>({
    auth: jest.fn(),
    db: jest.fn()
}))


jest.mock('../utility_functions/fetchFromDir', ()=>({
    fetchFromDir: jest.fn(),
}))

jest.mock('expo-image', ()=>({
    Image: jest.fn()
}))
jest.mock('expo-file-system', () => ({
    downloadAsync: jest.fn(),
    getInfoAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    deleteAsync: jest.fn(),
    moveAsync: jest.fn(),
    copyAsync: jest.fn(),
    makeDirectoryAsync: jest.fn(),
    readDirectoryAsync: jest.fn(),
    createDownloadResumable: jest.fn(),
    documentDirectory: 'file:///mock/'
    
}));

jest.mock('../utility_functions/writeToDir', ()=>({
    writeToDir: jest.fn()
}))

import React from 'react';
import { render, fireEvent, screen, userEvent, waitFor } from '@testing-library/react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fetchFromDir } from '../utility_functions/fetchFromDir';
import GalleryScreen from '../GalleryScreen'
import * as FileSystem from 'expo-file-system'
import { Text, View } from 'react-native'
import { signOut } from 'firebase/auth'
const images = Array.from({length: 10}, (_, i)=> `image${i}.jpg`)

const Stack = createStackNavigator();


function LogInMock(){
  return(
    <View>
        <Text>Log In</Text>
    </View>
  )
}

  function  helper(){
 return render (
   <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Log In" component={LogInMock}/>

      </Stack.Navigator>
    </NavigationContainer>
        )

    
}

describe('',()=>{

    beforeEach(()=>{
        updateDoc.mockResolvedValue({currentlyDisplaying: true})

      doc.mockImplementation(() => ({}));

       fetchFromDir.mockResolvedValue({
        images: images, details:{
            artistFirstName: "ArtistName",
            artistLastName: "ArtistsLAstName",
            title: 'TestTitle',
            links:['www.artist.com']
        }}
       )

         FileSystem.readDirectoryAsync.mockResolvedValue(["images", "details.json"])
         FileSystem.getInfoAsync.mockResolvedValue({"exists": true, "uri": "file:///data/user/0/com.okssana.ExhibitionTV/files/exhibition/exhibition_details.json"})
         FileSystem.readAsStringAsync.mockResolvedValue(JSON.stringify({"artistFirstName":"Firstname","artistLastName":"Lastname","title":"My Exhibition",  "expireAt": '2025-08-21T10:11:12.000Z',}))
       

           jest.clearAllMocks();
         });
  
         


    it ('Starts display by clicking on "Start Displaying" button and ends display by clicking on the close button', async()=>{

                
        helper()
        const galleryCont = await screen.findByTestId('display-cont');
        expect(galleryCont).toBeTruthy();
        const displayBtn = await screen.findByTestId('disply-btn');
        await userEvent.press(displayBtn)
         const closeBtn = await screen.findByTestId("close-btn")
         await userEvent.press(closeBtn)
    })




        it("Populates the main directory with an image folder and a detail.json file if it's empty", async()=>{
       FileSystem.getInfoAsync.mockResolvedValue({"exists": false})
       FileSystem.getInfoAsync.mockResolvedValue({"isDirectory": false})
       FileSystem.makeDirectoryAsync.mockResolvedValueOnce(["images", "details.json"])
       helper()

       const newDir= await FileSystem.makeDirectoryAsync()
       expect (newDir).toHaveLength(2)
       

    })



  it ('Logs out the user and updates their Firestore document when the close button is pressed', async()=>{
         updateDoc.mockResolvedValueOnce({currentlyDisplaying: false});
        signOut.mockResolvedValueOnce({});
                
        helper()
       
         const galleryCont = await screen.findByTestId('display-cont');
        expect(galleryCont).toBeTruthy();
        const displayBtn = await screen.findByTestId('disply-btn');
        await userEvent.press(displayBtn)
         const closeBtn = await screen.findByTestId("close-btn")

       await userEvent.press(closeBtn)
        

        await waitFor(() => expect(signOut).toHaveBeenCalled());

        const [label] = await screen.findAllByText("Log In");
        expect(label).toBeTruthy();       
    })

  })