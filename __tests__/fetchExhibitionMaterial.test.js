  jest.mock('firebase/firestore', ()=>({
    collection: jest.fn(),
    getDocs: jest.fn(),
    where: jest.fn(),
    query: jest.fn(),
    Timestamp: {
      fromDate: jest.fn()
    }

}))
  
  jest.mock('../firebase', ()=>({
    db: jest.fn()
  }))
  
import { fetchExhibitionMaterial } from "../utility_functions/fetchExhibitionMaterial";
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebase';


  describe ('', ()=>{
    beforeEach ( ()=>{
      const docs = Array.from({length:1}, (_, i)=> ({id: `id${i}`, data: ()=> ({status: 'accepted', artistName: `Artist${i}`})}))
      getDocs.mockResolvedValue({docs: docs})
    })
    it('Fetches exhibitions from firestore', async ()=>{


      const data = await fetchExhibitionMaterial()
      expect (data).toHaveProperty('artistName', 'Artist0')
    })

     it('Fetches exhibitions from firestore', async ()=>{
          getDocs.mockResolvedValue({docs: []})


      const data = await fetchExhibitionMaterial()
      expect (data).toBeNull()
    })


  })