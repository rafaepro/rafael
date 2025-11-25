import React, { useState } from 'react';
import { Sparkles, Upload, ArrowRight, X, Download } from 'lucide-react';
import { editImageWithGemini } from '../services/geminiService';

interface MagicImageEditorProps {
  onClose: () => void;
  onSave: (img: string) => void;
}

const MagicImageEditor: React.FC<MagicImageEditorProps> = ({ onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await editImageWithGemini(selectedImage, prompt);
      setGeneratedImage(result);
    } catch (err) {
      setError("Não foi possível processar a imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-rose-100 flex justify-between items-center bg-rose-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h2 className="font-semibold text-rose-800">Editor Mágico (IA)</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full">
            <X className="w-5 h-5 text-rose-800" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-rose-200 rounded-2xl p-8 text-center bg-rose-50/50">
              <Upload className="w-12 h-12 text-rose-300 mx-auto mb-4" />
              <p className="text-rose-800 font-medium mb-2">Carregue uma foto</p>
              <p className="text-sm text-gray-500 mb-4">Pode ser uma refeição, uma foto de progresso ou selfie.</p>
              <label className="inline-block px-6 py-2 bg-rose-500 text-white rounded-full cursor-pointer hover:bg-rose-600 transition">
                Escolher Imagem
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black/5 aspect-square flex items-center justify-center">
                 <img 
                   src={generatedImage || selectedImage} 
                   alt="Preview" 
                   className="max-w-full max-h-full object-contain" 
                 />
                 {loading && (
                   <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-sm">
                     <div className="animate-spin rounded-full h-10 w-10 border-4 border-rose-500 border-t-transparent mb-3"></div>
                     <p className="text-rose-800 font-medium animate-pulse">A IA está trabalhando...</p>
                   </div>
                 )}
              </div>

              {!generatedImage && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">O que você deseja mudar?</label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Adicione um filtro vintage, melhore a iluminação, remova o fundo..."
                    className="w-full p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm h-24 resize-none"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || loading}
                    className="w-full py-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl font-medium shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Transformar
                  </button>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="w-full py-2 text-rose-500 text-sm"
                  >
                    Trocar imagem
                  </button>
                </div>
              )}

              {generatedImage && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setGeneratedImage(null)}
                    className="flex-1 py-3 border border-rose-200 text-rose-700 rounded-xl font-medium"
                  >
                    Tentar Novamente
                  </button>
                  <button 
                    onClick={() => onSave(generatedImage)}
                    className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Salvar
                  </button>
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MagicImageEditor;