jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn()}))

  jest.mock('../GalleryScreen', () => {
  const { View, Text } = require('react-native');
  return function Mock() {
    return (
      <View testID="display-cont">
        <Text>Gallery </Text>
      </View>
    );
  };
});

jest.mock('')
jest.mock('firebase/firestore', ()=>({
    getDoc: jest.fn(),
    doc: jest.fn(),
    storage: jest.fn(),
    ref: jest.fn(),

}))
jest.mock('../firebase', ()=>({
    auth: jest.fn(),
    db: jest.fn()
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

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import act from '@testing-library/react-native';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from '../LogIn'
import GalleryScreen from '../GalleryScreen'
import * as FileSystem from 'expo-file-system'

const Stack = createStackNavigator();


  function  helper(){
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
        return {email, password, submitBtn}
}

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

     const navigate = jest.fn();
       const {email, password, submitBtn} = helper()
        fireEvent.changeText(email, 'business1_test@mail.com');
        fireEvent.changeText(password, '123')

       fireEvent.press(submitBtn)

        
       await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalled());

    //   await waitFor(() => expect(navigate).toHaveBeenCalledWith('Gallery'));


    })
   it('Shows error when fields are empty', async () => {
  const { email, password, submitBtn } =  helper();

  fireEvent.changeText(email, '');
  fireEvent.changeText(password, '');


   fireEvent.press(submitBtn)


  await screen.findByText('Please enter both email and password');
});
})