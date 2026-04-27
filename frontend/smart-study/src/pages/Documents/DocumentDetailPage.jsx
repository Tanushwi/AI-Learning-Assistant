import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import SimpleChatInterface from "../../components/chat/SimpleChatInterface";

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  const [summary, setSummary] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH DOCUMENT =================
  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // ================= CONTENT TAB =================
  const renderContent = () => {
    if (loading) return <Spinner />;

    const fileUrl = `http://localhost:8000/api/documents/${id}/file`;

    return (
      <iframe
        src={fileUrl}
        className="w-full h-[70vh] bg-white rounded border"
        title="PDF Viewer"
      />
    );
  };

  // ================= CHAT TAB =================
  const renderChat = () => {
    return <SimpleChatInterface />;
  };

  // ================= ACTIONS TAB =================
  const renderActions = () => {
    const text =
      document?.content ||
      document?.extractedText ||
      document?.data?.content ||
      document?.data?.extractedText ||
      "";

    const handleGenerateSummary = async () => {
      setGenerating(true);
      setError("");
      setSummary("");

      try {
        const response = await axiosInstance.post(
          "http://localhost:8000/api/summary",
          {
            text: text.slice(0, 8000),
          }
        );

        setSummary(response.data.summary);
        toast.success("Summary generated!");
      } catch (err) {
        setError("Failed to generate summary");
        console.error(err);
      } finally {
        setGenerating(false);
      }
    };

    return (
      <div className="p-6 space-y-6">
        <h3 className="text-xl font-bold">AI Actions</h3>

        <button
          onClick={handleGenerateSummary}
          disabled={generating}
          className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          {generating ? "Generating..." : "Generate Document Summary"}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {summary && (
          <div className="p-4 bg-green-50 rounded-lg border">
            <h4 className="font-bold mb-2">Summary:</h4>
            <p>{summary}</p>
          </div>
        )}
      </div>
    );
  };

  // ================= OTHER TABS =================
  const renderFlashcardsTab = () => <div className="p-4">Flashcards</div>;
  const renderQuizzesTab = () => <div className="p-4">Quizzes</div>;

  const tabs = [
    { name: "Content", label: "Content", content: renderContent },
    { name: "Chat", label: "Chat", content: renderChat },
    { name: "Actions", label: "AI Actions", content: renderActions },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab },
  ];

  // ================= LOADING =================
  if (loading) return <Spinner />;
  if (!document) return <div className="p-4">Document not found</div>;

  return (
    <div className="p-4">
      
      {/* 🔥 BACK BUTTON WITH ICON */}
      <Link
        to="/documents"
        className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-lg hover:bg-gray-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </Link>

      {/* HEADER */}
      <PageHeader title={document?.title || document?.data?.title} />

      {/* TABS */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailPage;