export function CircuitDecoration({ side = 'left' }: { side?: 'left' | 'right' }) {
  const isLeft = side === 'left';
  
  return (
    <div className={`hidden lg:block fixed top-0 ${isLeft ? 'left-0' : 'right-0'} h-full w-32 pointer-events-none z-0 opacity-30`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`circuit-gradient-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C65D3B" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#B8956A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#5BA3A3" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Vertical lines */}
        <line 
          x1={isLeft ? "80" : "48"} 
          y1="0" 
          x2={isLeft ? "80" : "48"} 
          y2="100%" 
          stroke={`url(#circuit-gradient-${side})`} 
          strokeWidth="2" 
        />
        
        {/* Circuit nodes */}
        {[15, 25, 35, 45, 55, 65, 75, 85].map((percent) => (
          <g key={percent}>
            <circle 
              cx={isLeft ? "80" : "48"} 
              cy={`${percent}%`} 
              r="4" 
              fill="#C65D3B" 
              opacity="0.4"
            />
            <circle 
              cx={isLeft ? "80" : "48"} 
              cy={`${percent}%`} 
              r="2" 
              fill="#ffffff" 
              opacity="0.6"
            />
            {/* Horizontal connector lines */}
            <line 
              x1={isLeft ? "80" : "48"} 
              y1={`${percent}%`} 
              x2={isLeft ? "120" : "8"} 
              y2={`${percent}%`} 
              stroke="#C65D3B" 
              strokeWidth="1" 
              opacity="0.3"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}