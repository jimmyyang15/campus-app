import { create } from 'zustand'

interface Props {
    open:boolean;
    close:()=>void
}

export const useReactionOpen = create<Props>((set) => ({
    open:false,
    close:()=>set(()=>({ open:false}))
}))
