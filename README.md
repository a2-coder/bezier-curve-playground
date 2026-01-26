# Bezier Curve Playground

An interactive web application for visualizing and understanding how cubic Bézier curves work. Built with React, TypeScript, and shadcn/ui.

## 🎯 Features

- **Interactive Configuration Panel**: Adjust curve properties in real-time using intuitive sliders
  - Canvas size (40-200 units)
  - Start point coordinates (x, y)
  - Control point 1 coordinates (x, y)
  - Control point 2 coordinates (x, y)
  - End point coordinates (x, y)

- **Live Preview**: Visual representation of the Bézier curve with:
  - Grid background for precise positioning
  - Curve path rendered in real-time
  - Visual markers for start, end, and control points
  - Dashed lines connecting control points to their respective endpoints
  - Color-coded points (black for start/end, gray for control points)

- **SVG Code Export**: One-click copy of the generated SVG code for use in your projects

- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.17
- **UI Components**: shadcn/ui with Base UI React
- **Icons**: Tabler Icons React
- **Font**: JetBrains Mono (Variable)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bezier-curve-maker
```

2. Install dependencies (using bun, npm, or yarn):
```bash
bun install
# or
npm install
# or
yarn install
```

3. Start the development server:
```bash
bun dev
# or
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🚀 Usage

1. **Adjust the Size**: Use the size slider to change the canvas dimensions
2. **Move Points**: Adjust the x and y coordinates for:
   - Start point: Where the curve begins
   - Control Point 1: Influences the curve's initial direction
   - Control Point 2: Influences the curve's final direction
   - End point: Where the curve ends
3. **Preview**: Watch the curve update in real-time as you adjust the parameters
4. **Copy SVG**: Click the copy button in the preview panel to copy the SVG code to your clipboard

## 📁 Project Structure

```
src/
├── App.tsx                                    # Main application component
├── components/
│   ├── elements/
│   │   ├── configuration-card.tsx            # Configuration panel with sliders
│   │   └── preview-card.tsx                  # Preview panel with SVG rendering
│   └── ui/                                   # shadcn/ui components
├── lib/
│   ├── types.ts                              # TypeScript type definitions
│   ├── hooks.ts                              # Custom React hooks
│   └── utils.ts                              # Utility functions
└── ...
```

## 🎨 How Bézier Curves Work

A cubic Bézier curve is defined by four points:
- **P0** (Start Point): The beginning of the curve
- **P1** (Control Point 1): Influences the curve's direction at the start
- **P2** (Control Point 2): Influences the curve's direction at the end
- **P3** (End Point): The end of the curve

The curve is mathematically defined by the formula:
```
B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3, where 0 ≤ t ≤ 1
```

## 📝 License

Copyright © 2026 Arjun Palakkazhi. All rights reserved.

## 👨‍💻 Author

Created by [@a2coder](https://github.com/a2-coder)