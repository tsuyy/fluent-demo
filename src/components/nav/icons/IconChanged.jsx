export default function IconChanged({ size = 48, color = 'currentColor' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48"  // adjust to your icon's viewBox
      fill="none"
    >
        <path fill-rule="evenodd" clip-rule="evenodd" d="M34.292 23.848H31.292L31.272 20.848H34.292V23.848ZM28.088 31.644H18.556L17.416 29.748L21.858 14.69L24.736 15.54L20.87 28.644H28.088V31.644ZM15.386 23.848H12.386L12.366 20.848H15.386V23.848ZM24 4.5C13.248 4.5 4.5 13.248 4.5 24C4.5 34.752 13.248 43.5 24 43.5C34.752 43.5 43.5 34.752 43.5 24C43.5 13.248 34.752 4.5 24 4.5Z" fill="white"/>
    </svg>
  )
}

