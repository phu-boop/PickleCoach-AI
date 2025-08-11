export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border bg-white text-black shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-4 pt-0 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`flex items-center p-4 pt-0 ${className}`}>
      {children}
    </div>
  );
}

