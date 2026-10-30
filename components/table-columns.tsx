"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./data-table-features"

export type Log = {
    temperature: number,
    internalEnergy: number,
    pressure: number,
    volume: number,
    moles: number
}

const columnHelperr = createColumnHelper<DataTableFeatures, Log>();

export const columns = columnHelperr.columns([
    columnHelperr.accessor("temperature", {
        header: "Temperature (K)"
    }),
    columnHelperr.accessor("internalEnergy", {
        header: "Internal Energy (J)"
    }),
    columnHelperr.accessor("pressure", {
        header: "Pressure (Pa)"
    }),
    columnHelperr.accessor("volume", {
        header: "Volume (m³)"
    }),
    columnHelperr.accessor("moles", {
        header: "Amount of Gas (moles)"
    }),
])