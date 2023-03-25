<img src="./naturally-logo.svg" alt="Logo for Natura11y Inclusive Framework" />

# Natura11y Icons

Make your own icon font or expand on Naturally's open source [icon library](https://www.example.com).

---

## Steps to make icons

1. Save your SVGs to `./original-svg` dir

2. Run saved icons through svgo: `svgo -f ./original-svg -o ./optimized-svg`

3. Run fantasticon `fantasticon ./optimized-svg -o ./dist`

---

## The icon font

The above steps generate an icon font stylesheet. If you wish, you can customize the this stylesheet using `.fantasticonrc.js`.

---

Related:

- [Repo: Natura11y Inclusive Framework](https://github.com/cavidano/natura11y)
- [Repo: Natura11y React Components](https://github.com/cavidano/natura11y-react)
- [Docs: Natura11y Docs](https://gonatura11y.com)