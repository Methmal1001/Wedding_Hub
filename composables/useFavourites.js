// Favourites stored in shared state (frontend only, resets on reload).
export const useFavourites = () => {
  const favourites = useState('favourites', () => [])
  const { show } = useToast()

  const isFavourite = (id) => favourites.value.includes(id)

  const toggleFavourite = (item) => {
    if (isFavourite(item.id)) {
      favourites.value = favourites.value.filter((f) => f !== item.id)
      show(`${item.name} was removed from your favourites.`, { title: 'Removed', icon: 'heart' })
    } else {
      favourites.value = [...favourites.value, item.id]
      show(`${item.name} was added to your favourites.`, { title: 'Saved', icon: 'heart' })
    }
  }

  return { favourites, isFavourite, toggleFavourite }
}
