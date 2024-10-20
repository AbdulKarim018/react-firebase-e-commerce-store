export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const statusColorMap = {
  accepted: "success",
  pending: "warning",
  delivered: "success",
  cancelled: "error",
};

export const dateFormatter = (date) => {
  const d = new Date(date);
  const dateString = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  return dateString;
};
