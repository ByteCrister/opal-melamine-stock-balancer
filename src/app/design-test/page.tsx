/**
 * Design System Test Page
 * Route: /design-test
 *
 * Renders every token from globals.css visually so you can confirm
 * colors, typography, spacing, radius and shadows all resolve correctly.
 * Delete this route once satisfied.
 */
export default function DesignTestPage() {
  return (
    <div
      style={{
        background: "var(--color-stone-canvas)",
        minHeight: "100vh",
        padding: "48px",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div style={{ maxWidth: "var(--page-max-width)", margin: "0 auto" }}>
        {/* ------------------------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------------------------ */}
        <div style={{ marginBottom: "var(--spacing-48)" }}>
          <h1
            style={{
              fontFamily: "var(--font-roobert)",
              fontSize: "var(--text-display)",
              lineHeight: "var(--leading-display)",
              letterSpacing: "var(--tracking-display)",
              fontWeight: "var(--font-weight-regular)",
              color: "var(--color-ink-black)",
              margin: 0,
            }}
          >
            Design{" "}
            <span className="highlight">System</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "var(--text-body-lg)",
              lineHeight: "var(--leading-body-lg)",
              color: "var(--color-warm-gray)",
              marginTop: "16px",
              marginBottom: 0,
            }}
          >
            Visual test for all CSS custom properties in{" "}
            <code style={{ fontSize: "13px", color: "var(--color-ink-black)" }}>
              globals.css
            </code>
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Color Swatches */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Colors">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-12)" }}>
            {[
              { name: "stone-canvas", var: "--color-stone-canvas", label: "#fafaf9", border: true },
              { name: "pure-white", var: "--color-pure-white", label: "#ffffff", border: true },
              { name: "stone-border", var: "--color-stone-border", label: "#e8e6e5" },
              { name: "stone-muted", var: "--color-stone-muted", label: "#d6d3d1" },
              { name: "ash-gray", var: "--color-ash-gray", label: "#a8a29e" },
              { name: "warm-gray", var: "--color-warm-gray", label: "#78716c" },
              { name: "ink-black", var: "--color-ink-black", label: "#0c0a09" },
              { name: "soot", var: "--color-soot", label: "#1c1917" },
              { name: "sky-wash", var: "--color-sky-wash", label: "#c1e1f7" },
              { name: "cyan-signal", var: "--color-cyan-signal", label: "#3ba6f1" },
              { name: "cyan-edge", var: "--color-cyan-edge", label: "#3398e1" },
            ].map((s) => (
              <div key={s.var} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "var(--radius-card)",
                    background: `var(${s.var})`,
                    border: s.border ? "1px solid var(--color-stone-border)" : "1px solid transparent",
                    boxShadow: "var(--shadow-subtle)",
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-ink-black)" }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--color-warm-gray)", fontFamily: "monospace" }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Typography Scale */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Typography Scale">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)" }}>
            {[
              { label: "display", size: "var(--text-display)", lh: "var(--leading-display)", ls: "var(--tracking-display)", family: "var(--font-roobert)", text: "Display 52px" },
              { label: "heading-sm", size: "var(--text-heading-sm)", lh: "var(--leading-heading-sm)", ls: "var(--tracking-heading-sm)", family: "var(--font-roobert)", text: "Heading SM 32px" },
              { label: "subheading", size: "var(--text-subheading)", lh: "var(--leading-subheading)", ls: "var(--tracking-subheading)", family: "var(--font-roobert)", text: "Subheading 20px" },
              { label: "body-lg", size: "var(--text-body-lg)", lh: "var(--leading-body-lg)", ls: "var(--tracking-body-lg)", family: "var(--font-inter)", text: "Body Large 16px — the hero subtitle rhythm" },
              { label: "body", size: "var(--text-body)", lh: "var(--leading-body)", ls: "var(--tracking-body)", family: "var(--font-inter)", text: "Body 14px — dominant UI rhythm, do not break it" },
              { label: "body-sm", size: "var(--text-body-sm)", lh: "var(--leading-body-sm)", ls: "var(--tracking-body-sm)", family: "var(--font-inter)", text: "Body SM 12px — helper text, metadata" },
              { label: "caption", size: "var(--text-caption)", lh: "var(--leading-caption)", ls: "var(--tracking-caption)", family: "var(--font-inter)", text: "CAPTION 10PX — fine print, data footer" },
            ].map((t) => (
              <div key={t.label} style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-16)", borderBottom: "1px solid var(--color-stone-border)", paddingBottom: "var(--spacing-16)" }}>
                <span style={{ fontSize: "10px", color: "var(--color-ash-gray)", fontFamily: "monospace", minWidth: "90px" }}>
                  {t.label}
                </span>
                <span
                  style={{
                    fontFamily: t.family,
                    fontSize: t.size,
                    lineHeight: t.lh,
                    letterSpacing: t.ls,
                    fontWeight: "var(--font-weight-regular)",
                    color: "var(--color-ink-black)",
                  }}
                >
                  {t.text}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Buttons */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Buttons">
          <div style={{ display: "flex", gap: "var(--element-gap)", alignItems: "center", flexWrap: "wrap" }}>
            <button
              style={{
                background: "var(--color-cyan-signal)",
                color: "var(--color-pure-white)",
                border: "1px solid var(--color-cyan-edge)",
                borderRadius: "var(--radius-buttons)",
                padding: "8px 16px",
                fontFamily: "var(--font-inter)",
                fontWeight: "var(--font-weight-medium)",
                fontSize: "var(--text-body)",
                cursor: "pointer",
              }}
            >
              Primary CTA
            </button>
            <button
              style={{
                background: "transparent",
                color: "var(--color-ink-black)",
                border: "1px solid var(--color-stone-border)",
                borderRadius: "var(--radius-buttons)",
                padding: "8px 16px",
                fontFamily: "var(--font-inter)",
                fontWeight: "var(--font-weight-regular)",
                fontSize: "var(--text-body)",
                cursor: "pointer",
              }}
            >
              Ghost Button
            </button>
          </div>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Cards */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Cards & Shadows">
          <div style={{ display: "flex", gap: "var(--spacing-24)", flexWrap: "wrap" }}>
            <div
              style={{
                background: "var(--color-pure-white)",
                border: "1px solid var(--color-stone-border)",
                borderRadius: "var(--radius-cards)",
                padding: "var(--card-padding)",
                boxShadow: "var(--shadow-md)",
                minWidth: "200px",
              }}
            >
              <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--color-warm-gray)" }}>
                shadow-md
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "var(--text-body)", color: "var(--color-ink-black)", fontWeight: "var(--font-weight-medium)" }}>
                Flat Content Card
              </p>
            </div>
            <div
              style={{
                background: "var(--color-pure-white)",
                border: "1px solid var(--color-stone-border)",
                borderRadius: "var(--radius-feature-card)",
                padding: "var(--card-padding)",
                boxShadow: "var(--shadow-xl)",
                minWidth: "200px",
              }}
            >
              <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--color-warm-gray)" }}>
                shadow-xl
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "var(--text-body)", color: "var(--color-ink-black)", fontWeight: "var(--font-weight-medium)" }}>
                Floating Preview Card
              </p>
            </div>
            <div
              style={{
                background: "var(--color-soot)",
                borderRadius: "var(--radius-cards)",
                padding: "var(--card-padding)",
                minWidth: "200px",
              }}
            >
              <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--color-ash-gray)" }}>
                surface-inverted
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "var(--text-body)", color: "var(--color-pure-white)", fontWeight: "var(--font-weight-medium)" }}>
                Inverted Dark Card
              </p>
            </div>
          </div>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Border Radius */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Border Radius">
          <div style={{ display: "flex", gap: "var(--spacing-24)", alignItems: "flex-end", flexWrap: "wrap" }}>
            {[
              { label: "icon (4px)", r: "var(--radius-icons)", size: "48px" },
              { label: "input (6px)", r: "var(--radius-inputs)", size: "56px" },
              { label: "card (10px)", r: "var(--radius-cards)", size: "64px" },
              { label: "feature (16px)", r: "var(--radius-feature-card)", size: "72px" },
              { label: "full (9999px)", r: "var(--radius-full)", size: "80px" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: r.size,
                    height: r.size,
                    background: "var(--color-cyan-signal)",
                    opacity: 0.2,
                    borderRadius: r.r,
                    border: "1px solid var(--color-cyan-edge)",
                  }}
                />
                <span style={{ fontSize: "10px", color: "var(--color-warm-gray)", textAlign: "center" }}>
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Input */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Input">
          <input
            type="text"
            placeholder="Placeholder text in warm gray..."
            style={{
              background: "var(--color-pure-white)",
              border: "1px solid var(--color-stone-muted)",
              borderRadius: "var(--radius-inputs)",
              padding: "4px 12px",
              fontFamily: "var(--font-inter)",
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
              color: "var(--color-ink-black)",
              outline: "none",
              width: "320px",
            }}
          />
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Highlight Span */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Highlight Span (.highlight)">
          <h2
            style={{
              fontFamily: "var(--font-roobert)",
              fontSize: "var(--text-heading-sm)",
              lineHeight: "var(--leading-heading-sm)",
              letterSpacing: "var(--tracking-heading-sm)",
              fontWeight: "var(--font-weight-regular)",
              color: "var(--color-ink-black)",
              margin: 0,
            }}
          >
            Make analytics{" "}
            <span className="highlight">simple & actionable</span>
          </h2>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Spacing Scale */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Spacing Scale">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96].map((n) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "10px", fontFamily: "monospace", color: "var(--color-ash-gray)", minWidth: "60px" }}>
                  spacing-{n}
                </span>
                <div
                  style={{
                    height: "8px",
                    width: `var(--spacing-${n})`,
                    background: "var(--color-cyan-signal)",
                    borderRadius: "2px",
                  }}
                />
                <span style={{ fontSize: "10px", color: "var(--color-warm-gray)" }}>{n}px</span>
              </div>
            ))}
          </div>
        </Section>

        <footer
          style={{
            marginTop: "var(--section-gap)",
            paddingTop: "var(--spacing-24)",
            borderTop: "1px solid var(--color-stone-border)",
            fontSize: "var(--text-caption)",
            color: "var(--color-ash-gray)",
          }}
        >
          Design token test page — delete once verified ✓
        </footer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper helper
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "var(--spacing-64)" }}>
      <h2
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "var(--text-body-sm)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--color-ash-gray)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: "0 0 var(--spacing-16) 0",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
