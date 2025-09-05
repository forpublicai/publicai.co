# Public AI Inference Utility - Landing Page

**Marketing and demo website for the Public AI Inference Utility**

This is the landing page and demo interface for the Public AI Inference Utility, available at [www.publicai.co](https://www.publicai.co). The site provides visitors with an overview of our mission and offers a guest chat interface to try our AI models.

## About the Public AI Inference Utility

The Public AI Inference Utility is a global compute platform that provides free and low-cost access to state-of-the-art AI models. Built on principles of openness, accessibility, and democratic governance, the Utility serves as critical infrastructure for the AI ecosystem.

Unlike commercial AI APIs that prioritize profit maximization, the Utility is designed to serve the public interest with transparent pricing, open governance, and equitable access to AI capabilities for everyone.

## Features

- **Landing Page**: Showcases PublicAI's mission and capabilities
- **Demo Chat Interface**: Guest access to try AI models (SEA-LION, Mistral, and others)
- **No Authentication Required**: Pure demonstration experience for visitors
- **Seamless Transition**: Auth prompts redirect users to [app.publicai.co](https://app.publicai.co) for the full application
- **Clean Design**: Minimal, focused interface highlighting AI capabilities

## Technical Details

- Built with [Next.js](https://nextjs.org) and React
- No database persistence - conversations reset on page refresh
- Optimized for guest user experience and fast loading
- Responsive design for all device types

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

This is a focused marketing site with:
- Landing page components showcasing the platform
- Demo chat interface for guest users
- Auth modal integration redirecting to the main application
- Clean, minimal design optimized for conversion

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
