<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## GraphCam architecture
- Derive browser and Apple icons from the existing GraphCam camera-and-curve mark, serve them at static public paths, and retain a branded ICO fallback for clients that request it directly.
- Keep the portfolio experience at `/` with in-page navigation because this project explicitly requires a single scrolling application.
- Keep sample math in `src/lib/graph-samples.ts` and real inference in `src/lib/graph-inference.ts`, which runs the original Keras CNN converted to TF.js in `public/model` with app.py preprocessing (128x128 nearest resize, /255) so no Python backend is needed.
- Use browser-local React state and object URLs for uploaded images; classification runs on-device, so no persistent storage or backend is needed.
- Render curves with sampled SVG paths and break paths at discontinuities to keep mathematical plots accurate without a calculator dependency.
