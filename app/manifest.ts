export default function manifest() {
  return {
    name: "Trip Fund",
    short_name: "TripFund",
    description:
      "Shared trip expense tracker",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f4f6",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}