const InvoiceLoopSVG = () => {
  return (
    <div
      className="relative flex justify-center items-center h-screen"
      style={{ margin: "-25rem" }}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 100 100"
        className="animate-spin"
      >
        <path
          fill="#9CC5A1" // Document color
          d="M30 10 L30 80 L70 80 L70 20 L50 10 Z"
        />
        <path
          fill="#ffffff" // Inner document color
          d="M35 15 L35 75 L65 75 L65 25 L50 15 Z"
        />
        <text
          x="50"
          y="60"
          fontSize="20"
          textAnchor="middle"
          fill="#216869" // Dollar sign color
          fontWeight="bold"
        >
          $
        </text>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="3s"
          repeatCount="indefinite"
          fill="remove"
        />
      </svg>
    </div>
  );
};

export default InvoiceLoopSVG;
