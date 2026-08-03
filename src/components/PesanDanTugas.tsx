import React, { useState } from 'react';
import { Send, CheckCircle, Clock, AlertCircle, MessageSquare, ShieldCheck, UserCheck, Plus } from 'lucide-react';
import { User, Message, Task } from '../types';

interface PesanDanTugasProps {
  currentUser: User | null;
  users: User[];
  messages: Message[];
  tasks: Task[];
  onSendMessage: (msg: Omit<Message, 'id' | 'created_at'>) => void;
  onAddTask: (task: Omit<Task, 'id' | 'created_at' | 'status'>) => void;
  onUpdateTaskStatus: (taskId: number, status: 'pending' | 'done', notes?: string) => void;
}

export const PesanDanTugas: React.FC<PesanDanTugasProps> = ({
  currentUser,
  users,
  messages,
  tasks,
  onSendMessage,
  onAddTask,
  onUpdateTaskStatus
}) => {
  const [activeTab, setActiveTab] = useState<'pesan' | 'tugas'>('tugas');

  // New Message Form State
  const [receiverId, setReceiverId] = useState<number>(users[1]?.id || 2);
  const [messageText, setMessageText] = useState('');

  // New Task Form State
  const [taskMandorId, setTaskMandorId] = useState<number>(users.find(u => u.role === 'Mandor')?.id || 3);
  const [taskBlok, setTaskBlok] = useState('Blok A2');
  const [taskDesc, setTaskDesc] = useState('');

  // Mandor Task Verification Modal / Inline Notes
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [mandorNotes, setMandorNotes] = useState('');

  // Role permissions
  const role = currentUser?.role || 'Admin';

  const availableReceivers = users.filter((u) => u.id !== currentUser?.id);

  const handleSendMsgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentUser) return;

    const receiver = users.find((u) => u.id === Number(receiverId));
    onSendMessage({
      sender_id: currentUser.id,
      sender_name: currentUser.nama_lengkap || currentUser.username,
      sender_role: currentUser.role,
      receiver_id: Number(receiverId),
      receiver_name: receiver?.nama_lengkap || receiver?.username,
      receiver_role: receiver?.role,
      message_text: messageText,
      is_read: false
    });

    setMessageText('');
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDesc.trim() || !currentUser) return;

    const mandorUser = users.find((u) => u.id === Number(taskMandorId));

    onAddTask({
      manager_id: currentUser.id,
      manager_name: currentUser.nama_lengkap || currentUser.username,
      mandor_id: Number(taskMandorId),
      mandor_name: mandorUser?.nama_lengkap || mandorUser?.username,
      task_description: taskDesc,
      blok_name: taskBlok
    });

    setTaskDesc('');
  };

  const handleVerifySubmit = (taskId: number, newStatus: 'done' | 'pending') => {
    onUpdateTaskStatus(taskId, newStatus, mandorNotes);
    setSelectedTaskId(null);
    setMandorNotes('');
  };

  return (
    <div className="space-y-6">
      {/* PAGE TITLE & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700" />
            <span>Pesan & Verifikasi Tugas Mandor</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fitur komunikasi hirarki (Admin → Manajer → Mandor) & Verifikasi Hasil Lapangan.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('tugas')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'tugas'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi Tugas Mandor ({tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pesan')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'pesan'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Pesan & Instruksi ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VERIFIKASI TUGAS MANDOR */}
      {activeTab === 'tugas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: ADD TASK FORM (For Admin & Manager) */}
          {(role === 'Admin' || role === 'Manajer') && (
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Plus className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-sm">Beri Instruksi / Tugas Mandor</h3>
              </div>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Mandor Lapangan</label>
                  <select
                    value={taskMandorId}
                    onChange={(e) => setTaskMandorId(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    {users
                      .filter((u) => u.role === 'Mandor')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nama_lengkap} ({u.username})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Blok Kebun</label>
                  <input
                    type="text"
                    required
                    value={taskBlok}
                    onChange={(e) => setTaskBlok(e.target.value)}
                    placeholder="Contoh: Blok A2 / Afdeling 1"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deskripsi Tugas / Perintah</label>
                  <textarea
                    required
                    rows={4}
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Contoh: Evaluasi pemupukan dan kebersihan piringan pohon sawit pasca evaluasi DSS..."
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Perintah Tugas</span>
                </button>
              </form>
            </div>
          )}

          {/* RIGHT: LIST OF TASKS & MANDOR VERIFICATION ACTIONS */}
          <div className={`${role === 'Mandor' ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center justify-between">
                <span>Daftar Tugas & Verifikasi Mandor</span>
                <span className="text-xs font-normal text-slate-500">
                  Role Saat Ini: <strong className="text-emerald-700 uppercase">{role}</strong>
                </span>
              </h3>

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center italic">
                    Belum ada tugas instruksi penugasan mandor.
                  </p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        task.status === 'done'
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              task.status === 'done'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {task.status === 'done' ? 'Selesai (Verified)' : 'Belum Selesai (Pending)'}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {task.blok_name || 'Blok Kebun'}
                          </span>
                        </div>

                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Dibuat: {task.created_at}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 font-medium mb-3 leading-relaxed">
                        {task.task_description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
                        <div>
                          <strong>Manajer:</strong> {task.manager_name || 'Manajer Suputra'} →{' '}
                          <strong>Mandor:</strong> {task.mandor_name || 'Mandor Rahmat'}
                        </div>

                        {task.verified_at && (
                          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Diverifikasi pada: {task.verified_at}</span>
                          </div>
                        )}
                      </div>

                      {task.notes && (
                        <div className="mt-2 text-xs text-slate-600 bg-slate-100 p-2 rounded-lg italic border-l-2 border-emerald-600">
                          <strong>Catatan Lapangan Mandor:</strong> "{task.notes}"
                        </div>
                      )}

                      {/* VERIFICATION CONTROLS (Mandor action OR Admin/Manager test toggle) */}
                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">
                          Status Verifikasi Pekerjaan:
                        </span>

                        <div className="flex gap-2">
                          {task.status === 'pending' ? (
                            <button
                              onClick={() => {
                                setSelectedTaskId(task.id);
                              }}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Verifikasi "SELESAI"</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, 'pending')}
                              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span>Set "BELUM SELESAI"</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* MANDOR INPUT NOTES BOX */}
                      {selectedTaskId === task.id && (
                        <div className="mt-3 p-3 bg-white border border-emerald-300 rounded-lg space-y-2">
                          <label className="block text-xs font-bold text-slate-700">
                            Masukkan Catatan Hasil Lapangan Mandor:
                          </label>
                          <input
                            type="text"
                            value={mandorNotes}
                            onChange={(e) => setMandorNotes(e.target.value)}
                            placeholder="Contoh: Pemupukan NPK selesai & piringan bersih 100%..."
                            className="w-full text-xs p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedTaskId(null)}
                              className="px-3 py-1 text-xs bg-slate-200 text-slate-700 font-bold rounded-md"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerifySubmit(task.id, 'done')}
                              className="px-3 py-1 text-xs bg-emerald-600 text-white font-bold rounded-md shadow-2xs"
                            >
                              Konfirmasi Selesai
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PESAN & INSTRUKSI HIRARKI */}
      {activeTab === 'pesan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SEND MESSAGE FORM */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-slate-800 text-sm">Kirim Pesan / Instruksi Baru</h3>
            </div>

            <form onSubmit={handleSendMsgSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tujuan Penerima</label>
                <select
                  value={receiverId}
                  onChange={(e) => setReceiverId(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  {availableReceivers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nama_lengkap} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Pesan Instruksi</label>
                <textarea
                  required
                  rows={5}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Tuliskan pesan instruksi atau koordinasi..."
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan</span>
              </button>
            </form>
          </div>

          {/* MESSAGE LOG LIST */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm mb-4">
              Kotak Pesan & Riwayat Komunikasi
            </h3>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center italic">
                  Belum ada pesan tercatat dalam sistem.
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold text-slate-800">
                          {msg.sender_name || 'Pengirim'}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                          {msg.sender_role || 'User'}
                        </span>
                        <span className="text-slate-400 text-xs">→</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {msg.receiver_name || 'Penerima'} ({msg.receiver_role})
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400">{msg.created_at}</span>
                    </div>

                    <p className="text-xs text-slate-700 font-normal leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                      {msg.message_text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
