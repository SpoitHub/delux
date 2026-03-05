import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check, Loader2, Tag } from 'lucide-react';
import { useCrmCategories, useCreateCategory } from '../../features/crm/hooks';
import type { Category } from '../../entities/types';

interface Props {
  value: string;               // selected category id (string) or ''
  onChange: (id: string) => void;
  error?: string;
}

export function CategorySelect({ value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const newNameRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useCrmCategories();
  const createCategory = useCreateCategory();

  const selected = categories.find((c) => String(c.id) === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input when create mode opens
  useEffect(() => {
    if (creating) newNameRef.current?.focus();
  }, [creating]);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (cat: Category) => {
    onChange(String(cat.id));
    setOpen(false);
    setSearch('');
    setCreating(false);
  };

  const handleClear = () => {
    onChange('');
    setOpen(false);
    setSearch('');
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      const cat = await createCategory.mutateAsync(name);
      onChange(String(cat.id));
      setNewName('');
      setCreating(false);
      setOpen(false);
      setSearch('');
    } catch {
      // error stays, user can retry
    }
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === 'Escape') {
      setCreating(false);
      setNewName('');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between bg-white/5 border rounded-xl px-4 py-3 text-sm transition-colors text-left ${
          error ? 'border-red-500/50' : open ? 'border-[#39ff14]' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <span className={selected ? 'text-white font-medium' : 'text-gray-500'}>
          {selected ? selected.name : 'No Category'}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-white/5">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#39ff14] transition-colors"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {/* No category option */}
            <button
              type="button"
              onClick={handleClear}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors text-left ${
                !value ? 'text-[#39ff14]' : 'text-gray-400'
              }`}
            >
              {!value && <Check size={14} className="flex-shrink-0" />}
              {!!value && <span className="w-3.5 flex-shrink-0" />}
              No Category
            </button>

            {filtered.length === 0 && search && (
              <p className="px-4 py-3 text-gray-500 text-xs text-center">No categories found</p>
            )}

            {filtered.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors text-left ${
                  String(cat.id) === value ? 'text-[#39ff14]' : 'text-white'
                }`}
              >
                {String(cat.id) === value ? (
                  <Check size={14} className="flex-shrink-0" />
                ) : (
                  <Tag size={14} className="text-gray-500 flex-shrink-0" />
                )}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Create new */}
          {!creating ? (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold tracking-widest uppercase text-[#39ff14] hover:bg-[#39ff14]/5 transition-colors"
            >
              <Plus size={14} />
              Create New Category
            </button>
          ) : (
            <div className="p-2 flex gap-2">
              <input
                ref={newNameRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleCreateKeyDown}
                placeholder="Category name..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#39ff14] transition-colors"
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim() || createCategory.isPending}
                className="px-3 py-2 bg-[#39ff14] text-black rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-[#32e612] transition-colors flex items-center gap-1"
              >
                {createCategory.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Check size={12} />
                )}
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
