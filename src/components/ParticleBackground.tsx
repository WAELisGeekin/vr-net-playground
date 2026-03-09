const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Static grid */}
      <div className="absolute inset-0 particle-grid opacity-30" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-neon/5 blur-[120px]" />
    </div>
  );
};

export default ParticleBackground;
