import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getApiAxiosConfig } from "../../../state/actions/axiosConfig";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({
    req,
    secret: "doesnt_matter_but_has_to_be_passed_through",
    raw: true,
  });

  let query = req.query.q;
  if (!query) return;

  query = query.toString();

  try {
    const response = await axios(getApiAxiosConfig("/search/modelcars", "GET", token, query));

    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);

    if (!err.response) return res.status(500).json({ error: "Server error" });
    res.status(err.response.status).end();
  }
};

export default handler;
