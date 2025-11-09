export default function SpotifyEmbed() {
  return (
    <iframe
      style={{ borderRadius: "12px" }}
      src="https://open.spotify.com/embed/track/0DTSnA1bcVI5niJzoyBPyZ?utm_source=generator"
      width="100%"
      height="80" // 🔹 bajamos un poco el alto
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
