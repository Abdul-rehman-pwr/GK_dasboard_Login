const BasicLayout = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='98' height='126' viewBox='0 0 98 126' fill='none' {...props}>
      {/* Main Rounded Container */}
      <rect x='5' y='5' width='88' height='116' rx='6' fill='white' stroke='currentcolor' strokeWidth='2' />

      {/* Dark Background Wrapper for Top Fields */}
      <rect x='5' y='5' width='88' height='45' rx='3' fill='currentcolor' />

      {/* Centered Rounded Square Box */}
      <rect x='39' y='12' width='20' height='20' rx='4' fill='white' stroke='currentcolor' strokeWidth='1' />

      {/* Two Fields Below Square with Space Between */}
      <rect x='10' y='38' width='30' height='6' rx='2' fill='white' stroke='currentcolor' strokeWidth='1' />
      <rect x='58' y='38' width='30' height='6' rx='2' fill='white' stroke='currentcolor' strokeWidth='1' />

      {/* Rounded Box Above Lines */}
      <rect x='10' y='60' width='77' height='15' rx='6' fill='#E0E0E0' />

      {/* Content Placeholder */}
      <rect x='10' y='80' width='78' height='4' rx='2' fill='currentcolor' />
      <rect x='10' y='90' width='78' height='4' rx='2' fill='currentcolor' />
      <rect x='10' y='98' width='78' height='4' rx='2' fill='currentcolor' />
      <rect x='10' y='106' width='78' height='4' rx='2' fill='currentcolor' />
    </svg>
  )
}

export default BasicLayout
