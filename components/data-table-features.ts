import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    filterFn_includesString,
    rowPaginationFeature,
    tableFeatures,
    rowSelectionFeature
} from "@tanstack/react-table"

export const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    paginatedRowModel: createPaginatedRowModel()
})

export type DataTableFeatures = typeof features