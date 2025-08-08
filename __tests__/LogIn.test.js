jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn()}))


jest.mock('firebase/firestore', ()=>({
    getDoc: jest.fn(),
    doc: jest.fn()

}))
jest.mock('../firebase', ()=>({
    auth: jest.fn(),
    db: jest.fn()
}))
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from '../LogIn'
import GalleryScreen from '../GalleryScreen'

const Stack = createStackNavigator();

describe('',()=>{

    beforeEach(()=>{
        getDoc.mockResolvedValue({
         exists: () => true,  
        data: () => ({ 
      email: 'business1_test@mail.com', 
      password: '123' ,
      role: 'business'
     
    })})

   doc.mockImplementation(() => ({}));

       signInWithEmailAndPassword.mockResolvedValue({
   
        user: {
       uid: "user_id",
        email: 'business1_test@mail.com',
      }
  })

         });
  
 


    it ('Navigates to Gallery on successfull login', async()=>{


    render (
   <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Log In" component={LogIn} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />

      </Stack.Navigator>
    </NavigationContainer>
        )

        const email = screen.getByPlaceholderText(/email/i);
        const password = screen.getByPlaceholderText(/password/i);
        const submitBtn = screen.getByTestId('submit-btn')
        fireEvent.changeText(email, 'business1_test@mail.com');
        fireEvent.changeText(password, '123');
        fireEvent.press(submitBtn)
        
        const galleryCont = await screen.findByTestId('display-cont');

        // expect(galleryCont).toBeTruthy();

    })
})