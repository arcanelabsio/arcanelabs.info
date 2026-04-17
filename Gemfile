source "https://rubygems.org"

# GitHub Pages gem pins Jekyll to the version GH Pages builds with.
# This lets `bundle exec jekyll serve` locally match production.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-redirect-from"
end

# Windows / JRuby workarounds — safe no-ops elsewhere.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
