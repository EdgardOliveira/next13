import prisma from "@/libs/bd/Db";
import { NextApiRequest, NextApiResponse } from "next";

export interface IResourcesProps {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface IResultsProps {
  success: boolean;
  message: string;
  data?: IResourcesProps[];
  error?: string;
}

export default async function Resources(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      getAll(req, res);
      break;
    case "POST":
      create(req, res);
      break;
    default:
      res
        .status(405)
        .setHeader("Allow", ["GET", "POST"])
        .json({
          success: false,
          message: `Método: ${method} não é permitido para esta rota`,
          data: [],
          error: `Método: ${method} não é permitido para esta rota`,
        });
  }
}

async function create(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resource = req.body;

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "É necessário dados para cadastrar",
        data: [],
        error: "Não foram fornecidos dados para cadastrar",
      });
    }

    const result = await prisma.resource.findFirst({
      where: {
        name: resource.name,
      },
    });

    if (!result) {
      const createdResource = await prisma.resource.create({ data: resource });

      return res.status(201).json({
        success: true,
        message: "Dados cadastrados com sucesso!",
        data: createdResource,
        error: "",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Dados já existem!",
        data: [],
        error: "Os dados já existem!",
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Ocorreu um erro ao tentar cadastrar",
        data: [],
        error: e.message,
      });
    }
  }
}

async function getAll(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await prisma.resource.findMany();

    return res.status(200).json({
      success: true,
      message: "Consulta de dados realizada com sucesso",
      data: results,
      error: "",
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Não conseguimos realizar a consulta dos dados",
        data: [],
        error: e.message,
      });
    }
  }
}
