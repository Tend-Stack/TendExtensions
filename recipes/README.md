# Community recipes

Each folder here is one App Store recipe for the signed **Tend Community** catalog: `recipes/<slug>/recipe.json`
and `recipes/<slug>/listing.json`, nothing else. Start from [`templates/recipe/example-notes`](../templates/recipe/example-notes),
read [`docs/recipes.md`](../docs/recipes.md) for the rules, and check your work with:

```bash
python tools/validate_recipe.py recipes/<slug>
python tools/build.py        # also writes dist/community-catalog.json
```

A merged recipe is published, signed by Tend, in `community-catalog.json` and appears in panels as
"Community · reviewed by Tend". Review is by humans, one recipe per pull request, and approval never makes a recipe
`tested` or `certified`; only Tend's first-party catalog carries that.
