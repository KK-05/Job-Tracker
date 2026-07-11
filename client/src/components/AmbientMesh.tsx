/**
 * Shared decorative background. Purely presentational — no props,
 * no state, no data. Drop it once per layout; it renders behind
 * everything via fixed positioning and z-index:0.
 */
export default function AmbientMesh() {
  return (
    <div className="ambient-mesh" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
