export interface InfiniteScrollOptions<T = {}, K = {}> {
  box: string | HTMLElement
  templateBox: string | HTMLTemplateElement
  fetchItems: (page: number, lastResponse: K, setResponse: (res: K) => void) => Promise<T[]>
  loadingPlaceholder?: string | HTMLTemplateElement
  loadingPlaceholderCount?: number
  itemConfigurator?: (item: T, element: HTMLElement) => void
}

export default class InfiniteScroll<T = {}, K = {}> {
  private ended = false
  private content: HTMLElement
  private template: HTMLTemplateElement
  private fetchItemsFn: (page: number, lastResponse: K, setResponse: (res: K) => void) => Promise<T[]>
  private loadingPlaceholderTemplate: HTMLTemplateElement | null
  private itemConfigurator?: (item: T, element: HTMLElement) => void
  private loadingPlaceholderCount: number
  private lastResponse: K | any
  private page: number
  private loading: boolean
  private scrolledDown = false

  constructor(options: InfiniteScrollOptions<T, K>) {
    this.content = typeof options.box === 'string' ? document.getElementById(options.box)! : options.box
    this.template = typeof options.templateBox === 'string' ? (document.getElementById(options.templateBox) as HTMLTemplateElement) : options.templateBox
    this.fetchItemsFn = options.fetchItems
    this.loadingPlaceholderTemplate = options.loadingPlaceholder ? (typeof options.loadingPlaceholder === 'string' ? (document.getElementById(options.loadingPlaceholder) as HTMLTemplateElement) : options.loadingPlaceholder) : null
    this.loadingPlaceholderCount = options.loadingPlaceholderCount || 1
    this.itemConfigurator = options.itemConfigurator
    this.page = 1
    this.loading = false

    this.init()
  }

  private init() {
    this.loadItems()
    window.addEventListener('scroll', this.onScroll.bind(this))
  }
  private end() {
    this.ended = true
    window.removeEventListener('scroll', this.onScroll.bind(this))
  }

  private async loadItems() {
    if (this.loading) {
      this.scrolledDown = true
      return
    }

    this.loading = true
    this.showLoadingPlaceholders()
    const items = await this.fetchItemsFn(this.page, this.lastResponse, (res) => {
      this.lastResponse = res
    })
    this.hideLoadingPlaceholders()
    if (items.length == 0) {
      this.end()
      return
    }

    items.forEach((item) => {
      const clone = this.template.content.cloneNode(true) as DocumentFragment
      this.configureItem(clone, item)
      this.content.appendChild(clone)
    })
    const scrolledDown = document.body.clientHeight > window.innerHeight;
    const hasVerticalScrollbar = document.body.clientHeight > window.innerHeight;
    if (!hasVerticalScrollbar || scrolledDown) {
      setTimeout(() => this.loadItems(), 1000)
    }
    this.page++
    this.loading = false
  }

  private configureItem(clone: DocumentFragment, item: T) {
    if (this.itemConfigurator) {
      const element = clone.firstElementChild as HTMLElement | null
      if (element) {
        this.itemConfigurator(item, element)
      }
    }
  }
  private showLoadingPlaceholders() {
    if (this.loadingPlaceholderTemplate) {
      for (let i = 0; i < this.loadingPlaceholderCount; i++) {
        const clone = this.loadingPlaceholderTemplate.content.cloneNode(true) as DocumentFragment
        const firstElement = clone.firstElementChild as HTMLElement | null
        if (firstElement) {
          firstElement.classList.add('loading-placeholder')
          this.content.appendChild(clone)
        }
      }
    }
  }

  private hideLoadingPlaceholders() {
    const placeholders = this.content.querySelectorAll('.loading-placeholder')
    placeholders.forEach((placeholder) => {
      this.content.removeChild(placeholder)
    })
  }

  private onScroll() {
    if (this.ended) return
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
      this.loadItems()
    }
  }
}