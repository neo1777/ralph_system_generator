import React, { useState } from 'react';
import { GeneratedFile, AppLanguage } from '../types';
import { Copy, Check, FileText, Download, Package, Image as ImageIcon } from 'lucide-react';
import * as JSZip from 'jszip';
import saveAs from 'file-saver';
import { getUiText } from '../services/i18n';

interface CodeViewerProps {
  files: GeneratedFile[];
  lang: AppLanguage;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files, lang }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);

  const t = (key: any) => getUiText(lang, key);

  const handleCopy = async () => {
    if (files[activeTab]) {
      await navigator.clipboard.writeText(files[activeTab].content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();

      files.forEach(file => {
        // JSZip handles paths automatically (e.g. ".idx/dev.nix")
        if (file.binaryData) {
          zip.file(file.filename, file.binaryData);
        } else {
          zip.file(file.filename, file.content);
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "ralph-system.zip");
    } catch (err) {
      console.error("Failed to zip", err);
      alert(t('err_zip'));
    } finally {
      setZipping(false);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full transition-colors duration-300">
      {/* Tab Header with ZIP Action */}
      <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mask-gradient">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === idx
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              {file.binaryData ? <ImageIcon size={14} /> : <FileText size={14} />}
              {file.filename}
            </button>
          ))}
        </div>

        <div className="pl-2 border-l border-slate-300 dark:border-slate-600">
          <button
            onClick={handleDownloadZip}
            disabled={zipping}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            title={t('tip_download_zip')}
          >
            {zipping ? <Package size={16} className="animate-spin" /> : <Download size={16} />}
            {t('lbl_download_zip')}
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{files[activeTab].description}</h3>
      </div>

      <div className="relative flex-grow bg-slate-900 group">
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
          title={t('tip_copy')}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <pre className="p-4 text-sm font-mono text-slate-300 overflow-auto h-full max-h-[500px]">
          <code>{files[activeTab].content}</code>
        </pre>
      </div>
    </div>
  );
};