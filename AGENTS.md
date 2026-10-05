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

- Keep curriculum content in a browser-safe lesson data module and the classroom in a shared component so the home route stays focused on metadata.
- Execute lesson code only in an opaque-origin sandboxed iframe with blocked network access; bundle the React teaching runtime locally and validate console messages against the iframe source.
- Learning edits and completion are session-only React state; this basic classroom does not require accounts or remote persistence.
