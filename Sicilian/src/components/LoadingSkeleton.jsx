export const LoadingSkeleton = ({ width = '100%', height = '1rem', style }) => (
    <div
      className="skeleton"
      style={{ width, height, margin: '0.5rem 0', ...style }}
    />
  );