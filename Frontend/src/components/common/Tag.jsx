export function Tag({ children }) {
  const tone = String(children).toLowerCase();
  return <span className={`tag tag-${tone}`}>{children}</span>;
}
import React from "react";
