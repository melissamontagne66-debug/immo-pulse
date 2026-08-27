import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { scriptTemplates, scriptCategories, searchScripts } from '@/data/scripts';
import { Search, Copy, Check, FileText, X } from 'lucide-react';

export function ScriptsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = searchQuery
    ? searchScripts(searchQuery)
    : selectedCategory
    ? scriptTemplates.filter(s => s.category === selectedCategory)
    : scriptTemplates;

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Scripts & Templates</h2>
        <p className="text-gray-500 mt-1">{scriptTemplates.length} scripts prêts à l'emploi - copie et adapte !</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setSelectedCategory(null); }}
          placeholder="Rechercher un script (ex: selection LeBonCoin, relance, objection...)"
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !selectedCategory && !searchQuery
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tous ({scriptTemplates.length})
        </button>
        {scriptCategories.map(cat => {
          const count = scriptTemplates.filter(s => s.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Scripts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(script => {
          const isExpanded = expandedId === script.id;
          return (
            <Card
              key={script.id}
              className={`transition-all duration-200 hover:shadow-md cursor-pointer ${isExpanded ? 'ring-2 ring-red-200' : ''}`}
              onClick={() => setExpandedId(isExpanded ? null : script.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{script.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{script.usage}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {script.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        <ScrollArea className="max-h-64">
                          <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-line text-sm text-gray-700 leading-relaxed font-mono">
                            {script.content}
                          </div>
                        </ScrollArea>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(script.content, script.id);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            copiedId === script.id
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {copiedId === script.id ? (
                            <><Check className="w-4 h-4" /> Copié !</>
                          ) : (
                            <><Copy className="w-4 h-4" /> Copier le script</>
                          )}
                        </button>
                      </div>
                    )}

                    {!isExpanded && (
                      <p className="text-xs text-red-600 mt-2 font-medium">Clique pour voir le script →</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun script ne correspond à ma recherche</p>
        </div>
      )}
    </div>
  );
}
