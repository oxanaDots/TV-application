
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

async function mockvaluesHelper( images, details,  parsedDetails,){
    
    
    readDirectoryAsync.mockResolvedValue(images)
    getInfoAsync.mockResolvedValue(details)
    readAsStringAsync.mockResolvedValue(parsedDetails )
}

import { documentDirectory, getInfoAsync, readAsStringAsync, readDirectoryAsync } from "expo-file-system";
  import { fetchFromDir } from "../utility_functions/fetchFromDir";
import * as FileSystem from 'expo-file-system';

  describe('', ()=>{

    beforeEach(()=>{


    })

    it ('Reads content length of the main directory', async ()=>{
       const images= Array.from({length: 5}, (_, i)=> `${documentDirectory}/exhibition/images/image${i}.jpg`)
       const returnedDetails = {"exists": true}
       const detailsObjs=  { artistFirstName: 'Firstname', artistsLAstNAme: 'Lastname', "title": 'Title Test'}
      const detailsAsJSON =  JSON.stringify(detailsObjs)
    

       await  mockvaluesHelper(images, returnedDetails, detailsAsJSON)

     const imagesDir = await readDirectoryAsync()
     const details = await getInfoAsync()
     const JSONString = await readAsStringAsync()
     const parsed = JSON.parse(JSONString)
     expect(imagesDir).toHaveLength(5);
     expect(details).toHaveProperty('exists', true);
     expect (parsed).toHaveProperty("artistFirstName", 'Firstname')

     const data = await fetchFromDir()
     expect(data).toHaveProperty('images', data.images);
    })

    it('', async()=>{
    await  mockvaluesHelper([], {"exists": false})
     const imagesDir = await readDirectoryAsync()
     const details = await getInfoAsync()
     

      expect(imagesDir).toHaveLength(0);
       expect(details).toHaveProperty('exists', false);
    
    })

    it('', async()=>{
        readDirectoryAsync.mockRejectedValue(new Error('Incorrect format'))
        expect(readDirectoryAsync('file:///exhibitions/images/image1.jpg')).rejects.toThrow('Incorrect format')
    })
  })