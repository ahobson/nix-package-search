export function setupMenu(topMenuElement: HTMLDivElement) {
  // mark the menu as visible
  topMenuElement.removeAttribute('hidden')

  const menuItems =
    topMenuElement.querySelectorAll<HTMLElement>('.pure-menu-item')

  const contentIdFor = (menuId: string) => menuId.replace('menu-', '')

  const selectMenuItem = (menuId: string) => {
    const selectedElement = topMenuElement.querySelector('.pure-menu-selected')
    if (selectedElement) {
      selectedElement.classList.remove('pure-menu-selected')
      document
        .getElementById(contentIdFor(selectedElement.id))
        ?.setAttribute('hidden', 'true')
    }
    document.getElementById(menuId)?.classList.add('pure-menu-selected')
    document.getElementById(contentIdFor(menuId))?.removeAttribute('hidden')
  }

  menuItems.forEach((element) => {
    const menuLink = element.querySelector('a')
    if (menuLink) {
      menuLink.addEventListener('click', () => selectMenuItem(element.id))
    }
  })
}
