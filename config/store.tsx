import create from "zustand";

export const useStore = create<ICryptoStore>((set) => ({
  user: null,
  setUser: (newUser) => {
    // Reset table when user changes
    set({
      pageNum: 1,
      search: "",
      sortField: "market_cap",
      sortDir: "desc",
      user: newUser,
    });
  },
  search: "",
  setSearch: (newSearch) => set({ search: newSearch }),
  pageNum: 1,
  setPageNum: (newNum) => set(() => ({ pageNum: newNum })),
  sortField: "market_cap",
  setSortField: (newSortField) => set({ sortField: newSortField }),
  sortDir: "desc",
  setSortDir: (newSortDir) => set({ sortDir: newSortDir }),
  favorites: [],
  setFavorites: (newFavorites) => set({ favorites: newFavorites }),
  clearFavorites: () => set({ favorites: [] }),
  favoritesOnly: false,
  setFavoritesOnly: (newFavoritesOnly) =>
    set({ favoritesOnly: newFavoritesOnly }),
  windowWidth: 0,
  setWindowWidth: (newWindowWidth) => set({ windowWidth: newWindowWidth }),
  windowHeight: 0,
  setWindowHeight: (newWindowHeight) => set({ windowHeight: newWindowHeight }),
  pageSize: 3,
  setPageSize: (newPageSize) => set({ pageSize: newPageSize }),
}));
