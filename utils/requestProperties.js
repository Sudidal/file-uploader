function getFileIdReqParamAsInt(req) {
  if (req?.params?.fileId) {
    return parseInt(req.params.fileId) || null;
  }
  return null;
}
function getFolderIdReqParamAsInt(req) {
  if (req?.params?.folderId) {
    return parseInt(req.params.folderId) || null;
  }
  return null;
}

export { getFileIdReqParamAsInt, getFolderIdReqParamAsInt };
