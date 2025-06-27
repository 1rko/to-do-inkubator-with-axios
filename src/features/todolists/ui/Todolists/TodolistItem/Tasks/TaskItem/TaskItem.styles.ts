import { SxProps } from "@mui/material"

export const getListItemSx = (status: boolean): SxProps => ({
  p: 0,
  justifyContent: "space-between",
  opacity: status ? 0.5 : 1,
})
