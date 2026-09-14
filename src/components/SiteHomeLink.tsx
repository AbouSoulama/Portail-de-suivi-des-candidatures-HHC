"use client";

const SITE_HOME = "https://haminehappy.fr";

export function SiteHomeLink({
  className,
  children,
  title = "Retour au site Hamine Happy",
}: {
  className?: string;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <a
      className={className}
      href={SITE_HOME}
      title={title}
      rel="noreferrer"
      onClick={(event) => {
        event.preventDefault();
        window.location.assign(SITE_HOME);
      }}
    >
      {children}
    </a>
  );
}
