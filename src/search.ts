import showIcon from './eye.svg?raw'
import hideIcon from './eye-crossed.svg?raw'

import { IPackage, prefixSearch } from './config/DBConfig'

function nixExpression(pkg: IPackage): HTMLPreElement {
  const pre = document.createElement('pre')
  pre.innerHTML = `
    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "${pkg.name}";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "${pkg.sha}";
    }) {}).${pkg.nixPackageName}
`
  return pre
}

export function setupSearch(element: HTMLDivElement) {
  const input = element.querySelector<HTMLInputElement>('input')!
  const tbody = element.querySelector<HTMLTableElement>('tbody')!

  const nixPkgInfoTmpl =
    document.querySelector<HTMLTemplateElement>('#nix-pkg-info-tmpl')!
  const nixPkgExprTmpl =
    document.querySelector<HTMLTemplateElement>('#nix-pkg-expr-tmpl')!

  const addPackageResult = (pkg: IPackage) => {
    const infoRow = nixPkgInfoTmpl.content.cloneNode(true)
    if (!(infoRow instanceof DocumentFragment)) {
      return
    }
    infoRow.querySelector<HTMLElement>('.nix-pkg-info-name')!.innerHTML =
      pkg.name
    infoRow.querySelector<HTMLElement>(
      '.nix-pkg-info-nixPackageName'
    )!.innerHTML = pkg.nixPackageName
    infoRow.querySelector<HTMLElement>('.nix-pkg-info-sha')!.innerHTML = pkg.sha
    const exprRow = nixPkgExprTmpl.content.cloneNode(true)
    if (!(exprRow instanceof DocumentFragment)) {
      return
    }
    exprRow.querySelector('.nix-pkg-expr')!.replaceChildren(nixExpression(pkg))
    const showHideElement = infoRow.querySelector<HTMLElement>(
      '.nix-pkg-info-show-hide'
    )!
    const exprTr = exprRow.querySelector('tr')!
    exprTr.setAttribute('hidden', 'true')
    showHideElement.innerHTML = showIcon

    showHideElement.addEventListener('click', () => {
      if (exprTr.getAttribute('hidden')) {
        showHideElement.innerHTML = hideIcon
        exprTr.removeAttribute('hidden')
      } else {
        showHideElement.innerHTML = showIcon
        exprTr.setAttribute('hidden', 'true')
      }
    })

    tbody.appendChild(infoRow)
    tbody.appendChild(exprRow)
  }

  input.addEventListener('input', () => {
    const searchPrefix = input.value
    tbody.replaceChildren()
    if (searchPrefix.length > 0) {
      prefixSearch(searchPrefix).then((searchResults) => {
        searchResults.forEach((pkg) => {
          addPackageResult(pkg)
        })
      })
    }
  })
}
