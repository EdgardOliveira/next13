import { Box, Button, Skeleton } from "@mui/material";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { blue, green, grey } from "@mui/material/colors";

const LoadingSkeleton = () => (
  <Box
    sx={{
      height: "max-content",
    }}
  >
    {[...Array(10)].map((_, index) => (
      <Skeleton key={index} variant="rectangular" sx={{ my: 4, mx: 1 }} />
    ))}
  </Box>
);

interface ITableProps {
  rows: any;
  columns: any;
  isLoading: boolean;
  addButton: () => void;
}

const TableData = ({ rows, columns, isLoading, addButton }: ITableProps) => {
  function CustomGridToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button startIcon={<AddIcon />} onClick={addButton}>
          Add
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: green,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: blue,
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: grey,
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: blue,
          },
          "& .MuiCheckbox-root": {
            color: `${green} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${grey} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          autoHeight
          disableSelectionOnClick
          components={{
            Toolbar: CustomGridToolbar,
            LoadingOverlay: LoadingSkeleton,
          }}
          loading={isLoading}
          sx={{ minHeight: 600 }}
        />
      </Box>
    </Box>
  );
};

export default TableData;
