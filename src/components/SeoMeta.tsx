
import React from "react";
import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
};

export default function SeoMeta({ title, description, keywords, canonical }: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
