# arcanelabs.info

Company site for [Arcane Labs](https://site.arcanelabs.io). Built with Jekyll, deployed via GitHub Pages.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`.

## Structure

```
_config.yml          Site config + plugin activation
_includes/           head.html, nav.html, footer.html
_layouts/            default.html
assets/css/          main.css — independent minimalist design system
index.html           Landing page
products.html        Product listings
contact.html         Contact page
404.html             Error page
CNAME                Custom domain: site.arcanelabs.io
```

## License

Code: MIT. Content: CC BY 4.0. See [LICENSE](LICENSE).
