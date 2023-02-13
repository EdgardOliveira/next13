import prisma from "@/libs/bd/Db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Contacts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      getById(req, res);
      break;
    case "PUT":
      update(req, res);
      break;
    case "DELETE":
      deleteById(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Método: ${method} não é permitido para esta rota`);
  }
}

async function update(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const resource = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(404).json({
        success: false,
        message: "É necessário fornecer um id",
        data: [],
        error: "Não foi fornecido um id",
      });
    }

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "É necessário dados para atualizar",
        data: [],
        error: "Não foram fornecidos dados para atualizar",
      });
    }

    const updateResource = await prisma.resource.update({
      where: {
        id: Number(id),
      },
      data: resource,
    });

    return res.status(200).json({
      success: true,
      message: "Dados atualizados com sucesso!",
      data: updateResource,
      error: "",
    });
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

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (!id || isNaN(Number(id))) {
      return res.status(404).json({
        success: false,
        message: "É necessário fornecer um id",
        data: [],
        error: "Não foi fornecido um id",
      });
    }

    const results = await prisma.resource.delete({
      where: {
        id: Number(id),
      },
    });

    if (results) {
      return res.status(200).json({
        success: true,
        message: "Registro excluído com sucesso",
        data: results,
        error: "",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Nenhum resultado encontrado",
        data: [],
        error: "Não encontramos o registro para ser excluído",
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(404).json({
        success: false,
        message: "Não conseguimos excluir o registro",
        data: [],
        error: e.message,
      });
    }
  }
}

async function getById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    if (!id || isNaN(Number(id))) {
      return res.status(404).json({
        success: false,
        message: "É necessário fornecer um id",
        data: [],
        error: "Não foi fornecido um id",
      });
    }

    const results = await prisma.resource.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (results) {
      return res.status(200).json({
        success: true,
        message: "Registro consultado com sucesso",
        data: results,
        error: "",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Nenhum resultado encontrado",
        data: [],
        error: "Não encontramos o registro para ser exibido",
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(404).json({
        success: false,
        message: "Não conseguimos consultar o registro",
        data: [],
        error: e.message,
      });
    }
  }
}
