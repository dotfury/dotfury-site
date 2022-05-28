const cleanFields = (fields) => {
  return { ...fields };
};

const sanitizeBasicData = (data) => {
  const { fields } = data;

  return { ...cleanFields(fields) };
};

const sanitizeArray = (data) => {
  return data.map(({ fields, sys: { id } }) => {
    return { ...cleanFields(fields), id };
  });
};

const sanitizeImage = (data) => {
  const {
    fields: {
      file: { url },
    },
  } = data;

  return url;
};

module.exports = {
  sanitizeBasicData,
  sanitizeArray,
  sanitizeImage,
};
