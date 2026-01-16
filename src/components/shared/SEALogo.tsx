/**
 * Sustainable Entertainment Alliance Logomark
 * Simplified SVG version based on brand guidelines
 */

interface SEALogoProps {
  className?: string;
  size?: number;
}

export function SEALogo({ className = '', size = 48 }: SEALogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer bright green brackets */}
      <path
        d="M10 10 L10 30 M10 10 L30 10"
        stroke="#00FF55"
        strokeWidth="6"
        strokeLinecap="square"
      />
      <path
        d="M90 10 L90 30 M90 10 L70 10"
        stroke="#00FF55"
        strokeWidth="6"
        strokeLinecap="square"
      />
      <path
        d="M10 90 L10 70 M10 90 L30 90"
        stroke="#00FF55"
        strokeWidth="6"
        strokeLinecap="square"
      />
      <path
        d="M90 90 L90 70 M90 90 L70 90"
        stroke="#00FF55"
        strokeWidth="6"
        strokeLinecap="square"
      />

      {/* Middle bright green brackets */}
      <path
        d="M20 20 L20 35 M20 20 L35 20"
        stroke="#00FF55"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <path
        d="M80 20 L80 35 M80 20 L65 20"
        stroke="#00FF55"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <path
        d="M20 80 L20 65 M20 80 L35 80"
        stroke="#00FF55"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <path
        d="M80 80 L80 65 M80 80 L65 80"
        stroke="#00FF55"
        strokeWidth="5"
        strokeLinecap="square"
      />

      {/* Inner white brackets */}
      <path
        d="M30 30 L30 42 M30 30 L42 30"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <path
        d="M70 30 L70 42 M70 30 L58 30"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <path
        d="M30 70 L30 58 M30 70 L42 70"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <path
        d="M70 70 L70 58 M70 70 L58 70"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="square"
      />

      {/* Center white L shapes */}
      <path
        d="M38 50 L38 58 L46 58"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="square"
        fill="none"
      />
      <path
        d="M62 50 L62 58 L54 58"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}
