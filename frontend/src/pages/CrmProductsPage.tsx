import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCrmProducts, useDeleteCrmProduct } from '../features/crm/hooks';
import { useCategories } from '../features/products/hooks';
import { formatPrice } from '../shared/lib/formatters';
import { Spinner } from '../shared/ui/Spinner';
import { EmptyState } from '../shared/ui/EmptyState';
import { useToast } from '../shared/ui/toast-context';
import type { Product } from '../entities/types';

function stockStatus(product: Product) {
  if (product.stock_quantity === 0) return { label: 'Out of Stock', cls: 'bg-red-500/10 text-red-500 border border-red-500/20' };
  if (product.stock_quantity <= 10) return { label: 'Low Stock', cls: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' };
  return { label: 'In Stock', cls: 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' };
}

export const CrmProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useCrmProducts();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteCrmProduct();
  const { toast } = useToast();

  const filtered = products.filter((p) => {
    const matchSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !categoryFilter || p.category?.slug === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast('Product deleted.', 'success');
    } catch {
      toast('Failed to delete product.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">PRODUCTS</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Manage your merchandise inventory</p>
        </div>
        <Link
          to="/crm/products/new"
          className="bg-[#39ff14] text-black px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-xl px-4 py-3 outline-none focus:border-[#39ff14] w-full md:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      )}

      {/* Empty */}
      {!isLoading && products.length === 0 && (
        <EmptyState
          title="No Products Yet"
          description="Add your first product to get started"
          actionLabel="Add Product"
          actionTo="/crm/products/new"
        />
      )}

      {/* Table */}
      {!isLoading && products.length > 0 && (
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">ID</th>
                  <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Product</th>
                  <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Price</th>
                  <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Stock</th>
                  <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Status</th>
                  <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const { label, cls } = stockStatus(product);
                  const thumb = product.images?.find((i) => i.is_primary)?.image ?? product.images?.[0]?.image;
                  return (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-gray-500 text-xs font-bold tracking-widest uppercase">
                        PRD-{String(product.id).padStart(3, '0')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {thumb ? (
                            <img src={thumb} alt={product.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0" />
                          )}
                          <div>
                            <div className="text-white text-sm font-bold">{product.title}</div>
                            <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                              {product.category?.name ?? '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white text-sm font-black">{formatPrice(product.price)}</td>
                      <td className="p-4 text-gray-300 text-sm font-bold">{product.stock_quantity}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${cls}`}>
                          {label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/products/${product.id}`}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="View public page"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/crm/products/${product.id}/edit`}
                            className="p-2 text-gray-400 hover:text-[#39ff14] hover:bg-[#39ff14]/10 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 text-xs font-bold tracking-widest uppercase text-gray-500">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h2 className="text-xl font-black text-white">Delete Product?</h2>
              <p className="text-gray-400 text-sm">
                You are about to permanently delete{' '}
                <span className="text-white font-bold">"{deleteTarget.title}"</span>.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteProduct.isPending}
                className="flex-1 bg-red-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-3 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};