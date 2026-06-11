import { create } from 'zustand'

interface UIState {
  mobileNavOpen: boolean
  searchOpen: boolean
  prayerFormOpen: boolean
  givingFormOpen: boolean
  openMobileNav: () => void
  closeMobileNav: () => void
  toggleMobileNav: () => void
  openSearch: () => void
  closeSearch: () => void
  openPrayerForm: () => void
  closePrayerForm: () => void
  openGivingForm: () => void
  closeGivingForm: () => void
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  searchOpen: false,
  prayerFormOpen: false,
  givingFormOpen: false,

  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),

  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  openPrayerForm: () => set({ prayerFormOpen: true }),
  closePrayerForm: () => set({ prayerFormOpen: false }),

  openGivingForm: () => set({ givingFormOpen: true }),
  closeGivingForm: () => set({ givingFormOpen: false }),
}))
