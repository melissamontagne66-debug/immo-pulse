import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { knowledgeModules, categories, searchKnowledge } from '@/data/knowledgeBase';
import type { KnowledgeModule } from '@/types';
import { Search, BookOpen, X, Filter } from 'lucide-react';

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<KnowledgeModule | null>(null);

  const filteredModules = searchQuery
    ? searchKnowledge(searchQuery)
    : selectedCategory
    ? knowledgeModules.filter(m => m.category === selectedCategory)
    : knowledgeModules;

  const getCategoryStyle = (cat: string) => {
    const catInfo = categories.find(c => c.id === cat);
    return catInfo || { label: cat, color: 'bg-gray-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Base de Connaissances</h2>
          <p className="text-gray-500 mt-1">{knowledgeModules.length} modules de formation disponibles</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setSelectedCategory(null); }}
          placeholder="Rechercher une formation (ex: R1, mandat, prospection...)"
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !selectedCategory && !searchQuery
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-3 h-3" />
          Tous
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${cat.color}`} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModules.map(module => {
          const catStyle = getCategoryStyle(module.category);
          return (
            <Card
              key={module.id}
              className="hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedModule(module)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${catStyle.color} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${catStyle.color}`}>
                        {catStyle.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {module.content.substring(0, 120)}...
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-gray-400">
                        {module.keyPoints.length} points clés
                      </span>
                      {module.scripts && module.scripts.length > 0 && (
                        <span className="text-xs text-gray-400">
                          • {module.scripts.length} scripts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun module ne correspond à ta recherche</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
          >
            Voir tous les modules
          </button>
        </div>
      )}

      {/* Module Detail Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" />
              {selectedModule?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedModule && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${getCategoryStyle(selectedModule.category).color}`}>
                    {getCategoryStyle(selectedModule.category).label}
                  </span>
                </div>

                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedModule.content}
                  </div>
                </div>

                {selectedModule.keyPoints.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-5">
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <span className="text-red-500">🔑</span> Points clés à retenir
                    </h4>
                    <ul className="space-y-2">
                      {selectedModule.keyPoints.map((kp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                          <span className="text-red-500 mt-0.5 flex-shrink-0">✓</span>
                          {kp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedModule.scripts && selectedModule.scripts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>📝</span> Scripts
                    </h4>
                    <div className="space-y-3">
                      {selectedModule.scripts.map((script, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
                          <p className="text-sm text-gray-700 italic">"{script}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
