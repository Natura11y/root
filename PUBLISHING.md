# Publishing Natura11y

This guide covers releases from the [Natura11y/root](https://github.com/Natura11y/root) monorepo. Run commands from its root. See [LICENSE.md](LICENSE.md) for licensing terms.

## What gets published

| Source | Destination | Release method |
| --- | --- | --- |
| `packages/core` | `@natura11y/core` on npm | Push a `core-v<version>` tag; GitHub Actions publishes with `latest`. |
| `packages/icons` | `@natura11y/icons` on npm | Manual npm publish. |
| `packages/react` | `@natura11y/react` on npm | Push a `react-v<version>` tag; GitHub Actions currently publishes with `beta`. |
| `apps/docs` | [gonatura11y.com](https://gonatura11y.com) | Run the documentation deployment workflow. |
| `packages/core/dist` and `apps/storybook` | [GitHub Pages](https://natura11y.github.io/root/storybook/) | Automatically deployed when `main` changes. |

## Prepare a release

1. Confirm `origin` points to `https://github.com/Natura11y/root.git` and the working tree contains only the intended release changes.
2. Bump versions and update changelogs only for packages that changed. Update affected dependency ranges, the root lockfile, and pinned documentation CDN versions. Every npm release needs a new version.
3. Run the relevant checks below and inspect the package contents. Keep credentials, local files, and unintended media out of releases. Package metadata should identify `Natura11y/root`, the package's workspace directory, and its public documentation and issue URLs.
4. Commit the release changes through a reviewed pull request. Publish from the merged release commit.
5. When multiple packages change, publish Core, then Icons if needed, then React. Publish required Core exports and styles before React depends on them. Deploy documentation after its referenced package versions are available on the CDN.

Record release notes in the package changelog; create a GitHub Release when useful for public announcements.

## Verify the release

| Output | Checks |
| --- | --- |
| Core | `npm run build:core`, then `npm pack --dry-run --workspace @natura11y/core` |
| Icons | `npm run build:icons`, then `npm pack --dry-run --workspace @natura11y/icons` |
| React | `npm run typecheck:react`, `npm run build:react`, then `npm pack --dry-run --workspace @natura11y/react` |
| Documentation | `npm run verify:docs-release` after the referenced packages are published |
| GitHub Pages | `npm run typecheck:storybook`, `npm run build:core`, then `npm run build-storybook` |

## Publish npm packages

### Core and React

[publish.yml](.github/workflows/publish.yml) uses npm Trusted Publishing. It validates the release tag against the package version, builds and inspects the package, and publishes through a short-lived GitHub Actions identity.

After merging and checking out the release commit, push the tag for each changed package. These commands read the version from its package manifest:

```sh
# Core
core_version=$(node -p "require('./packages/core/package.json').version")
git tag -a "core-v${core_version}" -m "Core ${core_version}"
git push origin "core-v${core_version}"

# React beta
react_version=$(node -p "require('./packages/react/package.json').version")
git tag -a "react-v${react_version}" -m "React ${react_version}"
git push origin "react-v${react_version}"
```

When releasing both, wait for Core's publication to succeed before pushing the React tag. The workflow currently publishes every React tag to `beta`; a stable release requires an explicit workflow change or the manual `latest` command below.

### Icons and manual publishing

Icons has no tag-triggered publishing job. After its checks pass, publish it manually and record an `icons-v<version>` tag at the release commit.

```sh
npm publish --workspace @natura11y/icons --access public
```

For an authorized manual Core or React release, use the corresponding command below. Interactive publishing may require a fresh npm login and two-factor authentication.

| Package | Command |
| --- | --- |
| Core | `npm publish --workspace @natura11y/core --tag latest --access public` |
| React beta | `npm publish --workspace @natura11y/react --tag beta --access public` |
| React stable | `npm publish --workspace @natura11y/react --tag latest --access public` |

### Trusted publisher setup

Configure this once in npm for both Core and React:

| Setting | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization | `Natura11y` |
| Repository | `root` |
| Workflow | `publish.yml` |
| Allowed action | `npm publish` |
| Environment | Leave empty unless the workflow uses a matching GitHub environment. |

## Deploy the documentation

The source is `apps/docs`; the built site is `apps/docs/dist`. After the referenced npm versions are published, verify the release and start [deploy-docs.yml](.github/workflows/deploy-docs.yml):

```sh
npm run verify:docs-release
gh workflow run deploy-docs.yml --ref main -f release_ref=main
```

The verification command builds the site, checks that source and built HTML use full package versions matching the workspace manifests, rejects legacy unscoped `natura11y` references, and checks that the Core CSS, Core JavaScript, and Icons CSS are available on jsDelivr. The deployment workflow repeats this gate for the selected commit before uploading.

The workflow stages the upload, backs up production under `private_html/.deploy-backups`, preserves `/v1` through `/v4` and `/.well-known`, and synchronizes the new site. If synchronization fails, it restores the backup. It then purges affected caches and checks the live release manifest and CDN versions using ordinary URLs without cache-busting parameters.

Repository configuration required by this workflow:

- Variables: `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_PATH`.
- Encrypted secrets: `CLOUDWAYS_SSH_PRIVATE_KEY`, `CLOUDWAYS_KNOWN_HOSTS`.

Use a dedicated key for the Natura11y Cloudways application and keep it out of Git. Check the workflow result and live release before treating deployment as complete.

## Deploy examples and Storybook

[pages.yml](.github/workflows/pages.yml) runs on pushes to `main` and supports manual dispatch. It builds Core and Storybook, then uploads `pages-dist` directly to GitHub Pages:

- Core examples and templates retain their URLs under `/root/packages/core/dist/html/`.
- Storybook is published at `/root/storybook/`.
- The root `index.html` redirects visitors to `gonatura11y.com`.

The normal local Storybook build produces `apps/storybook/dist`; the Pages workflow overrides that output location with `pages-dist/storybook`. Check the deployment result and affected public examples after a release.
