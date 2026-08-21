import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FolderPlus, 
  Folder, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Bold, 
  Italic, 
  Underline, 
  Highlighter, 
  Check, 
  X, 
  FolderOpen,
  ChevronRight,
  Cloud,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Settings,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Note, NoteFolder } from '../types';
import { 
  fetchFoldersForUser, 
  saveFolderToCloud, 
  deleteFolderFromCloud,
  fetchNotesForUser, 
  saveNoteToCloud, 
  deleteNoteFromCloud 
} from '../lib/firebase';

interface NotesModuleProps {
  currentUser: User;
}

const DEFAULT_FOLDERS: NoteFolder[] = [
  { id: 'f_plantao', userId: 'global', name: 'Plantão PS', icon: '🚨', color: 'bg-rose-500', createdAt: new Date().toISOString() },
  { id: 'f_casos', userId: 'global', name: 'Casos Clínicos', icon: '🩺', color: 'bg-teal-500', createdAt: new Date().toISOString() },
  { id: 'f_estudos', userId: 'global', name: 'Resumos & Aulas', icon: '📚', color: 'bg-purple-500', createdAt: new Date().toISOString() }
];

const EMOJI_OPTIONS = ['📁', '🚨', '🩺', '📚', '💉', '🏥', '👶', '🧬', '💊', '🔬', '⭐', '📝', '📌', '🧠', '🫀'];

const CLINICAL_SYMBOLS = [
  { label: '≥', symbol: '≥' },
  { label: '≤', symbol: '≤' },
  { label: '>', symbol: '>' },
  { label: '<', symbol: '<' },
  { label: '±', symbol: '±' },
  { label: '→', symbol: '→' },
  { label: '°C', symbol: '°C' },
  { label: 'mg/kg', symbol: 'mg/kg' },
  { label: 'mcg/kg/min', symbol: 'mcg/kg/min' }
];

export default function NotesModule({ currentUser }: NotesModuleProps) {
  // --- States ---
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Folder Modal states (Create / Edit)
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<NoteFolder | null>(null);
  const [folderName, setFolderName] = useState('');
  const [folderIcon, setFolderIcon] = useState('📁');

  // Editor states for active note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteFolderId, setNoteFolderId] = useState('root');
  const editorRef = useRef<HTMLDivElement>(null);

  // --- Load Folders and Notes from Firebase (with local storage fallback) ---
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      
      const localFolders = localStorage.getItem(`medical_app_folders_${currentUser.id}`);
      const localNotes = localStorage.getItem(`medical_app_notes_${currentUser.id}`);
      
      let initialFolders: NoteFolder[];
      if (localFolders !== null) {
        try {
          initialFolders = JSON.parse(localFolders);
        } catch {
          initialFolders = DEFAULT_FOLDERS.map(f => ({ ...f, userId: currentUser.id }));
        }
      } else {
        initialFolders = DEFAULT_FOLDERS.map(f => ({ ...f, userId: currentUser.id }));
        localStorage.setItem(`medical_app_folders_${currentUser.id}`, JSON.stringify(initialFolders));
        initialFolders.forEach(f => saveFolderToCloud(f));
      }

      let initialNotes: Note[] = localNotes ? JSON.parse(localNotes) : [];

      if (isMounted) {
        setFolders(initialFolders);
        setNotes(initialNotes);
        if (initialNotes.length > 0 && !activeNoteId) {
          setActiveNoteId(initialNotes[0].id);
        }
      }

      // Fetch cloud data
      const cloudFolders = await fetchFoldersForUser(currentUser.id);
      const cloudNotes = await fetchNotesForUser(currentUser.id);

      if (isMounted) {
        if (cloudFolders) {
          setFolders(cloudFolders);
          localStorage.setItem(`medical_app_folders_${currentUser.id}`, JSON.stringify(cloudFolders));
        }
        if (cloudNotes && cloudNotes.length > 0) {
          setNotes(cloudNotes);
          localStorage.setItem(`medical_app_notes_${currentUser.id}`, JSON.stringify(cloudNotes));
          if (!activeNoteId) {
            setActiveNoteId(cloudNotes[0].id);
          }
        }
        setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [currentUser.id]);

  // Active note object
  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId) || null, [notes, activeNoteId]);

  // Sync active note state to editor fields
  useEffect(() => {
    if (activeNote) {
      setNoteTitle(activeNote.title);
      setNoteFolderId(activeNote.folderId || 'root');
      if (editorRef.current) {
        editorRef.current.innerHTML = activeNote.content || '';
      }
    } else {
      setNoteTitle('');
      setNoteFolderId('root');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  }, [activeNoteId]);

  // --- Auto-Save helper ---
  const saveActiveNote = async () => {
    if (!activeNoteId || !editorRef.current) return;
    setIsSaving(true);
    const htmlContent = editorRef.current.innerHTML;

    const updatedNote: Note = {
      id: activeNoteId,
      userId: currentUser.id,
      title: noteTitle.trim() || 'Anotação sem título',
      folderId: noteFolderId,
      content: htmlContent,
      updatedAt: new Date().toISOString(),
      createdAt: activeNote?.createdAt || new Date().toISOString()
    };

    setNotes(prev => {
      const next = prev.map(n => n.id === activeNoteId ? updatedNote : n);
      localStorage.setItem(`medical_app_notes_${currentUser.id}`, JSON.stringify(next));
      return next;
    });

    await saveNoteToCloud(updatedNote);
    setIsSaving(false);
  };

  // --- Folder Actions ---
  const openCreateFolderModal = () => {
    setEditingFolder(null);
    setFolderName('');
    setFolderIcon('📁');
    setShowFolderModal(true);
  };

  const openEditFolderModal = (folder: NoteFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(folder);
    setFolderName(folder.name);
    setFolderIcon(folder.icon || '📁');
    setShowFolderModal(true);
  };

  const handleSaveFolder = async () => {
    if (!folderName.trim()) return;

    if (editingFolder) {
      // Edit existing folder
      const updatedFolder: NoteFolder = {
        ...editingFolder,
        name: folderName.trim(),
        icon: folderIcon,
        userId: currentUser.id
      };

      const nextFolders = folders.map(f => f.id === editingFolder.id ? updatedFolder : f);
      setFolders(nextFolders);
      localStorage.setItem(`medical_app_folders_${currentUser.id}`, JSON.stringify(nextFolders));
      await saveFolderToCloud(updatedFolder);
    } else {
      // Create new folder
      const newFolder: NoteFolder = {
        id: `folder_${Date.now()}`,
        userId: currentUser.id,
        name: folderName.trim(),
        icon: folderIcon,
        color: 'bg-rose-500',
        createdAt: new Date().toISOString()
      };

      const nextFolders = [...folders, newFolder];
      setFolders(nextFolders);
      localStorage.setItem(`medical_app_folders_${currentUser.id}`, JSON.stringify(nextFolders));
      setSelectedFolderId(newFolder.id);
      await saveFolderToCloud(newFolder);
    }

    setShowFolderModal(false);
    setFolderName('');
    setEditingFolder(null);
  };

  const handleDeleteFolder = async (folderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Deseja realmente excluir esta pasta? As notas contidas nela serão mantidas e movidas para "Sem Pasta".')) {
      const nextFolders = folders.filter(f => f.id !== folderId);
      setFolders(nextFolders);
      localStorage.setItem(`medical_app_folders_${currentUser.id}`, JSON.stringify(nextFolders));

      // Move notes to 'root'
      const nextNotes = notes.map(n => n.folderId === folderId ? { ...n, folderId: 'root' } : n);
      setNotes(nextNotes);
      localStorage.setItem(`medical_app_notes_${currentUser.id}`, JSON.stringify(nextNotes));

      if (selectedFolderId === folderId) {
        setSelectedFolderId('all');
      }

      setShowFolderModal(false);
      setEditingFolder(null);

      await deleteFolderFromCloud(folderId);
    }
  };

  // --- Auto List Markdown Shortcut Handler (* or - or 1.) ---
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;

      if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent) return;

      // Ignore if already inside a list item
      const parentElem = textNode.parentElement;
      if (parentElem && parentElem.closest('li')) return;

      const cursorOffset = range.startOffset;
      const textBefore = textNode.textContent.substring(0, cursorOffset);

      const matchBullet = textBefore.match(/^(\*|-|•)\s*$/);
      const matchNumber = textBefore.match(/^(1\.|1)\s*$/);

      if (!matchBullet && !matchNumber) return;

      // Check preceding siblings in the same parent element to ensure we are at line start
      let prevSibling = textNode.previousSibling;
      let hasPrecedingTextOnSameLine = false;
      let brNodeToClean: Node | null = null;

      while (prevSibling) {
        if (prevSibling.nodeName === 'BR') {
          brNodeToClean = prevSibling;
          break;
        }
        if (prevSibling.textContent && prevSibling.textContent.trim().length > 0) {
          hasPrecedingTextOnSameLine = true;
          break;
        }
        prevSibling = prevSibling.previousSibling;
      }

      if (hasPrecedingTextOnSameLine) return;

      e.preventDefault();

      const isOrdered = !!matchNumber;
      const listTag = isOrdered ? 'ol' : 'ul';
      const textAfter = textNode.textContent.substring(cursorOffset);

      // Create list elements
      const listElem = document.createElement(listTag);
      const liElem = document.createElement('li');

      if (textAfter.trim()) {
        liElem.textContent = textAfter;
      } else {
        liElem.innerHTML = '<br>';
      }
      listElem.appendChild(liElem);

      if (brNodeToClean) {
        const container = brNodeToClean.parentNode || parentElem || editorRef.current;
        if (container) {
          const nextTarget = textNode.nextSibling;
          container.removeChild(brNodeToClean);
          if (textNode.parentNode === container) {
            container.removeChild(textNode);
          }
          if (nextTarget && nextTarget.parentNode === container) {
            container.insertBefore(listElem, nextTarget);
          } else {
            container.appendChild(listElem);
          }
        }
      } else {
        if (parentElem && parentElem !== editorRef.current && parentElem.childNodes.length === 1) {
          parentElem.parentNode?.replaceChild(listElem, parentElem);
        } else if (textNode.parentNode) {
          textNode.parentNode.replaceChild(listElem, textNode);
        }
      }

      // Move cursor inside liElem
      const newRange = document.createRange();
      const newSel = window.getSelection();
      newRange.selectNodeContents(liElem);
      newRange.collapse(true);
      if (newSel) {
        newSel.removeAllRanges();
        newSel.addRange(newRange);
      }

      saveActiveNote();
    }
  };

  // --- Note Actions ---
  const handleCreateNote = async () => {
    const targetFolder = selectedFolderId === 'all' ? 'root' : selectedFolderId;
    const newNote: Note = {
      id: `note_${Date.now()}`,
      userId: currentUser.id,
      folderId: targetFolder,
      title: 'Nova Anotação',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const nextNotes = [newNote, ...notes];
    setNotes(nextNotes);
    setActiveNoteId(newNote.id);
    localStorage.setItem(`medical_app_notes_${currentUser.id}`, JSON.stringify(nextNotes));

    await saveNoteToCloud(newNote);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  };

  const handleDeleteNote = async (noteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Tem certeza de que deseja excluir esta nota?')) {
      const nextNotes = notes.filter(n => n.id !== noteId);
      setNotes(nextNotes);
      localStorage.setItem(`medical_app_notes_${currentUser.id}`, JSON.stringify(nextNotes));

      if (activeNoteId === noteId) {
        setActiveNoteId(nextNotes[0]?.id || null);
      }

      await deleteNoteFromCloud(noteId);
    }
  };

  // --- Rich Text Editing Commands ---
  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    saveActiveNote();
  };

  const insertSymbol = (symbol: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      if (editorRef.current) {
        editorRef.current.innerHTML += ` ${symbol} `;
      }
    } else {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(` ${symbol} `);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    saveActiveNote();
  };

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      if (selectedFolderId !== 'all') {
        if (selectedFolderId === 'root' && n.folderId && n.folderId !== 'root') return false;
        if (selectedFolderId !== 'root' && n.folderId !== selectedFolderId) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const rawContent = n.content.replace(/<[^>]+>/g, '').toLowerCase();
        return n.title.toLowerCase().includes(q) || rawContent.includes(q);
      }
      return true;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, selectedFolderId, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-[10px] uppercase tracking-widest border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5">
              <Cloud size={12} /> Sincronizado na Nuvem (Firebase)
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Caderno de Notas Médicas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Crie pastas organizadas e escreva notas de maneira simples, ampla e bonita.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={openCreateFolderModal}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <FolderPlus size={16} />
            <span>+ Nova Pasta</span>
          </button>
          <button
            onClick={handleCreateNote}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Nova Nota</span>
          </button>
        </div>
      </div>

      {/* TOP FOLDERS BAR (Organização Horizontal de Pastas) */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Folder size={14} className="text-rose-600" /> Pastas & Seleção
          </span>
          <button
            onClick={openCreateFolderModal}
            className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
          >
            <Plus size={14} /> Criar Pasta
          </button>
        </div>

        {/* Folders Badges Grid / Scroll */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
          
          {/* Badge: Todas as Notas */}
          <button
            onClick={() => setSelectedFolderId('all')}
            className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              selectedFolderId === 'all'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>📁</span>
            <span>Todas as Notas</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedFolderId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {notes.length}
            </span>
          </button>

          {/* Badge: Sem Pasta */}
          <button
            onClick={() => setSelectedFolderId('root')}
            className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              selectedFolderId === 'root'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>📄</span>
            <span>Sem Pasta</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedFolderId === 'root' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {notes.filter(n => !n.folderId || n.folderId === 'root').length}
            </span>
          </button>

          {/* User & Default Folders */}
          {folders.map(f => {
            const count = notes.filter(n => n.folderId === f.id).length;
            const isSelected = selectedFolderId === f.id;

            return (
              <div
                key={f.id}
                onClick={() => setSelectedFolderId(f.id)}
                className={`group shrink-0 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{f.icon || '📁'}</span>
                <span>{f.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {count}
                </span>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1 ml-1">
                  <button
                    onClick={(e) => openEditFolderModal(f, e)}
                    className={`p-1 rounded-lg transition-colors ${isSelected ? 'hover:bg-rose-700 text-white' : 'hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-500'}`}
                    title="Editar Pasta"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteFolder(f.id, e)}
                    className={`p-1 rounded-lg transition-colors ${isSelected ? 'hover:bg-rose-700 text-white' : 'hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500'}`}
                    title="Excluir Pasta"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN LAYOUT: VERTICAL & WIDE (2 Columns: List on Left 3.5 cols | Editor on Right 8.5 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* COLUMN 1: LISTA DE NOTAS (3.5 cols or Hidden when Maximized) */}
        {!isMaximized && (
          <div className="md:col-span-4 lg:col-span-3.5 bg-white dark:bg-slate-900 rounded-[28px] p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col">
            
            {/* Search Box & New Note Button */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Notas ({filteredNotes.length})
                </span>
                <button
                  onClick={handleCreateNote}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Nota
                </button>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar notas..."
                  className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-rose-500/20"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Note Cards List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 max-h-[550px]">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => {
                  const isSelected = note.id === activeNoteId;
                  const rawContent = note.content.replace(/<[^>]+>/g, '');
                  const folder = folders.find(f => f.id === note.folderId);

                  return (
                    <div
                      key={note.id}
                      onClick={() => setActiveNoteId(note.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer group relative ${
                        isSelected
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-rose-700 dark:text-rose-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {note.title || 'Anotação sem título'}
                        </h4>
                        <button
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                          title="Excluir Nota"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug font-normal mb-2">
                        {rawContent || 'Sem conteúdo extra'}
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                        <span>{new Date(note.updatedAt).toLocaleDateString('pt-BR')}</span>
                        <span className="font-bold">{folder?.name || 'Sem Pasta'}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4 space-y-2">
                  <FileText size={28} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Nenhuma nota encontrada</p>
                  <button
                    onClick={handleCreateNote}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
                  >
                    + Criar Nota
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COLUMN 2: EDITOR AMPLO DA NOTA (8.5 cols or Full 12 cols when Maximized) */}
        <div className={`${isMaximized ? 'md:col-span-12' : 'md:col-span-8 lg:col-span-8.5'} bg-white dark:bg-slate-900 rounded-[28px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-4`}>
          
          {activeNote ? (
            <>
              {/* Note Header Controls */}
              <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    onBlur={saveActiveNote}
                    placeholder="Título da nota..."
                    className="w-full text-xl font-bold text-slate-900 dark:text-white bg-transparent outline-none border-b border-transparent focus:border-rose-500 transition-colors"
                  />

                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title={isMaximized ? "Restaurar visualização" : "Expandir largura do editor"}
                  >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    <span className="hidden sm:inline">{isMaximized ? "Restaurar" : "Expandir Editor"}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">Salvar na Pasta:</span>
                    <select
                      value={noteFolderId}
                      onChange={(e) => {
                        setNoteFolderId(e.target.value);
                        setTimeout(saveActiveNote, 100);
                      }}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                    >
                      <option value="root">📄 Sem Pasta</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.icon || '📁'} {f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                      {isSaving ? (
                        <span className="text-amber-500">Salvando no Firebase...</span>
                      ) : (
                        <span className="text-emerald-500 flex items-center gap-1"><Check size={12} /> Salvo na nuvem</span>
                      )}
                    </span>

                    <button
                      onClick={() => handleDeleteNote(activeNote.id)}
                      className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                {/* Text Formatting Buttons */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => executeCommand('bold')}
                    className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Negrito"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    onClick={() => executeCommand('italic')}
                    className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Itálico"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    onClick={() => executeCommand('underline')}
                    className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Sublinhado"
                  >
                    <Underline size={16} />
                  </button>
                  <button
                    onClick={() => executeCommand('hiliteColor', '#fef08a')}
                    className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Destacar Amarelo"
                  >
                    <Highlighter size={16} />
                  </button>

                  <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

                  <button
                    onClick={() => executeCommand('insertUnorderedList')}
                    className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Lista com Marcadores"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => executeCommand('insertOrderedList')}
                    className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Lista Numerada"
                  >
                    <ListOrdered size={16} />
                  </button>
                </div>

                {/* Quick Clinical Symbols Bar */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Símbolos Médicos:</span>
                  {CLINICAL_SYMBOLS.map(item => (
                    <button
                      key={item.label}
                      onClick={() => insertSymbol(item.symbol)}
                      className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 rounded-lg border border-slate-200 dark:border-slate-600 font-mono text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rich Text Editor Content Area */}
              <div className="flex-1 min-h-[420px] flex flex-col">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={saveActiveNote}
                  onBlur={saveActiveNote}
                  onKeyDown={handleEditorKeyDown}
                  data-placeholder="Digite suas observações médicas aqui..."
                  className="flex-1 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80 text-base leading-relaxed text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-rose-500/20 overflow-y-auto custom-scrollbar [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
                />
              </div>

              {/* Note Footer */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium pt-1">
                <span>Criado em: {new Date(activeNote.createdAt).toLocaleDateString('pt-BR')} às {new Date(activeNote.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>Última atualização: {new Date(activeNote.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-3">
              <FileText size={48} className="text-slate-300" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Nenhuma nota selecionada</p>
              <button
                onClick={handleCreateNote}
                className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
              >
                + Criar Nova Nota
              </button>
            </div>
          )}
        </div>

      </div>

      {/* CREATE / EDIT FOLDER MODAL */}
      <AnimatePresence>
        {showFolderModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFolderModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {editingFolder ? 'Editar Pasta' : 'Criar Nova Pasta'}
                </h3>
                <button onClick={() => setShowFolderModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Nome da Pasta</label>
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Ex: Infectologia, Plantão PS, Casos"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500/20"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Ícone Emoticon</label>
                  <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {EMOJI_OPTIONS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFolderIcon(emoji)}
                        className={`w-9 h-9 rounded-xl text-base flex items-center justify-center transition-all cursor-pointer ${
                          folderIcon === emoji ? 'bg-rose-600 text-white shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {editingFolder && (
                  <button
                    onClick={() => handleDeleteFolder(editingFolder.id)}
                    type="button"
                    className="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-2xl font-bold text-xs"
                    title="Excluir Pasta"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={handleSaveFolder}
                  disabled={!folderName.trim()}
                  className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-rose-700 disabled:opacity-50 cursor-pointer shadow-md shadow-rose-600/20"
                >
                  {editingFolder ? 'Salvar Alterações' : 'Criar Pasta'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
