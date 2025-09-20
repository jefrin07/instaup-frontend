import Cropper from "react-easy-crop";

const CropModal = ({
  image,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancel,
  onConfirm,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg relative w-96 h-96 flex flex-col">
      <div className="flex-1 relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={onConfirm}
        >
          Crop
        </button>
      </div>
    </div>
  </div>
);

export default CropModal;
