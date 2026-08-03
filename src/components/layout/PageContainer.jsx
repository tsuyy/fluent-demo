export default function PageContainer({ children, style }) {
  return (
    <div style={{
      maxWidth: 1100,
      margin: '0 auto',
      width: '100%',
      ...style,
    }}>
      {children}
    </div>
  )
}