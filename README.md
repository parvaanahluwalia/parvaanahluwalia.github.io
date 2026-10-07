# parvaanahluwalia.github.io

Engineering portfolio of **Parvaan Singh Ahluwalia**, live at https://parvaanahluwalia.github.io

The blueprint design (grid paper, dimension callouts, orange accent, horizontal project rail) comes from Parvaan's original concept.

## Structure

```
index.html                      Home: hero, featured build, project rail, toolkit, milestones, about
projects/<name>/index.html      One page per project, so each has its own link for posts
assets/css/site.css             All styles (colour tokens at the top)
assets/js/site.js               Scroll effects, drawing animations, copy-link button
assets/og/*.png                 1200×630 preview images shown when a link is shared
```

## Editing

- **Change text:** edit the HTML file for that page directly.
- **Add a project:** copy a folder in `projects/`, edit it, add a card to the rail in `index.html`, and add the URL to `sitemap.xml`.
- **Add photos:** put images in `assets/img/` and add `<img src="../../assets/img/your-photo.jpg" alt="what it shows">` inside a project page.
- **Preview link cards:** after changing a page, paste its URL into https://www.linkedin.com/post-inspector/ to refresh LinkedIn's cached preview.

Every push to `main` goes live within a minute or two.
