import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AiModel, InterfaceType, RalphConfig, GeneratedFile, AppLanguage, CliTool, ContextFile } from './types';
import { generateRalphSystem } from './services/ralphLogic';
import { getPresets, Preset } from './services/presets';
import { CodeViewer } from './components/CodeViewer';
import { getUiText, getInterfaceLabel, getCliToolLabel } from './services/i18n';
import saveAs from 'file-saver';
import { Bot, Settings, LayoutTemplate, Play, ShieldAlert, Cpu, Globe, Terminal, Upload, X, File as FileIcon, Image as ImageIcon, Library, Download, CheckCircle2, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

export default function App() {
  const [config, setConfig] = useState<RalphConfig>(() => {
    let initialLang = AppLanguage.IT;
    if (typeof window !== 'undefined' && navigator.language) {
      const code = navigator.language.split('-')[0].toLowerCase();
      switch (code) {
        case 'en': initialLang = AppLanguage.EN; break;
        case 'es': initialLang = AppLanguage.ES; break;
        case 'fr': initialLang = AppLanguage.FR; break;
        case 'de': initialLang = AppLanguage.DE; break;
        case 'it': initialLang = AppLanguage.IT; break;
        case 'pt': initialLang = AppLanguage.PT; break;
        case 'zh': initialLang = AppLanguage.ZH; break;
        case 'ja': initialLang = AppLanguage.JA; break;
      }
    }
    return {
      projectName: 'MyRalphApp',
      goal: 'Create a Todo List app with React and LocalStorage',
      model: AiModel.GOOGLE_GEMINI_3_PRO,
      interfaceType: InterfaceType.BASH_BASIC,
      cliTool: CliTool.MANUAL,
      includeDevBrowser: true,
      uiLanguage: initialLang,
      outputLanguage: initialLang,
      contextFiles: []
    };
  });

  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const presets = useMemo(() => getPresets(config.uiLanguage), [config.uiLanguage]);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleGenerate = () => {
    try {
      if (!config.projectName.trim()) {
        showNotification(getUiText(config.uiLanguage, 'projectName') + " required", 'error');
        return;
      }
      const files = generateRalphSystem(config);
      setGeneratedFiles(files);
      showNotification("Sistema Ralph generato con successo!", 'success');
    } catch (error) {
      console.error(error);
      showNotification("Errore durante la generazione: " + (error as Error).message, 'error');
    }
  };

  const handleApplyPreset = (preset: Preset) => {
    setConfig(prev => ({
      ...prev,
      ...preset.config,
      uiLanguage: prev.uiLanguage,
      outputLanguage: prev.outputLanguage,
      interfaceType: prev.interfaceType,
      cliTool: prev.cliTool
    }));
    setActivePreset(preset.id);
    setIsPresetDropdownOpen(false);
    showNotification(`Preset "${preset.title}" caricato!`, 'success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: ContextFile[] = [];
      const filesArray = Array.from(e.target.files) as File[];

      filesArray.forEach((file: File) => {
        const reader = new FileReader();
        const isImage = file.type.startsWith('image/');

        reader.onload = (event) => {
          if (event.target?.result) {
            newFiles.push({
              name: file.name,
              type: file.type,
              content: event.target.result as string,
              isImage: isImage
            });

            if (newFiles.length === filesArray.length) {
              setConfig(prev => ({
                ...prev,
                contextFiles: [...prev.contextFiles, ...newFiles]
              }));
            }
          }
        };

        if (isImage) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });

      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setConfig(prev => ({
      ...prev,
      contextFiles: prev.contextFiles.filter((_, i) => i !== index)
    }));
  };

  const downloadContextFile = (file: ContextFile) => {
    const blob = new Blob([file.content], { type: file.type });
    if (file.isImage) {
      saveAs(file.content, file.name);
    } else {
      saveAs(blob, file.name);
    }
  };

  const t = (key: any) => getUiText(config.uiLanguage, key);

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'Beginner': return t('diffBeginner');
      case 'Intermediate': return t('diffIntermediate');
      case 'Advanced': return t('diffAdvanced');
      case 'Expert': return t('diffExpert');
      default: return diff;
    }
  };

  const selectedPresetInfo = presets.find(p => p.id === activePreset);

  const groupedModels = {
    [t('group_google')]: [
      AiModel.GOOGLE_GEMINI_3_PRO,
      AiModel.GOOGLE_GEMINI_3_FLASH,
      AiModel.GOOGLE_GEMINI_2_5_FLASH
    ],
    [t('group_anthropic')]: [
      AiModel.CLAUDE_3_7_SONNET,
      AiModel.CLAUDE_3_5_OPUS,
      AiModel.CLAUDE_3_5_SONNET
    ],
    [t('group_openai')]: [
      AiModel.OPENAI_GPT_5,
      AiModel.OPENAI_O3,
      AiModel.OPENAI_O1,
      AiModel.OPENAI_GPT_4O
    ],
    [t('group_deepseek')]: [
      AiModel.DEEPSEEK_R1,
      AiModel.DEEPSEEK_V3,
      AiModel.LLAMA_4_405B
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                {t('appTitle')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('subTitle')}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-end sm:items-center">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              title={theme === 'light' ? t('themeDark') : t('themeLight')}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="flex items-center gap-2">
              <Globe size={16} className="text-slate-400" />
              <select
                name="uiLanguage"
                value={config.uiLanguage}
                onChange={handleInputChange}
                className="bg-transparent text-sm font-medium text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-200"
                title={t('uiLang')}
              >
                {Object.values(AppLanguage).map(lang => (
                  <option key={lang} value={lang} className="dark:bg-slate-900">{lang} (UI)</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 rounded">{t('lbl_code')}</span>
              <select
                name="outputLanguage"
                value={config.outputLanguage}
                onChange={handleInputChange}
                className="bg-transparent text-sm font-medium text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-200"
                title={t('outputLang')}
              >
                {Object.values(AppLanguage).map(lang => (
                  <option key={lang} value={lang} className="dark:bg-slate-900">{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto no-scrollbar pr-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors duration-300">
              <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 relative z-20">
                <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200">
                  <Library size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('presetsTitle')}</h2>
                </div>

                <button
                  onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border rounded-lg shadow-sm transition-all text-left group
                    ${isPresetDropdownOpen ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500'}
                  `}
                >
                  {selectedPresetInfo ? (
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">{selectedPresetInfo.title}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0
                             ${selectedPresetInfo.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            selectedPresetInfo.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              selectedPresetInfo.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          {getDifficultyLabel(selectedPresetInfo.difficulty)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{selectedPresetInfo.description}</p>
                    </div>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('presetPlaceholder')}</span>
                  )}
                  <div className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {isPresetDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {isPresetDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsPresetDropdownOpen(false)}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-40 max-h-[400px] overflow-y-auto overflow-x-hidden">
                      <div className="p-2 space-y-1">
                        {presets.map(preset => (
                          <button
                            key={preset.id}
                            onClick={() => {
                              handleApplyPreset(preset);
                              setIsPresetDropdownOpen(false);
                            }}
                            className={`w-full flex items-start p-3 rounded-lg text-left transition-colors relative
                                ${activePreset === preset.id
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
                              }`}
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold ${activePreset === preset.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                  {preset.title}
                                </span>
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded
                                     ${preset.difficulty === 'Beginner' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                    preset.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                      preset.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                  {getDifficultyLabel(preset.difficulty)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{preset.description}</p>
                            </div>
                            {activePreset === preset.id && (
                              <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0 mt-1" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200">
                <Settings size={20} />
                <h2 className="text-lg font-semibold">{t('configTitle')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('projectName')}
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={config.projectName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    placeholder={t('placeholder_project')}
                  />
                </div>

                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('goal')}
                  </label>
                  <textarea
                    id="goal"
                    name="goal"
                    rows={4}
                    value={config.goal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    placeholder={t('goalPlaceholder')}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t('goalHelp')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('uploadLabel')}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <Upload size={24} className="text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('uploadHelp')}</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                    />
                  </div>

                  {config.contextFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{config.contextFiles.length} {t('filesAttached')}</p>
                      <div className="flex flex-col gap-2">
                        {config.contextFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-sm group">
                            <div className="flex items-center gap-2 overflow-hidden">
                              {file.isImage ? <ImageIcon size={16} className="text-purple-500 shrink-0" /> : <FileIcon size={16} className="text-blue-500 shrink-0" />}
                              <span className="truncate text-slate-700 dark:text-slate-200 font-medium" title={file.name}>{file.name}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); downloadContextFile(file); }}
                                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded"
                                title={t('tip_download')}
                              >
                                <Download size={14} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                title={t('tip_remove')}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('model')}
                  </label>
                  <div className="relative">
                    <select
                      id="model"
                      name="model"
                      value={config.model}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200"
                    >
                      {Object.entries(groupedModels).map(([group, models]) => (
                        <optgroup key={group} label={group} className="dark:bg-slate-800">
                          {models.map(model => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {config.model.includes('Reasoning') || config.model.includes('o1') || config.model.includes('R1') ? (
                      <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <Cpu size={12} />
                        {t('modelHelp')}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label htmlFor="cliTool" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('cliTool')}
                  </label>
                  <div className="relative">
                    <select
                      id="cliTool"
                      name="cliTool"
                      value={config.cliTool}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200"
                    >
                      {Object.values(CliTool).map(tool => (
                        <option key={tool} value={tool}>{getCliToolLabel(config.uiLanguage, tool)}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <Terminal size={16} className="text-slate-400" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t('cliToolHelp')}
                  </p>
                </div>

                <div>
                  <label htmlFor="interfaceType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('interface')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(InterfaceType).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, interfaceType: type }))}
                        className={`px-3 py-2 text-sm border rounded-lg transition-all text-left ${config.interfaceType === type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                          : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                      >
                        {getInterfaceLabel(config.uiLanguage, type)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      name="includeDevBrowser"
                      checked={config.includeDevBrowser}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('devBrowser')}</span>
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-1">
                    {t('devBrowserHelp')}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleGenerate}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all transform active:scale-95"
                >
                  <Play size={20} fill="currentColor" />
                  {t('generateBtn')}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/50 flex gap-4">
              <div className="text-blue-600 dark:text-blue-400 shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">{t('freshContextTitle')}</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                  {t('whyFreshContext')}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {generatedFiles.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <LayoutTemplate size={20} />
                    {t('generatedAssets')}
                  </h2>
                  <span className="text-xs font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                    {generatedFiles.length} {t('filesCreated')}
                  </span>
                </div>
                <CodeViewer files={generatedFiles} lang={config.uiLanguage} />
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                <Bot size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('emptyStateTitle')}</p>
                <p className="text-sm">{t('emptyStateDesc')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-xl border flex items-center gap-3 z-50 animate-fade-in-up transition-all ${notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200' :
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-200' :
            'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-200'
          }`}>
          {notification.type === 'error' ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
          <span className="font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 opacity-60 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
