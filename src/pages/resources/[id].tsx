import BaseLayout from "@/components/baseLayout/BaseLayout";
import {
  Box,
  CircularProgress,
  Fab,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { green } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { IResourcesProps, IResultsProps } from "../api/resources";
import { useSnackbar, VariantType } from "notistack";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import { getDataById, postData, updateData } from "@/libs/bd/RESTClient";

const validationSchema = object({
  name: string().required("Campo obrigatório"),
  description: string().min(1, "Campo obrigatório"),
  status: string().required("Campo obrigatório"),
}).required();

type TFormData = InferType<typeof validationSchema>;

const status = [
  {
    value: "ACTIVE",
    label: "Ativo",
  },
  {
    value: "INACTIVE",
    label: "Inativo",
  },
];

const url: string = "resources";

export default function AddEditResource() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [resource, setResource] = useState<IResourcesProps>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: yupResolver(validationSchema),
  });
  const router = useRouter();
  const { id } = router.query;

  const buttonSx = {
    ...(isLoading && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const isAddMode: boolean = Number(id) === 0 ? true : false;

  const onSubmit: SubmitHandler<TFormData> = (values: TFormData) => {
    setResource(values as IResourcesProps);

    switch (isAddMode) {
      case true:
        setIsPosting(true);
        break;
      case false:
        setIsUpdating(true);
        break;
    }
  };

  async function handleResponse(variant: VariantType, message: String) {
    enqueueSnackbar(message, { variant });
  }

  useEffect(() => {
    //se não estiver no modo de cadastro... carrega os dados do id fornecido
    if (!isAddMode && isLoading) {
      const fetchData = async () => {
        const response = await getDataById(`/api/${url}/${id}`);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IResourcesProps = json.data;

        if (success) {
          handleResponse("success", message);
          setIsLoading(false);
          setResource(data);
        } else {
          handleResponse("error", String(error));
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (isPosting) {
      const postingData = async () => {
        const response = await postData(`/api/${url}/${id}`, resource);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IResourcesProps = json.data;

        if (success) {
          handleResponse("success", message);
          setIsPosting(false);
          setIsLoading(false);
          reset();
          router.push(`/${url}`);
        } else {
          handleResponse("error", String(error));
        }
      };
      postingData();
    }
  }, [resource]);

  useEffect(() => {
    if (isUpdating) {
      const updatingData = async () => {
        const response = await updateData(`/api/${url}/${id}`, resource);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IResourcesProps = json.data;

        if (success) {
          handleResponse("success", message);
          setIsUpdating(false);
          setIsLoading(false);
          reset();
          router.push(`/${url}`);
        } else {
          handleResponse("error", String(error));
        }
      };
      updatingData();
    }
  }, [resource]);

  useEffect(() => {
    if (resource) {
      setValue("name", resource.name);
      setValue("description", resource.description);
      setValue("status", resource.status);
      setIsLoading(false);
    }
  }, [resource]);

  return (
    <BaseLayout title="Recursos" subtitle="Detalhes do recurso">
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "35ch" },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "45ch" },
            }}
          >
            <TextField
              label="Nome"
              type={"text"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.name}
              placeholder={"Insira o nome aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.name ? errors.name.message : ""}
              {...register("name")}
            />
          </Box>
          <Box>
            <TextField
              label="Descrição"
              type={"text"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.description}
              placeholder={"Insira a descrição aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.description ? errors.description.message : ""}
              {...register("description")}
            />
          </Box>
          <Box>
            <TextField
              id="filled-select-currency"
              select
              label="Status"
              value={isAddMode ? "INACTIVE" : resource?.status}
              error={!!errors.status}
              placeholder={"Selecione o status aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.status ? errors.status.message : ""}
              variant="filled"
              size="small"
              {...register("status")}
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ m: 1, position: "relative" }}>
            <Tooltip title="Salvar">
              <Fab
                aria-label="Salvar"
                color="primary"
                sx={buttonSx}
                onClick={handleSubmit(onSubmit)}
              >
                {isPosting || isUpdating ? <CheckIcon /> : <SaveIcon />}
              </Fab>
            </Tooltip>
            {isPosting ||
              (isUpdating && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    top: -6,
                    left: -6,
                    zIndex: 1,
                  }}
                />
              ))}
          </Box>
        </form>
      </Box>
    </BaseLayout>
  );
}
