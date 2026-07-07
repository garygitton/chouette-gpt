import defaultColors from 'tailwindcss/colors.js'

// Clean up deprecated colors to avoid warnings in client
const colors = { ...defaultColors }
delete (colors as any).lightBlue
delete (colors as any).warmGray
delete (colors as any).trueGray
delete (colors as any).coolGray
delete (colors as any).blueGray

export default colors
