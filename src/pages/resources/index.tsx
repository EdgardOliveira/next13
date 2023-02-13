import BaseLayout from "@/components/baseLayout/BaseLayout";
import TableData from "@/components/tableData/TableData";
import { deleteData, getAllData } from "@/libs/bd/RESTClient";
import { DeleteForever, Edit } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar, VariantType } from "notistack";
import { useEffect, useState } from "react";
import { IResourcesProps, IResultsProps } from "../api/resources";

const url: string = "resources";

export default function Contatos() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [resources, setResources] = useState<IResourcesProps[]>([]);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const handleAdd = () => {
    router.push(`/${url}/0`);
  };

  const handleDelete = async (id: string) => {
    handleClickOpen();
    setDeleteId(id);
  };

  const handleEdit = async (id: string) => {
    router.push(`/${url}/${id}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setDeleteId("");
  };

  const handleConfirm = () => {
    setOpen(false);
    setIsDeleting(true);
  };

  async function handleResponse(variant: VariantType, message: String) {
    enqueueSnackbar(message, { variant });
  }

  const columns = [
    { field: "id", headerName: "ID's", flex: 0.5 },
    {
      field: "name",
      headerName: "NOMES",
      flex: 1,
    },
    {
      field: "description",
      headerName: "DESCRIÇÕES",
      flex: 1,
    },
    {
      field: "status",
      headerName: "ESTATUS",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "AÇÕES",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,
      headerAlign: "center",
      align: "center",

      renderCell: (params: any) => {
        const { id } = params.row;

        return (
          <Stack direction="row" spacing={2}>
            <Tooltip title="Excluir">
              <IconButton
                aria-label="excluir"
                onClick={() => handleDelete(String(id))}
                color={"error"}
              >
                <DeleteForever />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton
                aria-label="edit"
                onClick={() => handleEdit(String(id))}
                color={"warning"}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  useEffect(() => {
    if (isLoading) {
      const fetchData = async () => {
        const response = await getAllData(`/api/${url}`);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IResourcesProps[] = json.data;

        if (success) {
          handleResponse("success", message);
          setIsLoading(false);
          setResources(data);
        } else {
          handleResponse("error", String(error));
        }
      };
      fetchData();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isDeleting) {
      const deletingData = async () => {
        const result = await deleteData(`/api/${url}/${deleteId}`);
        const json = await result.json();
        const { success, message, error }: IResultsProps = json;

        switch (success) {
          case true:
            handleResponse("success", message);
            setIsDeleting(false);
            setDeleteId("");
            setIsLoading(true);
            break;
          case false:
            handleResponse("error", String(error));
            break;
          default:
            break;
        }
      };
      deletingData();
    }
  }, [isDeleting]);

  return (
    <BaseLayout
      title="Recursos"
      subtitle="Listagem de recursos do sistema"
      openDialog={open}
      onClose={handleCancel}
      onConfirm={handleConfirm}
    >
      <TableData
        columns={columns}
        rows={resources}
        isLoading={isLoading}
        addButton={handleAdd}
      ></TableData>
    </BaseLayout>
  );
}
