'use client';

import { useEffect, useState } from 'react';
import { MessageRow } from '@/types/message';
import { FiTrash2 } from 'react-icons/fi';
import Pagination from '@/components/ui/pagnition';
import { messageService } from '@/services/admin.MessageService';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fetchMessages = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await messageService.getAllMessages(page);
      setMessages(data?.messages || []);
      setCurrentPage(data?.currentPage || 1);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await messageService.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:gap-6 pb-16">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">User Messages</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">View and manage inquiries sent by users.</p>
      </div>

      <div className="w-full bg-white rounded-xl border border-slate-200/85 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-gray-600 divide-y divide-slate-100">
            <thead className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Sender</th>
                <th className="px-4 sm:px-6 py-3.5 min-w-[250px]">Message</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Date</th>
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400">Loading messages...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400">No messages found.</td></tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 sm:px-6 py-4 align-top whitespace-nowrap">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">{msg.senderName}</p>
                      <p className="text-[11px] sm:text-xs text-gray-400">{msg.email}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-700 text-xs sm:text-sm break-words max-w-xs sm:max-w-md">
                      {msg.message}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs text-slate-500 align-top whitespace-nowrap">

                        
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right align-top whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {deletingId === msg.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Delete?</span>
                            <button
                              onClick={() => handleDelete(msg.id)}
                              className="text-xs font-bold text-red-600 hover:underline"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="text-xs font-bold text-slate-500 hover:underline"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(msg.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex justify-center pb-10">
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page) => fetchMessages(page)} 
        />
      </div>
    </div>
  );
}