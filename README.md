# github-graph-arkanoid

The hidden game on **[horacioparisotto.com](https://www.horacioparisotto.com/)**: press Play on the GitHub graph and every commit square becomes a brick.

> **Note.** This is the game's real code, published on its own. The portfolio around it lives in a private repo, so this isn't a standalone app: the component expects a page that already renders a contribution graph. To play it, use the site.

## How it works

**Canvas outside React.** The game state lives in a ref and a `requestAnimationFrame` loop draws it to a canvas. React only handles the HUD and the end screens, so frames never go through a render.

**The page is the level.** The game reads the `.github-day` cells already on the page, measures them, and builds one brick per day with commits. It works on any graph size and any year, and breaking a brick clears the real cell.

**Real data.** [`api/github-contributions.js`](api/github-contributions.js) is a Vercel function that reads the contribution calendar through GitHub's GraphQL API and caches it for an hour at the CDN. The token stays on the server.

**Loaded on demand.** The portfolio imports this component with `React.lazy`, and the chunk (19 KB gzipped) is fetched when you hover, focus or press Play. It never touches the first load, and the site scores 100 on mobile PageSpeed.

**The winner's reward.** The YouTube embed only mounts after a win, on the no-cookie domain, so nothing from YouTube loads otherwise.

## What's inside

| File | What it is |
|---|---|
| [`src/ArkanoidGame.jsx`](src/ArkanoidGame.jsx) | The game: physics, 50 power-ups and characters, drawing, end screens |
| [`src/arkanoid.css`](src/arkanoid.css) | Overlay, HUD and end-screen styles |
| [`api/github-contributions.js`](api/github-contributions.js) | The serverless function behind the graph |

All the characters are original pixel drawings made on the canvas, with no image files.

## Using the component

```jsx
<ArkanoidGame active={playing} onExit={() => setPlaying(false)} gridRef={gridRef} />
```

`gridRef` points to the element that holds the graph. Inside it, each `.github-week` holds `.github-day` cells that carry `data-level` and `data-count`.
