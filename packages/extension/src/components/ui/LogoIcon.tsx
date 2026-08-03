import type { ComponentProps } from "react";

/**
 * NainoForge Logo — renvoyé via <img> depuis public/nainoforge_logo.svg
 * Supporte toutes les props HTML <img> + className pour le styling.
 */
export function LogoIcon(props: ComponentProps<"img">) {
  const { className = "", alt = "NainoForge", ...rest } = props;

  return (
    <img
      src="/nainoforge_logo.svg"
      alt={alt}
      className={className}
      {...rest}
    />
  );
}
