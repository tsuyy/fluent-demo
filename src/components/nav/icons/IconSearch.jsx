// Like the other nav icons, always white (the nav's active state is the blue pill behind it).
export default function IconSearch({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd" clipRule="evenodd" fill="white"
        d="M3.75244 10.5815C3.75244 6.70046 6.91044 3.54346 10.7914 3.54346C14.6714 3.54346 17.8294 6.70046 17.8294 10.5815C17.8294 14.4625 14.6714 17.6205 10.7914 17.6205C6.91044 17.6205 3.75244 14.4625 3.75244 10.5815ZM22.2474 21.0405L17.6484 16.4535C19.0044 14.8725 19.8294 12.8235 19.8294 10.5815C19.8294 5.59846 15.7744 1.54346 10.7914 1.54346C5.80744 1.54346 1.75244 5.59846 1.75244 10.5815C1.75244 15.5655 5.80744 19.6205 10.7914 19.6205C12.8134 19.6205 14.6764 18.9445 16.1834 17.8175L20.8354 22.4565L22.2474 21.0405Z"
      />
    </svg>
  )
}
