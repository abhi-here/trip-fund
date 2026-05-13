import withPWA from "next-pwa";

const nextConfig = {
  turbopack: {},
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);