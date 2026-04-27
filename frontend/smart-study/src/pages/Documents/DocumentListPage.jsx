import React, { useState, useEffect } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import DocumentCard from "../../components/documents/DocumentCard";
import { useAuth } from "../../context/AuthContext";

const DocumentListPage = () => {
  const { isAuthenticated } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ================= FETCH =================
  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();

      if (Array.isArray(data)) setDocuments(data);
      else if (Array.isArray(data.documents)) setDocuments(data.documents);
      else if (Array.isArray(data.data)) setDocuments(data.data);
      else setDocuments([]);
    } catch (err) {
      toast.error(err.message || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchDocuments();
    else setLoading(false);
  }, [isAuthenticated]);

  // ================= FILE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  // ================= UPLOAD =================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle) {
      toast.error("Please select file & title");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Uploaded successfully");

      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");

      fetchDocuments();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= DELETE =================
  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await documentService.deleteDocument(selectedDoc._id);

      setDocuments((prev) =>
        prev.filter((d) => d._id !== selectedDoc._id)
      );

      toast.success("Deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // ================= UI =================
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (!documents.length) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>No documents yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={() => handleDeleteRequest(doc)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">My Documents</h1>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg
          bg-emerald-500 hover:bg-emerald-600 transition duration-200"
        >
          <Plus size={18} />
          Upload Document
        </button>
      </div>

      {renderContent()}

      {/* ================= UPLOAD MODAL ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">

          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl relative">

            {/* Close */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold mb-1">
              Upload New Document
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Add a document to your library (PDF, DOCX, PPT supported)
            </p>

            <form onSubmit={handleUpload} className="space-y-5">

              {/* Title */}
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. React Interview Prep"
                className="w-full h-11 px-4 border rounded-xl bg-slate-50
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />

              {/* Upload Box */}
              <div
                onClick={() =>
                  document.getElementById("file-upload-input").click()
                }
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 mx-auto mb-2 text-emerald-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <p className="text-sm">
                  {uploadFile ? uploadFile.name : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-gray-500">Document up to 10MB</p>
              </div>

              <input
                id="file-upload-input"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.pptx,.ppt"
                className="hidden"
              />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 h-11 border rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 h-11 text-white rounded-xl
                  bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {isDeleteModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center relative">

            {/* Close */}
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <Trash2 className="mx-auto text-red-500 mb-3" />

            <h2 className="text-lg font-semibold mb-2">
              Confirm Deletion
            </h2>

            <p className="text-sm mb-6">
              Are you sure you want to delete "<span className="font-bold">{selectedDoc.title}</span>"? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;