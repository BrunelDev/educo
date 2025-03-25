import { create } from 'zustand'

interface yorestore {
  members : any;
  yourAction : (val : any) => void;
}
export const useyorestore = create<yorestore>((set)=>({
  yourState : 'VALUE',
  yourAction : (val) => set( (state) => ({ yourState : state.yourState }) )
}))
