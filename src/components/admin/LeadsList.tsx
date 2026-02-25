'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatDate } from '@/lib/utils'
import { Download, Eye, CheckCircle, XCircle, Clock, FileSpreadsheet, Trash2 } from 'lucide-react'

interface Lead {
  id: string
  name: string
  birthDate: string
  birthTime?: string | null
  city: string
  birthCity?: string | null
  contact: string
  request: string
  status: string
  productSlug?: string | null
  productTitle?: string | null
  amount?: number | null
  orderId?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  createdAt: string
  notes?: string | null
}

export function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleting, setDeleting] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/admin/leads?${params}`)
      const data = await response.json()

      setLeads(data.leads)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedStatus, page])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)))
    }
  }

  const deleteLeads = async (ids: string[]) => {
    if (ids.length === 0) return
    if (!confirm(`Удалить ${ids.length} заявок?`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      if (!res.ok) throw new Error('Ошибка удаления')
      setSelectedIds(new Set())
      fetchLeads()
    } catch (error) {
      console.error(error)
      alert('Ошибка при удалении')
    } finally {
      setDeleting(false)
    }
  }

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      fetchLeads()
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const exportFile = async (format: 'csv' | 'xlsx') => {
    try {
      const params = new URLSearchParams({ format })
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/admin/leads/export?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting leads:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'archived':
        return <XCircle className="w-5 h-5 text-gray-400" />
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4 items-center">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2 bg-purple-600/80 rounded-lg text-white border border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="contacted">Связались</option>
            <option value="completed">Завершены</option>
            <option value="archived">Архив</option>
          </select>
          <button
            onClick={() => exportFile('xlsx')}
            className="px-4 py-2 bg-green-600/80 rounded-lg text-white hover:bg-green-500 
                     transition-colors flex items-center gap-2 border border-green-400/30"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={() => exportFile('csv')}
            className="px-4 py-2 bg-purple-600/80 rounded-lg text-white hover:bg-purple-500 
                     transition-colors flex items-center gap-2 border border-purple-400/30"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          {selectedIds.size > 0 && (
            <button
              onClick={() => deleteLeads(Array.from(selectedIds))}
              disabled={deleting}
              className="px-4 py-2 bg-red-600/80 rounded-lg text-white hover:bg-red-500 
                       transition-colors flex items-center gap-2 border border-red-400/30 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Удалить ({selectedIds.size})
            </button>
          )}
        </div>
        <div className="text-white">
          Всего: {leads.length} заявок
        </div>
      </div>

      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={leads.length > 0 && selectedIds.size === leads.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-white/30 bg-white/10"
                  />
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">Имя</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Продукт</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Оплата</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Контакты</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Город</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Город рождения</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Статус</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Дата</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="w-4 h-4 rounded border-white/30 bg-white/10"
                    />
                  </td>
                  <td className="px-6 py-4 text-white">{lead.name}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {lead.productTitle ? (
                      <span title={lead.amount ? `${(lead.amount / 100).toLocaleString('ru-KZ')} ₸` : ''}>
                        {lead.productTitle}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {lead.orderId ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-600/30 text-green-300 text-xs font-medium">
                        Оплачено
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-600/30 text-amber-300 text-xs font-medium">
                        Не оплачено
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{lead.contact}</td>
                  <td className="px-6 py-4 text-gray-300">{lead.city}</td>
                  <td className="px-6 py-4 text-gray-300">{lead.birthCity || '-'}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${
                      lead.status === 'completed' ? 'bg-green-600/30 text-green-300 border border-green-500/50' :
                      lead.status === 'archived' ? 'bg-gray-600/30 text-gray-300 border border-gray-500/50' :
                      lead.status === 'contacted' ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50' :
                      'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                    }`}>
                      {getStatusIcon(lead.status)}
                      <span className="capitalize font-medium">
                        {lead.status === 'contacted' ? 'Связались' : lead.status === 'completed' ? 'Завершена' : lead.status === 'archived' ? 'Архив' : 'Новая'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 bg-purple-600/80 rounded-lg hover:bg-purple-500 transition-colors border border-purple-400/30"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => deleteLeads([lead.id])}
                        disabled={deleting}
                        className="p-2 bg-red-600/80 rounded-lg hover:bg-red-500 transition-colors border border-red-400/30 disabled:opacity-50"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                      {lead.status === 'new' && (
                        <button
                          onClick={() => updateLeadStatus(lead.id, 'contacted')}
                          className="px-3 py-1.5 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500 transition-colors font-medium"
                        >
                          Связались
                        </button>
                      )}
                      {lead.status === 'contacted' && (
                        <button
                          onClick={() => updateLeadStatus(lead.id, 'completed')}
                          className="px-3 py-1.5 bg-green-600 rounded-lg text-white text-sm hover:bg-green-500 transition-colors font-medium"
                        >
                          Завершить
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-purple-600/80 rounded-lg text-white border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500"
          >
            Назад
          </button>
          <span className="px-4 py-2 text-white">
            Страница {page} из {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-purple-600/80 rounded-lg text-white border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500"
          >
            Вперед
          </button>
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold gradient-text">Детали заявки</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-white hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4 text-white">
              <div>
                <strong>Имя:</strong> {selectedLead.name}
              </div>
              <div>
                <strong>Дата рождения:</strong> {formatDate(selectedLead.birthDate)}
                {selectedLead.birthTime && ` в ${selectedLead.birthTime}`}
              </div>
              <div>
                <strong>Город:</strong> {selectedLead.city}
              </div>
              {selectedLead.birthCity && (
                <div>
                  <strong>Город рождения:</strong> {selectedLead.birthCity}
                </div>
              )}
              <div>
                <strong>Контакты:</strong> {selectedLead.contact}
              </div>
              <div>
                <strong>Продукт:</strong>{' '}
                {selectedLead.productTitle
                  ? `${selectedLead.productTitle}${selectedLead.amount ? ` · ${(selectedLead.amount / 100).toLocaleString('ru-KZ')} ₸` : ''}`
                  : '—'}
              </div>
              <div>
                <strong>Статус оплаты:</strong>{' '}
                {selectedLead.orderId ? (
                  <span className="text-green-400 font-semibold">Оплачено</span>
                ) : (
                  <span className="text-amber-400">Не оплачено</span>
                )}
              </div>
              <div>
                <strong>Запрос:</strong>
                <p className="mt-2 text-gray-300 whitespace-pre-wrap">{selectedLead.request}</p>
              </div>
              {selectedLead.utmSource && (
                <div>
                  <strong>UTM Source:</strong> {selectedLead.utmSource}
                </div>
              )}
              {selectedLead.utmMedium && (
                <div>
                  <strong>UTM Medium:</strong> {selectedLead.utmMedium}
                </div>
              )}
              {selectedLead.utmCampaign && (
                <div>
                  <strong>UTM Campaign:</strong> {selectedLead.utmCampaign}
                </div>
              )}
              <div>
                <strong>Дата создания:</strong> {formatDate(selectedLead.createdAt)}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-6 py-2 bg-purple-600/80 rounded-lg text-white hover:bg-purple-500 transition-colors font-medium"
              >
                ОК
              </button>
              <button
                onClick={() => {
                  deleteLeads([selectedLead.id])
                  setSelectedLead(null)
                }}
                disabled={deleting}
                className="px-4 py-2 bg-red-600/80 rounded-lg text-white hover:bg-red-500 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Удалить заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
