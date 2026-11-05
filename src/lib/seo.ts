// Public product facts only. Never serialize account or browser-local data here.
export const site = {
  name: "GraphCam",
  origin: "https://graphcam.harazizsingh.com",
  title: "GraphCam — On-Device Mathematical Graph Recognition",
  description:
    "GraphCam classifies graph images into ten mathematical function families using on-device AI. Upload an image or explore sample graphs with known equations.",
  category: "EducationalApplication",
  features: [
    "On-device graph image classification",
    "Ten trained function families",
    "Interactive sample graphs",
    "Predicted family and confidence",
  ],
};

export const faqs = [
  {
    question: "What is GraphCam?",
    answer:
      "GraphCam is a browser-based mathematical graph recognition tool. It uses a trained convolutional neural network to classify graph images into ten function families.",
  },
  {
    question: "Does GraphCam find the exact equation in an uploaded image?",
    answer:
      "No. Uploaded images receive a predicted function family and confidence score. Exact equation parameter estimation is not included. Interactive samples use known equations.",
  },
  {
    question: "Are uploaded graph images sent to a server?",
    answer:
      "Graph classification runs on-device in your browser with TensorFlow.js. Uploaded images are held in browser memory rather than sent to an inference server.",
  },
  {
    question: "How can I try GraphCam?",
    answer:
      "Open the workspace to explore the interactive samples or upload a graph image. The first classification downloads the model before running it in your browser.",
  },
];

// Escaping '<' prevents embedded data from closing an HTML script element.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function pageHead({
  title = site.title,
  description = site.description,
  path = "/",
  index = true,
  home = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  index?: boolean;
  home?: boolean;
} = {}) {
  const url = new URL(path, site.origin).href;
  const image = `${site.origin}/social-card.png`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${site.origin}/#website`,
      url: `${site.origin}/`,
      name: site.name,
      inLanguage: "en",
      about: { "@id": `${site.origin}/#application` },
    },
    {
      "@type": "WebApplication",
      "@id": `${site.origin}/#application`,
      name: site.name,
      url: `${site.origin}/`,
      description: site.description,
      applicationCategory: site.category,
      operatingSystem: "Web browser",
      featureList: site.features,
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": `${site.origin}/#website` },
      about: { "@id": `${site.origin}/#application` },
    },
  ];
  if (home)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": `${url}#webpage` },
      mainEntity: faqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  return {
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "robots",
        content: index
          ? "index, follow, max-image-preview:large"
          : "noindex, follow",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: `${site.name} — ${site.features[0]}`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      {
        name: "twitter:image:alt",
        content: `${site.name} — ${site.features[0]}`,
      },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: index
      ? [
          {
            type: "application/ld+json",
            children: serializeJsonLd({
              "@context": "https://schema.org",
              "@graph": graph,
            }),
          },
        ]
      : [],
  };
}
