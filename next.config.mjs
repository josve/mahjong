import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at src/i18n/request.ts, which loads the texts in messages/sv.json.
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
