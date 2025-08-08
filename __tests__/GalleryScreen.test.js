jest.mock('firebase/auth', ()=>({
    getAuth: jest.fn(() => ({
    currentUser: { uid: 'user_id' }
  }))
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


import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fetchFromDir } from '../utility_functions/fetchFromDir';
import GalleryScreen from '../GalleryScreen'

const Stack = createStackNavigator();
const images = Array.from({length: 10}, (_, i)=> `image${i}.jpg`)

describe('',()=>{

    beforeEach(()=>{
        updateDoc.mockResolvedValue({
        })

   doc.mockImplementation(() => ({}));

       fetchFromDir.mockResolvedValue({
        images: images, details:{
            artistFirstName: "ArtistName",
            artistLastName: "ArtistsLAstName",
            title: 'TestTitle',
            links:['www.artist.com']
        }}
       )

         });
  
 


    it ('Navigates to Gallery on successfull login', async()=>{


                try {
            render(<GalleryScreen />);
            } catch (e) {
            console.error('GalleryScreen threw:', e);
            }


        const galleryCont = await screen.findByTestId('display-cont');

        expect(galleryCont).toBeTruthy();

        const displayBtn = await screen.findByTestId('disply-btn');
        fireEvent.press(displayBtn)



    })
})