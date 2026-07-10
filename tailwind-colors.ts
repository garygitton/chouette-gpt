import defaultColors from 'tailwindcss/colors.js'

const colors = { ...defaultColors }
delete (colors as any).lightBlue
delete (colors as any).warmGray
delete (colors as any).trueGray
delete (colors as any).coolGray
delete (colors as any).blueGray

export default colors
