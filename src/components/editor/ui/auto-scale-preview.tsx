"use client";

import { useRef, useState, useEffect } from "react";
import { CVPreview } from "../cv-preview";
import type { FormData } from "@/types/editor-form-data";

interface AutoScalePreviewProps {
  data: FormData;
}

/**
 * Wrapper component that automatically scales the CV preview
 * based on the available container width.
 * CV only scales DOWN to fit container, never scales UP beyond A4 size.
 */
export function AutoScalePreview({ data }: AutoScalePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Observe container resize
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-start justify-center overflow-auto p-4"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#d4d4d4 transparent" }}
    >
      <div className="w-full max-w-[830px] flex justify-center">
        {containerWidth > 0 && (
          <div className="shadow-xl border border-neutral-200 rounded overflow-hidden bg-white flex-shrink-0">
            <CVPreview data={data} containerWidth={Math.min(containerWidth, 830)} />
          </div>
        )}
      </div>
    </div>
  );
}
