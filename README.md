# Lumière

Next.js App Router implementation of Hero (Figma `1:378`, mobile `138:326`) About (Figma `1:415`, mobile `138:355`), and Featured Works (Figma `1:429`, mobile `138:366`).

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000. Checks: `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`.

Sections: `components/sections/hero.tsx` `components/sections/about.tsx`, and `components/sections/featured.tsx`. Reusable UI: `components/ui/`. Design tokens and Tailwind v4 theme: `app/globals.css`. Satoshi is loaded locally using next/font. Exported Figma assets are in public; reference screenshots are in design.

Hero, About, and Featured Works are implemented. Home, About, and Work work as anchors; other navigation anchors are reserved for future sections and have no destination yet. No contact address was invented. Mobile menu supports Escape, focus management via native dialog, and scroll locking. Mobile browser UI/status bar from the design is intentionally omitted. Tablet layout interpolates desktop and mobile because no tablet frame was supplied.

Featured Works retains all six projects. Three desktop cards extend beyond the original 1200px frame; the implementation expands the section to display them instead of clipping them. Mobile follows the stacked, staggered gallery reference.
