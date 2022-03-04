const usePagination = ({
    pageNum,
    itemCount,
    pageSize,
    maxLinks,
}: IUsePagination): [string[], boolean, boolean] => {
    const pageCount = Math.ceil(itemCount / pageSize)
    const enableFwd = pageNum < pageCount
    const enableBack = pageNum > 1

    const linkCount = Math.min(pageCount, maxLinks)
    const midCell = Math.ceil(linkCount / 2)

    const buttonLabels: string[] = Array(Math.min(pageCount, linkCount))
        .fill('')
        .map((_, i) => {
            let paginationLinkText = ''

            switch (i) {
                // Left Side (constant)
                case 0:
                case 1:
                    paginationLinkText = String(i + 1)
                    break

                // Right Side (constant)
                case linkCount - 2:
                case linkCount - 1:
                    paginationLinkText = String(pageCount - linkCount + i + 1)
                    break

                // (Potential) Dots cells
                case 2:
                    paginationLinkText = String(pageNum > 5 ? '...' : i + 1)
                    break

                case linkCount - 3:
                    if (pageNum <= pageCount - 5) paginationLinkText = '...'
                    else paginationLinkText = String(pageCount - 2)
                    break

                // Middle Cells (vary)

                default:
                    if (pageNum <= midCell) {
                        paginationLinkText = String(i + 1)
                        break
                    }

                    const startNum = Math.min(pageNum - 1, pageCount - 5)

                    paginationLinkText = String(startNum - 1 + i - 2)
            }

            return paginationLinkText
        })

    return [buttonLabels, enableFwd, enableBack]
}

export default usePagination
