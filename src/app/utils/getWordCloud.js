import axios from "axios";

export const getWorldCloud = async (casts) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };
  const data = await axios.get(
    `https://quickchart.io/wordcloud?text=${casts}`,
    options
  );

  return data?.data;
};
