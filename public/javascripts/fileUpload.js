
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginImageResize,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageEdit,
)
FilePond.setOptions({
  maxFileSize: 5000000,
  stylePanelAspectRatio: 200/300,
  imageResizeTargetWidth: 200,
  imageResizeTargetHeight: 300,
  acceptedFileTypes: ["image/jpeg", "image/png", "image/gif"],
});

FilePond.parse(document.body);
