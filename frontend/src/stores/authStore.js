import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('qrmenu_token'),
  isLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem('qrmenu_token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('qrmenu_token')
    set({ user: null, token: null })
  },

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}))

export default useAuthStore
