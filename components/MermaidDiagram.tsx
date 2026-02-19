"use client";

import { useEffect, useRef } from "react";

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          background: "#0a0a0a",
          primaryColor: "#7c3aed",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#6d28d9",
          lineColor: "#52525b",
          secondaryColor: "#18181b",
          tertiaryColor: "#18181b",
          nodeBorder: "#6d28d9",
          clusterBkg: "#18181b",
          titleColor: "#ffffff",
          edgeLabelBackground: "#0a0a0a",
          fontSize: "14px",
        },
      });

      if (!ref.current || cancelled) return;

      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      try {
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<p class="text-red-400 text-sm p-4">Failed to render diagram.</p>`;
        }
        console.error("Mermaid render error:", e);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart]);

  return (
    <div
      ref={ref}
      className="w-full overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
    />
  );
}
